/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview algorithm to flow child nodes
 *
 * This is the hardest of all flow algorithms. The basics is straight
 * forward enough:
 *   given a bounding box, find child element on the "edge" of the boundingbox
 *   and move all subsequent children to the flowInto
 *
 * The reason it gets tricky is because
 *   a- it needs to handle cases where a child contains a flow-break,
 *   b- needs to support "reflow", thus first iterating in to existing flowing
 *      children before reflowing
 *   c- needs to ensure we never flow ALL content out, which could cause
 *      eternal loops of moving everything to flowInto, which then does the same
 *   d- needs to recurse in to it's children for futher flowing.
 *
 * For more details on flow algorithms for pagination:
 * http://goto.google.com/qowt-flow-algorithms
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/flowingElement',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/domUtils'
  ], function(
    FlowingElement,
    MixinUtils,
    DomUtils) {

  "use strict";

  // merge in the FlowingElement mixin
  return MixinUtils.mergeMixin(FlowingElement, {

    supports_: ['flow-children'],

    /**
     * Flow all the children within 'this' to 'this.flowInto'
     * Also supports spotting flow breaks and doing the right thing
     * For more info see: http://goto.google.com/qowt-flow-algorithms
     */
    flow: function(page) {
      var didFlowContent;
      if (!this.flowInto) {
        throw new Error(this.nodeName + ' tried to flow without a flowInto');
      }
      if (this.onFlowStart) {
        this.onFlowStart();
      }
      var repeat = true;
      while (!this.isEmpty(true) && repeat) {
        repeat = false;
        // reflow last child if required
        var childCount = this.children.length;
        if (this.nodeName === 'TD' || this.nodeName === 'TABLE' ||
          this.nodeName === 'QOWT-PAGE' || this.nodeName === 'QOWT-SECTION') {
          childCount = Polymer.dom(this).children.length;
        }
        var done = this.reflowEdgeChild_(page);
        // If we are processing 'QOWT-PAGE' and it has break-before or
        // break-after then we should reprocess because we have processed
        // the edge child but did not check for the breaks in a page.
        var rerenderPageContBreaks = this.nodeName === 'QOWT-PAGE' ?
            this.doesPageContainFlowBr_() : false;
        if (!done || rerenderPageContBreaks) {
          var columnCount = (this.getSection_ &&
              this.getSection_().getColumnCount()) || 1;
          if (columnCount !== 1) {
            didFlowContent = this.pushOutChildrenMultiColumn_(page,
                childCount);
          } else {
            didFlowContent = this.pushOutChildrenSingleColumn_(page,
                childCount);
          }

          // make sure we didn't just move ALL the content out, leaving a blank
          // page. This could happen if there is for example only one image on
          // the page, which is bigger than the page. In that edge case we have
          // to ensure it stays on the page and effectively gets clipped
          this.ensurePageNotLeftEmpty_();
          // if we didn't move anything out or flow any child, then we'll need
          // to see if we can absorb content. We do this by pulling in all
          // content from the flowInto and then repeating our flow algorithm.
          // This ensures we correctly reflow new edge children.
          if (!didFlowContent) {
            // remove the flowInto if we took all it's content already and move
            // on to the next flowInto to see if we can get content from there
            if (this.flowInto && this.flowInto.isEmpty(true)) {
              this.flowInto.removeFromFlow();
            }
            if (this.flowInto) {
              // note: flowInto might still be empty because the above
              // removeFromFlow might have failed (in case of table cells which
              // dont remove themselves). So in those cases find the next
              // flowInto that is not empty, and bring in it's content. The
              // empty nodes will be removed later when we normalizeFlow
              var iter = this.flowInto;
              while (iter && iter.isEmpty(true)) {
                iter = iter.flowInto;
              }
              if (iter && !iter.isEmpty(true)) {
                if (this.nodeName === 'P') {
                  while (iter.firstElementChild) {
                    this.appendChild(iter.firstElementChild);
                  }
                } else {
                  while (Polymer.dom(iter).firstElementChild) {
                    Polymer.dom(this).appendChild(
                      Polymer.dom(iter).firstElementChild);
                  }
                  Polymer.dom(this).flush();
                }
                repeat = true;
              }
            }
          }
        }
      }
      // normalize our flow
      this.normalizeFlow();
      if (this.onFlowEnd) {
        this.onFlowEnd();
      }
    },

    /**
     * Check PAGE for flow-break
     *
     * @return {boolean} True if page contains flow-break, otherwise false
     */
    doesPageContainFlowBr_: function() {
      var breakBeforeChild =
      this.queryEffectiveChildren(':scope > [break-before]');
      var breakAfterChild =
      this.queryEffectiveChildren(':scope > [break-after]');
      return breakBeforeChild || breakAfterChild;
    },

    /**
     * unflow all content within this flow
     */
    unflow: function() {
      if (!this.isFlowing()) {
        throw new Error(this.nodeName +
                        ' tried to unflow but its not currently flowing');
      }
      // make sure we start at the end of our flow
      var end = this.flowEnd();
      if (end !== this) {
        return end.unflow();
      }

      if (this.onUnflowStart) {
        this.onUnflowStart();
      }


      // unflow into the flowFrom, and keep going until we reach
      // the start (eg there is no more flowFrom)
      var iter = this.flowFrom;
      while (iter) {

        // first recurse unflow any of its children
        iter.recurseUnflowChild_();

        // now pull all children from the flowInto back in to the flowFrom
        if (iter.flowInto) {
          if (iter.nodeName === 'P') {
            iter.pullChildrenBack_(iter.flowInto.children.length);
          } else {
            iter.pullChildrenBack_(
              Polymer.dom(iter.flowInto).childNodes.length);
          }
          
        }

        iter = iter.flowFrom;
      }

      // Normalize this flow. Then check all parents if they need normalizing
      iter = this.flowStart();
      while (iter && iter.normalizeFlow) {
        iter.normalizeFlow();
        iter = Polymer.dom(iter).parentNode;
      }

      if (this.onUnflowEnd) {
        this.onUnflowEnd();
      }
    },


    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} relOffset an offset within THIS element
     * @return {Number} the absolute offset within this FLOW
     */
    absoluteOffsetWithinFlow: function(relOffset) {
      var absOffset = relOffset;
      var iter = this;
      while (iter.flowFrom) {
        var iterFlowFromChildren = iter.flowFrom.children;
        if(iter.flowFrom.nodeName === 'TD'){
          iterFlowFromChildren = iter.flowFrom.children[0].children;
        }
        absOffset += iter.nodeName === "QOWT-SECTION" ?
          iterFlowFromChildren.length - 2 : iterFlowFromChildren.length;
        iter = iter.flowFrom;
      }
      return absOffset;
    },

    /**
     * For table offset getting wrong if the section is flowing
     *
     * @param {Node} node child of THIS element
     * @return {Number} the absolute offset of node within this FLOW
     */
    absoluteOffsetOfNodeWithinFlow: function(node) {
      var absOffset = 0;
      var iter = this.flowStart();
      var childNodes = [];
      while (iter) {
        var children = Array.from(iter.children).filter(function(item){
          return item.nodeName !== 'TEMPLATE';
        });
        childNodes = childNodes.concat(children);
        iter = iter.flowInto;
      }
      absOffset = childNodes.indexOf(node);
      return absOffset+1;
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {Number} the relative offset within this element
     */
    relativeOffset: function(absOffset) {
      var relOffset = absOffset;
      var iter = this;

      var children = this.children;
      if (this.nodeName === 'TD') {
        children = this.children[0].children;
      }

      while (iter.flowFrom && (iter = iter.flowFrom)) {
        var iterChildren = iter.children;
        if (iter.nodeName === 'TD') {
          iterChildren = iterChildren[0].children;
        }
        relOffset -= iter.nodeName === "QOWT-SECTION" ?
          iterChildren.length - 2 : iterChildren.length;
      }
      // only return the relative offset if it's actually within this
      // children length.
      return (relOffset >= 0 && relOffset <= children.length) ?
          relOffset : undefined;
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {HTMLElement} the flow node within this flow that contains
     *                       the requested absOffset
     */
    flowNodeAtOffset: function(absOffset) {
      var iter = this.flowStart();
      var lengthSoFar = 0;
      var current = iter;
      while (iter && absOffset >= lengthSoFar) {
        var iterChildren = iter.children;
        if (iter.nodeName === 'TD') {
          iterChildren = iterChildren[0].children;
        }
        lengthSoFar += iter.nodeName === "QOWT-SECTION" ?
          iterChildren.length - 2 : iterChildren.length;
        current = iter;
        iter = iter.flowInto;
      }
      return current;
    },

    childPositions: {
      ON_PAGE: 1,
      ON_EDGE: 2,
      BEYOND_PAGE: 3
    },

    // ----------------------- PRIVATE ------------------

    /**
     * There are three things to consider here:
     *  1- the last child that is on the edge of our bounding box
     *  2- any child that is a break-before or break-after
     *  3- any child that *contains* a break in it's children
     *
     * If we have a child that is a break (2 above), then we only
     * need to move the rest of the children out; there is no need
     * to flow any child specifically.
     *
     * Otherwise, we either need to flow the edge child or the child
     * which contains a break, depending on which comes first
     */
    determineCutOff_: function(page, multiColumn) {
      // Note: there is a difference between a break in THIS flow
      // and a child that itself CONTAINS a break..
      var flowBreakIndex = this.getFlowBreakIndex_();
      var childContainingBreakIndex = this.childIndexContainingBreak_();
      var childNearestEdgeIndex;
      if (multiColumn) {
        childNearestEdgeIndex = this.getLastChildOnPage_(page);
      } else {
        childNearestEdgeIndex = this.getFirstChildBeyondEdge_(page);
      }

      // a child on the edge of our bounding box OR a child which contains
      // a break of it's own will need to flow. But we only need to flow
      // which ever of the two is the first one in dom order.
      var childToFlowIndex = (childContainingBreakIndex === undefined) ?
          childNearestEdgeIndex :
          Math.min(childNearestEdgeIndex, childContainingBreakIndex);

      // if we have a flowBreakIndex, the cut off point is BEFORE the index
      // eg, we thus check for flowBreakIndex - 1
      // if we have a childToFlow, then everything should move out AFTER it
      var firstIndex = flowBreakIndex ?
          Math.min(flowBreakIndex - 1, childToFlowIndex) : childToFlowIndex;

      var childrenToMoveOut =
        Polymer.dom(this).children.length - firstIndex - 1;

      var childToFlow = (flowBreakIndex <= childToFlowIndex) ?
          undefined : Polymer.dom(this).children[childToFlowIndex];

      if (['A','P'].includes(this.nodeName)) {
        childrenToMoveOut = this.children.length - firstIndex - 1;

        childToFlow = (flowBreakIndex <= childToFlowIndex) ?
            undefined : this.children[childToFlowIndex];
      }

      return {
        childToFlow: childToFlow,
        childrenToMoveOut: childrenToMoveOut
      };
    },

    getFirstChildBeyondEdge_: function(page) {
      // find the first child that is either "on" the bottom
      // edge of the boundingBox, or completely beyond it
      // Note: we set the index as the final child to start with
      // because if we do not find a child on/over the edge, then
      // by definition our last child is the "nearest" to the edge

      // Some elements (e.g. qowt-drawing) can have a child element which is
      // positioned absolutely. If we have another inline child (e.g. text-runs)
      // which can fit on the page, then this inline child must not move out.
      // Absolutely positioned elements which are beyond the page, but are
      // placed before such inline elements must not move out during pagination.
      // If we find inline children which can fit on the page, and a
      // 'drawing' element which is a previousSibling to such inline elements,
      // then we must not classify the drawing as the firstChildBeyondEdge
      // even if it does not fit on the page.

      var absoluteChildIndex;
      var index = this.children.length - 1;
      var childrenLen = this.children.length;
      if (['TD','TABLE','QOWT-PAGE','QOWT-SECTION'].includes(this.nodeName)) {
        index = Polymer.dom(this).children.length - 1;
        childrenLen = Polymer.dom(this).children.length;
      }
      for (var i = 0; i < childrenLen; i++) {
        var child = this.children[i];
        if (['TD','TABLE','QOWT-PAGE','QOWT-SECTION'].includes(this.nodeName)) {
          child = Polymer.dom(this).children[i];
        }
        var childIsAbsolute = child.isAbsolutelyPositioned &&
            child.isAbsolutelyPositioned();
        if (this.childPosition_(child, page) !== this.childPositions.ON_PAGE) {
          if (childIsAbsolute && absoluteChildIndex === undefined) {
            absoluteChildIndex = i;
          } else {
            index = i;
            break;
          }
        } else if (absoluteChildIndex !== undefined && !childIsAbsolute &&
            child.isQowtElement) {
          // There is some inline content after the absolute content which can
          // fit on the page. So we need not flow / move out the absolute
          // content.
          absoluteChildIndex = undefined;
        }
      }
      return absoluteChildIndex !== undefined ? absoluteChildIndex : index;
    },

    // find the last child that is either "on" the bottom
    // edge of the boundingBox, or completely on the page
    // this is different from getFirstChildBeyondEdge_ because we need
    // to search from the back, because we want to find the child that
    // overflows the LAST column, not the one that overflows the first column
    getLastChildOnPage_: function(page) {
      var index = 0, i, child;
      if (['P','A'].includes(this.nodeName)) {
        for (i = this.children.length - 1; i >= 0; i--) {
          child = this.children[i];
          if (this.childPosition_(child, page) !==
              this.childPositions.BEYOND_PAGE) {
            index = i;
            break;
          }
        }
      } else {
        for (i = Polymer.dom(this).children.length - 1; i >= 0; i--) {
          child = Polymer.dom(this).children[i];
          if (this.childPosition_(child, page) !==
              this.childPositions.BEYOND_PAGE) {
            index = i;
            break;
          }
        }
      }

      return index;
    },

    pullChildrenBack_: function(numberToPullBack) {
      var i;
      if (['A','P'].includes(this.nodeName)) {
        for (i = 0; i < numberToPullBack; i++) {
          DomUtils.insertAtEnd(this.flowInto.firstElementChild,
              this /*reference node*/);
        }
      } else {
        for (i = 0; i < numberToPullBack; i++) {
          DomUtils.insertAtEnd(Polymer.dom(this.flowInto).firstElementChild,
              this /*reference node*/);
        }
      }
    },

    childPosition_: function(child, page) {
      var position;
      var childBox = this.getElementBox_(child);
      var minHeight = child.minHeight ? child.minHeight() : 0;
      if (childBox.bottom < page.boundingBox().bottom) {
        position = this.childPositions.ON_PAGE;
      } else if (page.boundingBox().bottom - childBox.top > minHeight) {
        position = this.childPositions.ON_EDGE;
      } else {
        position = this.childPositions.BEYOND_PAGE;
      }
      return position;
    },

    getElementBox_: function(element) {
      var childBox;
      if (element.nodeName === 'BR') {
        // TODO(jliebrand): in Chrome <br> elements do not report any bounding
        // size see: https://code.google.com/p/chromium/issues/detail?id=441019
        // so hack this by adding a dummy span, getting it's size and then
        // remove it
        var dummy = document.createElement('span');
        var parentNode = element.parentNode;
        parentNode.insertBefore(dummy, element);

        childBox = dummy.getBoundingClientRect();
        parentNode.removeChild(dummy);
      } else {
        childBox = element.getElementBox ? element.getElementBox() :
            element.getBoundingClientRect();
      }
      return childBox;
    },

    // returns new child flowInto if it's valid
    flowChild_: function(child, page) {
      var newChildFlowInto;

      if (child) {
        if (child.supports && child.supports('flow')) {
          if (child.flowInto === undefined) {
            newChildFlowInto = child.createFlowInto();
          }
          child.flow(page);
          // after flowing, if our newChildFlowInto is empty and not
          // flowing, that means we didn't push anythign to it. So dont
          // return it (or it would end up in the DOM)
          if (newChildFlowInto &&
             !newChildFlowInto.isFlowing() &&
             newChildFlowInto.isEmpty(true)) {
            newChildFlowInto = undefined;
          }
        } else {
          // child doesn't support flowing, so remove it from the parent
          // (ie take it out of "this", and just return it as
          // the new childFlowInto and it will be moved (in the correct
          // order) in to our flowInto along with other childFlowIntos
          if (['A','P'].includes(this.nodeName)) {
            this.removeChild(child);
          } else {
            Polymer.dom(this).removeChild(child);
          }
          newChildFlowInto = child;
        }
      }
      return newChildFlowInto;
    },

    // returns true if the reflow succeeded and we no longer
    // need to do anything more
    reflowEdgeChild_: function(page) {
      var child;
      if (['A','P'].includes(this.nodeName)) {
        child = this.lastElementChild;
        // only REflow if the child is flowing (ie if it has a flowInto)
        if (child && child.supports && child.supports('flow') &&
            child.flowInto !== undefined) {

          // reflow
          child.flow(page);

          if (child && child === this.lastElementChild &&
              this.childPosition_(child, page) ===
              this.childPositions.ON_PAGE &&
              child.flowInto !== undefined) {
            // the child is still our last element and fits inside
            // our boundingbox. The child itself has a flowInto (ie
            // it is still flowing) so it has done it's job
            // There's nothing more to overflow or indeed to flow back
            // in to 'this' so we are done
            this.normalizeFlow();
            return true;
          }
        }
      } else {
        child = Polymer.dom(this).lastElementChild;
        // only REflow if the child is flowing (ie if it has a flowInto)
        if (child && child.supports && child.supports('flow') &&
            child.flowInto !== undefined) {

          // reflow
          child.flow(page);

          if (child && child === Polymer.dom(this).lastElementChild &&
              this.childPosition_(child, page) ===
              this.childPositions.ON_PAGE &&
              child.flowInto !== undefined) {
            // the child is still our last element and fits inside
            // our boundingbox. The child itself has a flowInto (ie
            // it is still flowing) so it has done it's job
            // There's nothing more to overflow or indeed to flow back
            // in to 'this' so we are done
            this.normalizeFlow();
            return true;
          }
        }
      }
      // not done, return false;
      return false;
    },


    ensurePageNotLeftEmpty_: function() {
      // UGLY... specialcasing to ensure we dont
      // ever result in causing the entire page to be empty. This means
      // inherit knowledge about QowtPage which is a bit crap, but it's
      // the most efficient way to guard against the recursive pagination
      // leaving us empty. If _this_ is empty (and would thus be removed
      // on normalizeFlow) AND there is no previous sibling anywhere up
      // the chain to the page, then move one of our children back.
      // This could be a large img that clips off the end of the page or
      // a single character at a font size larger than the page
      if (this.isEmpty(true)) {
        var isFirstElementOnPage = true;
        var iter = this;
        // We should not pull data from successive pages in case of
        // Section break (Next page) and New Page.
        while (iter && (!(iter instanceof QowtPage) &&
            !this.isProcessingNextPageSectionBreak_(iter))) {
          if (Polymer.dom(iter).previousSibling) {
            isFirstElementOnPage = false;
            break;
          }
          iter = Polymer.dom(iter).parentNode;
        }
        if (['A','P'].includes(this.nodeName)) {
          if (isFirstElementOnPage &&
            this.flowInto.firstElementChild &&
            !this.isProcessingNextPageSectionBreak_(iter)) {
            DomUtils.insertAtEnd(this.flowInto.firstElementChild,
                this  /*reference node*/);
          }
        } else {
          if (isFirstElementOnPage &&
            Polymer.dom(this.flowInto).firstElementChild &&
            !this.isProcessingNextPageSectionBreak_(iter)) {
            DomUtils.insertAtEnd(Polymer.dom(this.flowInto).firstElementChild,
                this  /*reference node*/);
          }
        }
      }
    },


    recurseUnflowChild_: function() {
      //  unflow any child that is flowed
      var flowedChildren = this.querySelectorAll(':scope > [named-flow]');
      if (this.nodeName === 'TABLE') {
        flowedChildren = this.querySelector(".content-wrapper").
          querySelectorAll(":scope > [named-flow]");
      }
      if (flowedChildren.length > 2) {
        // an element can at most have two children that also flow (eg
        // the first and last elements)
        throw new Error('Should never have more than two flowed child!');
      }
      for (var i = 0; i < flowedChildren.length; i++) {
        flowedChildren[i].unflow();
      }
    },

    isProcessingNextPageSectionBreak_: function(iter) {
      return iter instanceof QowtSection &&
          iter.getAttribute('break-before') !== null &&
          !iter.isFlowing();
    },

    /*
     * Push out any overflowing (fully or partially) children to
     * this.flowInto in single column document.
     */
    pushOutChildrenSingleColumn_: function(page, childCount) {
      var i;
      var totalChildren =
        (this.nodeName === 'TD' || this.nodeName === 'TABLE')
         ? Polymer.dom(this).children.length : this.children.length;

      if (this.nodeName === 'QOWT-SECTION') {
        totalChildren -= 2;
      }

      var childHasFlowed = (childCount !== totalChildren);
      // determine where the cut off point is
      var cutOffInfo = this.determineCutOff_(page, false);

      // create an array of the nodes we need to move out
      var toMoveOutNodes = [], idx;
      if (['A','P'].includes(this.nodeName)) {
        for (i = 0; i < cutOffInfo.childrenToMoveOut; i++) {
          // push elements backwards on to the array, so they will be
          // pushed out in the correct order later
          idx = this.children.length - i - 1;
          toMoveOutNodes.push(this.children[idx]);
        }
      } else {
        for (i = 0; i < cutOffInfo.childrenToMoveOut; i++) {
          // push elements backwards on to the array, so they will be
          // pushed out in the correct order later
          idx = Polymer.dom(this).children.length - i - 1;
          toMoveOutNodes.push(Polymer.dom(this).children[idx]);
        }
      }

      // move the childToFlow out entirely if it is beyond the edge
      // of the bounding box. If it is ON the edge, then flow it.
      var child = cutOffInfo.childToFlow;
      if (child) {
        if (this.childPosition_(child, page) ===
            this.childPositions.BEYOND_PAGE) {
          // entire child is beyond the edge, push it out
          toMoveOutNodes.push(child);
        } else if (this.childPosition_(child, page) ===
                   this.childPositions.ON_EDGE ||
                   child.containsFlowBreak && child.containsFlowBreak()) {
          // child requires flowing
          var newChildFlowInto = this.flowChild_(child, page);
          if (newChildFlowInto) {
            toMoveOutNodes.push(newChildFlowInto);
          }
          childHasFlowed = true;
        }
      }
      // move all nodes that require moving out to this.flowInto
      for (i = 0; i < toMoveOutNodes.length; i++) {
        if (toMoveOutNodes[i]) {
          DomUtils.insertAtStart(toMoveOutNodes[i],
              this.flowInto /*reference node*/);
        }
      }
      return childHasFlowed || toMoveOutNodes.length !== 0;
    },

    pushOutChildrenMultiColumn_: function(page, childCount) {
      var i;
      var childHasFlowed = (childCount !== Polymer.dom(this).children.length);
      if (['A','P'].includes(this.nodeName)) {
        childHasFlowed = (childCount !== this.children.length);
      }
      // Iterating from the back, remove children that are completely
      // overflowing.  We need to go from the back because we need to be
      // sure that the overflow is from the last column.We
      // repeat this process because after we remove the children,
      // the browser will rebalance the columns, meaning that
      // more children might now be overflowing.
      var moreChildrenToMove = true;
      while (moreChildrenToMove) {
        // determine where the cut off point is
        var cutOffInfo = this.determineCutOff_(page, true);
        var childrenToMoveOut = cutOffInfo.childrenToMoveOut;
        if (['A','P'].includes(this.nodeName)) {
          for (i = 0; i < childrenToMoveOut; i++) {
            DomUtils.insertAtStart(this.lastElementChild,
                this.flowInto /*reference node*/);
          }
        } else {
          for (i = 0; i < childrenToMoveOut; i++) {
            DomUtils.insertAtStart(Polymer.dom(this).lastElementChild,
                this.flowInto /*reference node*/);
          }
        }
        moreChildrenToMove = (childrenToMoveOut > 0);
        if (moreChildrenToMove) {
          childHasFlowed = true;
        }
      }

      // While the last child is on the edge, we will flow the last
      // child. We need to repeat because the browser will rebalance
      var child = this.lastElementChild;
      while (child && !(child.isEmpty && child.isEmpty(true)) &&
             this.childPosition_(child, page) !==
             this.childPositions.ON_PAGE) {
        // initial flow of child
        var newChildFlowInto = this.flowChild_(child, page);
        if (newChildFlowInto) {
          DomUtils.insertAtStart(newChildFlowInto,
              this.flowInto /*reference node*/);
          childHasFlowed = true;
        } else {
          break;
        }
        child = this.lastElementChild;

      }
      return childHasFlowed;
    },
  });
});
