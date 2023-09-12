/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Text selection utility functions
 *
 * Unlike window.getSelection, this returns the range relevant to
 * QOWT eid elements, and the offsets are relevant to those
 * widgets. Thereby allowing the clients to easily grab the start
 * and/or end containers and generate widgets from them to manipulate
 * the content as required
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dtilley@google.com (Dan Tilley)
 */

/**
 * BIG JELTE TODO: this module is a bit of a mess at the moment!
 * It has a seemingly random collection of APIs which really need
 * cleaning up. I will do that in a separate CL to the PreEdit work
 * as it will touch on other modules that will need updating to
 * accommodate for the new API.  For now keep these functions here.
 */
define([
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/utils/typeUtils',
  'third_party/lo-dash/lo-dash.min'], function(
  DomUtils,
  NavigationUtils,
  TypeUtils
  /*lo-dash*/) {

  'use strict';

  var _api = {

    /**
     * Return a copy of the selection range object, we create a copy so that
     * when the browser selection changes, the returned data does not.
     * @return {Object} Range object, consisting of:
     *         {Boolean}.isCollapsed
     *         {HTML Element}.startContainer
     *         {HTML Element}.endContainer
     *         {Integer}.startOffset
     *         {Integer}.endOffset
     */
    getRange: function() {

      // Note: we guarantee that if the selection is in
      // a TEXT_NODE, that the parent will have been normalized
      // before returning the range. This means clients do not
      // have to worry that the textNode and offset might have
      // further textNodes as previousSiblings...

      function getRange_() {
        var range = {},
            selObj = window.getSelection();
        if (selObj && selObj.rangeCount > 0) {
          // JELTE TODO: There is a cloneRange method, however the created
          // range object changes to match the browser range, find out if
          // this is a Chrome bug, for now manually construct a clone.
          var liveRange = selObj.getRangeAt(0);
          range.isCollapsed = selObj.isCollapsed;
          range.startContainer = liveRange.startContainer;
          range.endContainer = liveRange.endContainer;
          range.startOffset = liveRange.startOffset;
          range.endOffset = liveRange.endOffset;
        }
        return range;
      }

      var range = getRange_();
      var retry = false;
      if (range.startContainer &&
          range.startContainer.nodeType === Node.TEXT_NODE) {
        range.startContainer.parentNode.normalize();
        retry = true;
      }
      if (range.endContainer &&
          range.endContainer.nodeType === Node.TEXT_NODE) {
        range.endContainer.parentNode.normalize();
        retry = true;
      }
      return retry ? getRange_() : range;
    },

    /**
     * Set the current text selection in the DOM, based on given range.
     * This is a normal JS object, not a Range object.
     * @param {Object} range Normal JS object (not a Range object) which
     *                       contains start & end containers and offsets.
     */
    setRange: function(range) {
      if(range &&
        (!NavigationUtils.undoRedoUsingTBButton(document.activeElement))) {
        var newRange = document.createRange();
        newRange.setStart(range.startContainer, range.startOffset);
        newRange.setEnd(range.endContainer, range.endOffset);
        var selObj = window.getSelection();
        selObj.removeAllRanges();
        selObj.addRange(newRange);
      }
    },

    /**
     * Places the cursor at offset within a node.
     * If node is a text node, the offset refers to the character position
     * in the text node. If node is not a text node, offset refers to the
     * child index of the node.
     * @param {HTML Element} node A DOM node.
     * @param {Integer} offset An offset within the node, as described above.
     */
    setCaret: function(node, offset) {
      _api.setRange({
        startContainer: node,
        endContainer: node,
        startOffset: offset,
        endOffset: offset
      });
    },

    /**
     * Set caret at the end of the given node.
     * @param {HTML Element} node At the end of which to place the caret.
     */
    setCaretAtEnd: function(node) {
      if(node) {
        _api.setCaret(
            node,
            (node.nodeType === Node.TEXT_NODE) ?
              Array.from(node.textContent).length : 0);
      }
    },

    /**
     * @return {Boolean} Returns true if the selection is collapsed in
     *                   to a single caret (rather than a range selection).
     */
    isCollapsed: function() {
      return _api.getRange().isCollapsed;
    },


    /**
     * @param {Object=} opt_range - range to be considered to decide if the
     *                              caret is between the run
     * @return {boolean} true if the caret is in between the run false
     *                   otherwise.
     * @private
     */
    isCaretBetweenRun: function(opt_range) {
      var range = opt_range || _api.getRange();
      var spanLength = _.get(range, 'startContainer.parentNode.length') || 0;
      return !!(range.isCollapsed &&
          range.startContainer.nodeType === Node.TEXT_NODE &&
          !(range.startOffset === 0 || range.startOffset === spanLength));
    },


    /**
     * Return the correct node for the start of the selection,
     * if the start is in a text node return the parent,
     * otherwise return the node to the right of the start,
     * unless there is no node to the right in which case
     * return the node to the left of the start.
     * If the element has no children, then return the parent itself.
     *
     * TODO dtilley This assumes LtR languages, we need to adapt
     * this function to work with RtL languages.
     *
     * @return {HTML Element | undefined}
     */
    startNode: function() {
      var node,
          range = _api.getRange();
      if (range.startContainer) {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          node = range.startContainer.parentNode;
        } else {
          // If the container is an element node, then the offset
          // is the index between it's child nodes or it will be the container
          // itself, if it has zero children
          if (range.startContainer.childNodes.length === 0) {
            node = range.startContainer;
          } else if (range.startOffset >=
              range.startContainer.childNodes.length) {
            node = range.startContainer.childNodes[
                range.startContainer.childNodes.length - 1];
          } else {
            node = range.startContainer.childNodes[range.startOffset];
          }
        }
      }
      return node;
    },

    /**
     * Return the correct node for the end of the selection,
     * if the end is in a text node return the parent,
     * otherwise return the node to the left of the end,
     * unless there is no node to the left in which case
     * return the node to the right of the end.
     * If the element has no children, then return the parent itself.
     *
     * TODO dtilley This assumes LtR languages, we need to adapt
     * this function to work with RtL languages.
     *
     * @return {HTML Element | undefined}
     */
    endNode: function() {
      var node,
          range = _api.getRange();
      if (range.endContainer) {
        if (range.endContainer.nodeType === Node.TEXT_NODE) {
          node = range.endContainer.parentNode;
        } else {
          // If the container is an element node, then the offset
          // is the index between it's child nodes or it will be the container
          // itself, if it has zero children
          if (range.endContainer.childNodes.length === 0) {
            node = range.endContainer;
          } else if (range.endOffset === 0) {
            node = range.endContainer.childNodes[0];
          } else if (range.endOffset >= range.endContainer.childNodes.length) {
            node = range.endContainer.childNodes[
                                range.endContainer.childNodes.length - 1];
          } else {
            node = range.endContainer.childNodes[range.endOffset - 1];
          }
        }
      }
      return node;
    },

    /**
     * Return the start offset relative to the startNode
     * For non TEXT_NODE start nodes this is always zero
     * since the start node already is the correct node
     * from within the startContainer.
     */
    startOffset: function() {
      // If the start container is not a text node, then we
      // return the relevant element as startNode above, and thus
      // the offset (to THAT node) is zero.
      var range = _api.getRange();
      return (range.startContainer &&
          range.startContainer.nodeType === Node.TEXT_NODE) ?
            range.startOffset :
            0;
    },

    /**
     * @return {Boolean} Return true if the selection is collapsed in to
     *                   a caret which is at the start of a node.
     */
    isAtNodeStartBoundary: function() {
      var atBoundary = false;
      var selRange = _api.getRange();
      if(selRange.isCollapsed) {
        var startEl = selRange.startContainer;
        if(startEl.nodeType === Node.TEXT_NODE) {
          // Start container is a text node, we are at
          // the start boundary if the offset is zero.
          atBoundary = (selRange.startOffset === 0);

        } else {
          // Start container is an html element then
          // we are at the boundary by definition.
          atBoundary = true;
        }
      }
      return atBoundary;
    },

    /**
     * Returns object with relative start and end offsets for a range
     * compared to an HTML element. Will return -1 for offsets outside
     * of the element.
     * @param {Object} range Object with start/end containers and offsets.
     * @param {HTML Element} node Element to compare the range to.
     * @return {Object} Object containing startOffset and endOffset as
     *                  relative values for the node.
     */
    relativeOffsets: function(range, node) {
      var selectionStart = -1;
      var selectionEnd = -1;
      var nodeInfo;
      if(DomUtils.contains(node, range.startContainer)) {
        nodeInfo = DomUtils.relativePosition(range.startContainer);
        selectionStart = nodeInfo.characterOffset + range.startOffset;
      }
      if(DomUtils.contains(node, range.endContainer)) {
        nodeInfo = DomUtils.relativePosition(range.endContainer);
        selectionEnd = nodeInfo.characterOffset + range.endOffset;
      }
      var relOffsets = {
        startOffset: selectionStart,
        endOffset: selectionEnd
      };
      return relOffsets;
    },

    /**
     * Return the TextNode at the offset within a given element.
     * @param {HTML Element} el Element to walk and search for textNode.
     * @param {Integer} offset Character offset where to find the node.
     * @param {Object} opt_context Optional object in which we will add
     *                 information about the returned textNode like:
     *                 - textNodeIndex: index relative to peer textNodes.
     *                 - relativeOffset: character offset
     *                   relative to the textNode.
     */
    textNodeAt: function(el, offset, opt_context) {
      opt_context = opt_context || {};
      var relativeOffset, charCounter, index, walker, node;
      if(el.nodeType !== Node.ELEMENT_NODE) {
        throw new Error('error: searching for textNode inside '+
                        'textNode is invalid');
      } else {
        if((offset >= 0) && (offset < el.textContent.length + 1)) {
          charCounter = 0;
          index = -1;
          walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while(walker.nextNode()) {
            node = walker.currentNode;
            index++;
            if(node.nodeType === Node.TEXT_NODE) {
              relativeOffset = offset - charCounter;
              charCounter += node.textContent.length;
              if(charCounter >= offset) {
                opt_context.relativeOffset = relativeOffset;
                opt_context.textNodeIndex = index;
                break;
              }
            }
          }
        }
      }
      // JELTE TODO: I *think* there is a bug here in that this will
      // ALWAYS return the final textNode even if we couldn't find
      // the node... We really need to rewrite this DomTextSelection
      // module such that it's not some magic set of utils functions
      // but one that you can actually use!
      // (see Rangy library for example perhaps)
      return node;
    },

    /**
     * Returns true if the given element is inside the text selection.
     * Defaults to greedy, meaning it will return true if the element
     * is only partially covered by the text selection.
     * @param {HTML Element} el Element to compare current selection against.
     * @param {Boolean} greedy Optional boolean to indicate if partially
     *                         covered elements should be included. Defaults
     *                         to true.
     */
    contains: function(el, greedy) {
      greedy = (greedy === undefined) ? true : greedy;
      return window.getSelection().containsNode(el, greedy);
    },

    /**
     * Iterate over the current selection, and apply the given
     * callback for each node. Only triggers callbacks for ELEMENT_NODEs
     * not for TEXT_NODES. Will trigger for partially-covered nodes
     * if includePartial is true; otherwise only fully-covered nodes will
     * trigger the callback. The callback will not be invoked on the common
     * ancestor of the selection; the only exception to that is if the common
     * ancestor is an actual TEXT_NODE, in which case it will trigger the
     * callback once for the parentNode of that TEXT_NODE.
     * @param {function} callback - The callback function to invoke on nodes
     * that pass the criteria.
     * @param {boolean} includePartial - Indicates whether or not nodes that
     * are partially-selected should be passed to the callback.
     * @param {object} selRange - A Range object describing the user's selected
     * area of the page.
     */
    iterateSelection: function(callback, includePartial, selRange) {
      if(!selRange) {
        throw new Error('No selection range provided.');
      }

      var ancestor = selRange.commonAncestorContainer;
      if(!ancestor) {
        return;
      }
      if(ancestor.nodeType === Node.TEXT_NODE) {
        // Trigger on the parent node of the text-only-selection.
        if(!includePartial) {
          if(selRange.startOffset !== 0 ||
             selRange.endOffset !== selRange.length) {
            return; // the selection doesn't fully cover the text node
          }
        }
        callback.call(this, ancestor.parentNode);
      } else {
        // Iterate through the children of the common ancestor.
        var iter = document.createNodeIterator(
            ancestor,
            NodeFilter.SHOW_ELEMENT,
            { acceptNode: function(node) {
                // some unit tests in domTextSelection-test fail if we pass
                // includePartial=false instead of true here because they were
                // written with the expectation that this function would
                // include partially-selected nodes
                return _nodeInsideSelection(node, includePartial, selRange);
              }
            },
            false);
        if(!iter) {
          throw new Error('Failed to create node iterator on document.');
        }
        var node = iter.nextNode();
        while(node) {
          callback.call(this, node);
          node = iter.nextNode();
        }
      }
    },

    /**
     * Create a DOM Tree Walker which can be used to iterate
     * over the current selection. Returns undefined if there is
     * no range selection
     * @param {Boolean} opt_inclPartial Boolean to indicate if partially
     *                  selected nodes should be included in the walker.
     * @param {Function} opt_additionalFilter Function which can be used
     *                   to indicate for each node inside the selection
     *                   whether or not to include it in the walkers
     *                   logical view. Return either
     *                      - NodeFilter.FILTER_SKIP
     *                      - NodeFilter.FILTER_REJECT
     *                      - NodeFilter.FILTER_ACCEPT
     * @return {TreeWalker} The tree-walker to be used is returned.
     * See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html
     */
    createWalker: function(opt_inclPartial, opt_additionalFilter) {
      var walker;
      var selObj = window.getSelection();
      if(!selObj.isCollapsed && (selObj.rangeCount > 0)) {
        var selRange = selObj.getRangeAt(0);
        var ancestor = selRange.commonAncestorContainer;
        // Iterate through the children of the common ancestor.
        walker = document.createTreeWalker(
          ancestor,
          NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
          { acceptNode: function(node) {
            var accept = _nodeInsideSelection(node, opt_inclPartial, selRange);
            if (accept === NodeFilter.FILTER_ACCEPT) {
              if (opt_additionalFilter) {
                accept = opt_additionalFilter(node);
              }
            }
            return accept;
          }},
          false);
      }
      return walker;
    },

    /**
     * Returns the relative character position of the
     * start or end of the selection within a given element.
     * Will return -1 if the start or end of the selection is
     * outside of the element.
     * @param {HTML Element} element The given HTML Element.
     * @param {String} startOrEnd Either 'start' or 'end'.
     */
    offsetRelativeWithin: function(element, startOrEnd) {
      if(startOrEnd !== 'start' && startOrEnd !== 'end') {
        throw new Error('Error: must specify start or end of selection');
      }
      var offset = -1;
      // Not sure why, but for verifyDocStructure the elements
      // appear to be "inside" the selection, when they are not
      // even in the document... bypass this issue for now by
      // also verifying that the element is indeed in the document
      // JELTE TODO: remove this check once we no longer do
      // verifyDocStructure; or once we do it such that it compares
      // DCP to DOC, rather than create a complate second doc...
      if(element && DomUtils.contains(document, element)) {
        var selObj = window.getSelection();
        if(selObj.rangeCount > 0) {
          if(_api.contains(element)) {
            var selRange = selObj.getRangeAt(0);
            // Create a nodeRange for the given element and then set the end
            // of the nodeRange to the existing selRange startOrEnd boundary.
            var nodeRange = document.createRange();
            nodeRange.selectNodeContents(element);
            var startPoints =
                selRange.compareBoundaryPoints(Range.START_TO_START, nodeRange);
            var endPoints =
                selRange.compareBoundaryPoints(Range.END_TO_END, nodeRange);
            // Only try to get the offset if the start/end is
            // actually within the element!
            if ((startOrEnd === 'start' && startPoints >= 0) ||
                (startOrEnd === 'end' && endPoints <= 0)) {
              nodeRange.setEnd(
                  selRange[startOrEnd + 'Container'],
                  selRange[startOrEnd + 'Offset']);
              // The length of the node range is now the distance
              // to the start/end of the sel range.
              offset = nodeRange.toString().length;
            }
          }
        }
      }
      return offset;
    },

    /**
     * If we make changes to the DOM after the user makes a selection, we need
     * to update the selection to include our alterations.
     */
    getAdjustedSelectionRange: function() {
      var selRange = _getSelectionRange(false);
      if(!selRange) {
        return null;
      }

      var startNode = selRange.startContainer;
      var startOffset = selRange.startOffset;
      var endNode = selRange.endContainer;
      var endOffset = selRange.endOffset;

      if(startNode.nodeType === Node.TEXT_NODE && startOffset === 0) {
        // if the entirety of the node's text is within the selection,
        // include the enclosing DOM element
        startNode = startNode.parentNode;
      }

      if(endNode.nodeType === Node.TEXT_NODE && endOffset === endNode.length) {
        // if the entirety of the node's text is within the selection,
        // include the enclosing DOM element
        endNode = endNode.parentNode;
        // The offset is 1 because we're enclosing exactly one DOM element.
        // Only Text Nodes use offsets other than 1 to indicate what substring
        // of the text is selected
        endOffset = 1;
      }

      selRange.setStart(startNode, startOffset);
      selRange.setEnd(endNode, endOffset);

      return selRange;
    }

  };


  // PRIVATE ===================================================================

  /**
   * Helper function to determine if a node is inside the selection.
   * @param {object} node - This function decides if this Node object is inside
   * the selection.
   * @param {boolean} includePartial - Whether or not partially-selected nodes
   * should be considered as being inside the selection.
   * @param {object} selRange - A Range object indicating the user's selected
   * region on the page.
   * @return {NodeFilter} FILTER_SKIP or FILTER_ACCEPT
   */
  function _nodeInsideSelection(node, includePartial, selRange) {
    if(!selRange) {
      throw new Error('No selection range provided.');
    }

    // enforce that users of this function fully specify the behavior
    // of this method. Default behavior for values like undefined is
    // confusing and error-prone.
    if(!TypeUtils.isBoolean(includePartial)) {
      throw new Error('includePartial must be either true or false, but you ' +
        'gave me: ' + includePartial);
    }
    var nodeRange = document.createRange();
    nodeRange.selectNodeContents(node);
    var accept = NodeFilter.FILTER_SKIP;

    if(selRange.compareBoundaryPoints(Range.START_TO_END, nodeRange) <= 0) {
      // The selection is entirely before the node.
      accept = NodeFilter.FILTER_SKIP;
    }
    else {
      if(selRange.compareBoundaryPoints(Range.END_TO_START, nodeRange) >= 0) {
        // The selection is entirely after the node.
        accept = NodeFilter.FILTER_SKIP;
      }
      else {
        // There is some intersection of selection and node.
        var startPoints =
            selRange.compareBoundaryPoints(Range.START_TO_START, nodeRange);
        var endPoints =
            selRange.compareBoundaryPoints(Range.END_TO_END, nodeRange);
        if (startPoints <=0 && endPoints >= 0) {
          // We come here if and only if the selection includes the whole node.
          accept = NodeFilter.FILTER_ACCEPT;
        }
        else {
          // We know there is some intersection, but not that the selection
          // includes the whole node. Therefore, the node is partially
          // selected.
          accept = includePartial ?
              NodeFilter.FILTER_ACCEPT :
              NodeFilter.FILTER_SKIP;
        }
      }
    }

    return accept;
  }

 /**
  * Fetch the selection Range if it exists.
  *
  * @param {boolean} rejectCollapsed - Indicates if we don't want to make use
  * of collapsed selections.
  * @return {object} A Range object describing the selection region.
  */
  function _getSelectionRange(rejectCollapsed) {
    var selection = window.getSelection();

    if(selection && selection.rangeCount > 0) {
      if(!rejectCollapsed || !selection.isCollapsed) {
        // Chromium currently doesn't support multiple selection ranges
        return selection.getRangeAt(0);
      }
    }

    return undefined;
  }

  return _api;

});
