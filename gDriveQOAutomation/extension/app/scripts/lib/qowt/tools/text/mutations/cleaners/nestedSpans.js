// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview mutation tool cleaner to move a nested span up in to the
 * parent paragraph.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/domTextSelection'
], function(Tags, DomUtils, DomTextSelection) {

  'use strict';

  // JELTE TODO: I don't believe contenteditable should ever
  // result in nested spans. Need to verify that is
  // indeed a bug, and if so raise it on chrome...
  //
  // We simply 'lift' the span up and insert it either
  // at the start of it's current parent, or the end depending
  // on it's relative position within the parent
  function _findNestedSpans(summary, node) {
    summary = summary || {};
    if (node && node.nodeName === 'SPAN') {
      var parentSpan = node.parentNode;
      if (parentSpan.nodeName === 'SPAN') {
        console.log('Found nested spans; pulling up in to parent para');

        // cache text selection in case it's inside the nodes we are pulling up
        var r = DomTextSelection.getRange();
        switch (_position(node)) {
        case 'start':
          DomUtils.insertBefore(node, parentSpan);
          break;
        case 'end':
          DomUtils.insertAfter(node, parentSpan);
          break;
        case 'middle':
          // NOTE: I've not seen a case where a nested span
          // is inserted in between two other TEXT_NODEs within a
          // parentSpan. If this DOES happen, then we will need to
          // create two new spans for the neighbouring TEXT_NODEs
          // and replace the parentSpan with the resulting three
          // spans. This is a lot more tricky and fragile since
          // we'd also need to to update our mutationSummary object
          // with the newly created spans. So since this has not
          // occurred yet, and since these nested spans are in effect
          // defects of contenteditable anyway (IMHO), we will for
          // now simply list the span to the front of the parent.
          // This is not quite what the user would expect, but we
          // can not test / verify the 'middle' position edge case anyway
          console.warn('Nested span not handled quite right!!!');
          DomUtils.insertBefore(node, parentSpan);
          break;
        default:
          break;
        }

        // reset text selection
        DomTextSelection.setRange(r);
      }
    }
  }

  /**
   * helper function to return the position of
   * the given node within it's parent's child nodes.
   *
   * @param node {HTML Element} the element to inspect
   * @return {string} 'start' - if the node is the firstChild of the parent
   *                  'end'   - if the node is the lastChild of the parent
   *                  'middle' - if the node is neither start nor end
   *                  undefined if the node or it's parent dont exist
   */
  function _position(node) {
    var pos;
    if (node && node.parentNode) {
      // default to middle
      pos = 'middle';
      if (node === node.parentNode.lastChild) {
        pos = 'end';
      }
      if (node === node.parentNode.firstChild) {
        // note: if the node is the only child, this means we return 'start'
        pos = 'start';
      }
    }
    return pos;
  }

  return {
    // used for unit tests
    __clean: function(node) {
      _findNestedSpans(undefined, node);
    },

    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['SPAN']
      },
      callback: _findNestedSpans
    }
  };
});
