/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base mixin for all flow algorithms
 *
 * For more details on flow algorithms for pagination:
 * http://goto.google.com/qowt-flow-algorithms
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/idGenerator',
  'third_party/lo-dash/lo-dash.min'], function(
    DomUtils,
    IdGenerator) {

  "use strict";

  return {

    supports_: ['flow'],

    /**
     * @return {boolean} returns true if this element is currently flowing
     */
    isFlowing: function() {
      return this.namedFlow() !== null;
    },

    /**
     * @return {string} returns the name of the flow (or null)
     */
    namedFlow: function() {
      return this.getAttribute('named-flow');
    },

    /**
     * Creates a unique name and set's it as the flow name
     */
    createNamedFlow: function() {
      var flow = 'FLOW-' + _.uniqueId();
      this.setNamedFlow(flow);
      return flow;
    },

    /**
     * Set the name of the flow for this element
     *
     * @param {string} flowName the name of the flow to set
     */
    setNamedFlow: function(flowName) {
      this.setAttribute('named-flow', flowName);
    },

    /**
     * Remove the named flow from this element and reset the
     * flowInto and flowFrom references
     */
    clearNamedFlow: function() {
      this.removeAttribute('named-flow');
      this.flowInto = undefined;
      this.flowFrom = undefined;
    },

    /**
     * Set the index of the flow for this element
     *
     * @param {number} flowIndex the index of the flow to set
     */
    setIndexedFlow: function(flowIndex) {
      this.setAttribute('indexed-flow', flowIndex);
    },

    /**
     * @return {boolean} returns true if any of it's descendants (direct
     *                   children or nested) contain a break-before/break-after
     */
    containsFlowBreak: function() {
      return (this.getFlowBreakIndex_() !== undefined ||
              this.childIndexContainingBreak_() !== undefined);
    },

    /**
     * Remove this element from the flow; ie ensure the previous element
     * in the flow points to the correct next element and vice versa before
     * resetting this elements named flow. Also makes sure to copy the model
     * from this element to the next if this element was the start of the flow
     */
    removeFromFlow: function() {
      // Note: the "head" or startNode of the flow is the
      // node that holds the ID and the model for this element.
      // So if we are the head (eg if we have no .flowFrom), then
      //  we need to transfer ownership of
      // the model and id to the new head.
      if (!this.flowFrom) {
        if (this.flowInto) {
          this.flowInto.id = this.id;
          this.flowInto.setModel(this.model);
        }
      }

      // now unlink this from the flow
      if (this.flowFrom) {
        this.flowFrom.flowInto = this.flowInto;
      }
      if (this.flowInto) {
        this.flowInto.flowFrom = this.flowFrom;
      }

      // reset/clearFlow for THIS node (for good measure)
      // and remove this from document
      this.clearNamedFlow();
      var parentNode = Polymer.dom(this).parentNode;
      if (parentNode) {
        Polymer.dom(parentNode).removeChild(this);
        Polymer.dom(parentNode).flush();
      }
    },

    /**
     * @return {HTMLElement} return the first node in the flow; or THIS element
     */
    flowStart: function() {
      var iter = this;
      while (iter.flowFrom) {
        iter = iter.flowFrom;
      }
      return iter;
    },

    /**
     * @return {HTMLElement} return the last node in the flow; or THIS element
     */
    flowEnd: function() {
      var iter = this;
      while (iter.flowInto) {
        iter = iter.flowInto;
      }
      return iter;
    },

    /**
     * @return {Number} the number of elements in this flow
     */
    flowLength: function() {
      var count = 1;
      var iter = this.flowStart();
      while (iter.flowInto) {
        count++;
        iter = iter.flowInto;
      }
      return count;
    },

    /**
     * @return {number} returns the index of this element within the flow
     */
    indexWithinFlow: function() {
      var iter = this;
      var index = 0;
      while (iter.flowFrom) {
        index++;
        iter = iter.flowFrom;
      }
      return index;
    },

    /**
     * Create a new flowInto element. It does this by cloning this element
     * via the .cloneMe function, which specific elements can override.
     * The new flowInto will point back to this element via it's flowFrom
     * reference
     *
     * @return {HTMLElement} returns the new flowInto
     */
    createFlowInto: function() {
      var namedFlow = this.namedFlow() || this.createNamedFlow();

      // make sure our flowInto is the same style as us
      this.flowInto = this.cloneMe();

      // if we have an EID, make sure the clone node gets it too
      var thisEid = this.getEid();
      if (thisEid) {
        this.flowInto.setEid(thisEid);

        // however, make sure ONLY the flowStart element is the one
        // with the unique id attribute (no two nodes should have the
        // same 'id' attribute in the DOM)
        this.flowInto.removeAttribute('id');
      }

      if (this instanceof QowtSection) {
        var indexedFlow = IdGenerator.getUniqueId('SI');
        this.flowInto.setIndexedFlow(indexedFlow);
      }

      this.flowInto.setNamedFlow(namedFlow);
      this.flowInto.flowFrom = this;
      return this.flowInto;
    },

    /**
     * "Normalize" the flow, which basically means removing empty
     * nodes from the flow, removing the flow altogether if the
     * flow ends up being one element in size.
     * It determines if an element is 'empty' by calling .isEmpty on the
     * node if it has that function.
     */
    normalizeFlow: function() {
      var startNode = this.flowStart();
      var iter = startNode;
      var toRemove = [];
      var toKeep = [];
      while (iter) {
        var next = iter.flowInto;
        if (iter.isEmpty && iter.isEmpty(true)) {
          if (iter instanceof QowtSection &&
              iter.getAttribute('removedByCode')) {
            toKeep.push(iter);
          }
          else if(iter instanceof QowtWordPara &&
            iter.isEmpty && !iter.isEmpty(true)) {
              toKeep.push(iter);
          } else {
            toRemove.push(iter);
          }
        }
        else {
          toKeep.push(iter);
        }
        iter = next;
      }

      // make sure we dont remove ALL nodes if they are all empty.
      // That really should only occur if we tried to flow one empty page
      // which we dont want to delete...
      if (toKeep.length === 0) {
        toKeep.push(toRemove.shift(1));
      }

      for (var i = 0; i < toRemove.length; i++) {
        // note: individual elements can override removeFromFlow...
        // for example table cells shouldn't be removed from the flow,
        // unless the entire row is empty. Thus table cells override
        // this function to do nothing, and table rows can call the
        // table cell's forceRemoveFromFlow...
        toRemove[i].removeFromFlow();
      }

      // now if we are left with only one node, then clear its flow
      startNode = toKeep[0].flowStart();
      if (startNode.flowInto === undefined) {
        startNode.clearNamedFlow();
      }
    },

    /**
     * Elements should generally not mixin just this flowingElement module
     * but instead mixin one of the flowing algorithms which then mixin
     * this module. Each of those should have flow, unflow and other
     * functions.
     */
    flow: function() {
      throw new Error('must override');
    },

    /**
     * Elements should generally not mixin just this flowingElement module
     * but instead mixin one of the flowing algorithms which then mixin
     * this module. Each of those should have flow, unflow and other
     * functions.
     */
    unflow: function() {
      throw new Error('must override');
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} relOffset an offset within THIS element
     * @return {Number} the absolute offset within this FLOW
     */
    absoluteOffsetWithinFlow: function() {
      throw new Error('must override');
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {Number} the relative offset within this element
     */
    relativeOffset: function() {
      throw new Error('must override');
    },

    /**
     * See http://goto.google.com/qowt-flow-algorithms for definitions
     *
     * @param {Number} absOffset an absolute offset within this flow
     * @return {HTMLElement} the flow node within this flow that contains
     *                       the requested absOffset
     */
    flowNodeAtOffset: function() {
      throw new Error('must override');
    },

    // ---------------------- PRIVATE --------------------------------------

    /**
     * Find the index of our flow break; eg one of our children
     * has either break-before or break-after
     *
     * @return {number|undefined} returns the break index or undefined
     */
    getFlowBreakIndex_: function() {
      // note: break-before can occur on the first child (if we have
      // already broken the flow), but that should not break the flow _again_.
      // In that case, grab the second break-before node found (if any)
      var breakBeforeKids = this.queryAllEffectiveChildren('[break-before]');
      if (this.nodeName === 'P') {
        breakBeforeKids = this.querySelectorAll(':scope > [break-before]');
      }
      var breakBeforeChild = breakBeforeKids[0];
      var beforeIdx = DomUtils.peerIndex(breakBeforeChild);
      if (beforeIdx === 0) {
        // if we only have one breakBeforeKid then this will just return
        // undefined, which is ok.
        breakBeforeChild = breakBeforeKids[1];
        beforeIdx = DomUtils.peerIndex(breakBeforeChild);
      }
      var breakAfterChild = 0;
      breakAfterChild = this.queryEffectiveChildren('[break-after]');
      if (this.nodeName === 'P') {
        breakAfterChild = this.querySelector(':scope > [break-after]');
      }
      var afterIdx = DomUtils.peerIndex(breakAfterChild);

      // note the break index for break-after is afterIdx + 1 !
      var breakIdx;
      if (beforeIdx !== undefined && afterIdx !== undefined) {
        breakIdx = Math.min((afterIdx + 1), beforeIdx);
      }
      else if (beforeIdx !== undefined) {
        breakIdx = beforeIdx;
      }
      else if (afterIdx !== undefined) {
        breakIdx = afterIdx + 1;
      }
      return breakIdx;
    },


    /**
     * Find the index of a child which CONTAINS a flow-break
     *
     * @return {number|undefined} returns the child index that contains
     *                            a flow-break (or undefined)
     */
    childIndexContainingBreak_: function() {
      // find child that CONTAINS a break;
      var child = this.childContainingAttribute_('break-after') ||
                  this.childContainingAttribute_('break-before');
      var index = child ? DomUtils.peerIndex(child) : undefined;

      return index;
    },

    childContainingAttribute_: function(selector) {
      for (var i = 0; i < Polymer.dom(this).children.length; i++) {
        var child = Polymer.dom(this).children[i];
        if (child.querySelector('['+ selector + ']') !== null) {
          return child;
        }
      }
      return undefined;
    }

  };

});
