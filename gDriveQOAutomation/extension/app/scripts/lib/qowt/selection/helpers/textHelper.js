/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview selection helper for qowt contentType 'text'
 *
 * HTML text selection allows the boundary points of a range to be
 * anywhere within the DOM tree structure. Thus in theory the caret
 * (aka insertion point) can be between two paragraphs, and the
 * user can insert TEXT_NODEs there.
 *
 * For MS Office text, all text should be wrapped in character runs,
 * which should be within paragraphs. The semantics of the structure
 * must be maintained, in order for our DOM to be in sync with the Core.
 *
 * This helper ensures the HTML text selection will always adhere to the
 * rules of MS Office text insertion.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

// NOTE: this module ultimately should replace the need for DomTextSelection
// since that module is bloated and buggy. So if you find yourself using
// DomTextSelection, think about what it is you are doing, and why this
// helper is not already doing it for you
// TODO(jliebrand): remove DomTextSelection when this module replaces all
// use cases

define([
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils'], function(
    DomListener,
    NavigationUtils) {

  'use strict';

  var TextSelectionHelper = function() {
    // constants
    this.contentType = 'text';
    this.listenerId = '__textHelperId';
  };


  // api
  TextSelectionHelper.prototype = {
    __proto__: Object.prototype,

    /**
     * Activate the helper; this will make it start listening for DOM
     * selection changed events
     */
    activate: function() {
      DomListener.add(
          this.listenerId,
          document,
          'selectionchange',
          handleSelectionChanged_.bind(this));
    },

    /**
     * Deactivate the helper; it will stop listening for events
     */
    deactivate: function() {
      DomListener.removeGroup(this.listenerId);
    },

    /**
     * Take a snapshot of the existing text selection (range or caret)
     */
    snapshot: function() {
      this.snapshot_ = getSnapshot_();
      return this.snapshot_;
    },

    /**
     * When we modify the DOM programmatically, the caret may get stuck in
     * invalid places. This may be called to fix that up.
     */
    fixupInvalidCaret: function() {
      if (!NavigationUtils.undoRedoUsingTBButton(document.activeElement)) {
        fixupInvalidCaret_();
      }
    },

    /**
     * Reset the selection to a previous snapshot.
     * Will ONLY attempt to reset the selection if the current snapshot
     * does not match our stored snapshot.
     */
    restoreSnapshot: function(snapshot) {
      restoreSnapshot_(snapshot || this.snapshot_);
    },


    compareSnapshots: function(snapshotA, snapshotB) {
      return compareSnapshots_(snapshotA, snapshotB);
    },

    /**
     * @return {boolean} return true if the node intersects (greedily) with
     *                   the current text selection.
     */
    nodeIntersects: function(node) {
      return window.getSelection().containsNode(node, true);
    },

    /**
     * If the selection has not changed we do not
     * need to process the selection a second time.
     * @param {Object} newData The new eventData.
     * @param {Object} currentSelection current selection object.
     * @return {Boolean}
     */
    selectionContextsEqual: function(newData, currentSelection) {
      return !!(currentSelection &&
          newData &&
          (currentSelection.contentType === newData.contentType) &&
          (currentSelection.startContainer === newData.startContainer) &&
          (currentSelection.startOffset === newData.startOffset) &&
          (currentSelection.endContainer === newData.endContainer) &&
          (currentSelection.endOffset === newData.endOffset) &&
          (currentSelection.isCollapsed === newData.isCollapsed));
    }

  };

  // -------------------- helper functions -----------------------


  function getRange_() {
    var range;
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }
    return range;
  }


  function handleSelectionChanged_() {
    fixupInvalidCaret_();
  }

  function fixupInvalidCaret_() {
    var range = getRange_();

    if (range && range.collapsed) {
      // while the insert point is invalid, try to move it

      // first we will try to move it to the left most leaf in the tree.
      // This takes care of *most* of the invalid positions. In particular
      // if the caret is for example at the start of a section (eg container
      // is <qowt-section> with that section having a <qowt-table> as its
      // first element... In which case it should just be placed inside the
      // table instead)
      moveCaretToLeaf_(range);

      // if that didn't work, we will try to move it backwards/forwards in the
      // hope that we can find a better position
      var direction = 'backward';
      var moved = true;
      while (range && insertPointInvalid_(range) && moved) {
        moved = moveInsertPoint_(direction);
        if (!moved && (direction !== 'forward')) {
          // try moving forwards
          direction = 'forward';
          moved = true;
        }
        range = getRange_();
      }

      // if still invalid, we were unable to move it for some reason
      // so just remove the caret all together, as we do not want to
      // allow editing on an invalid position
      if (insertPointInvalid_(range)) {
        console.warn('Invalid insertion point but unable to move ' +
                     '- removing selection completely');
        window.getSelection().removeAllRanges();
      }
    }
  }

  function moveCaretToLeaf_(range) {
    if (insertPointInvalid_(range) && range.startContainer.children) {
      var leaf;
      var newOffset = 0;
      // determine which child we should try to recurse into; start or end?
      if (range.startOffset === range.startContainer.childNodes.length) {
        // at the back of the children, go for the right most leaf
        leaf = range.startContainer.lastChild;
        leaf = getValidLeaf_(leaf, 'right');

        if (leaf) {
          // make sure our new offset is at the back also
          newOffset = leaf.nodeType === Node.TEXT_NODE ?
              leaf.textContent.length : leaf.children.length;
        }
      }
      else if (range.startContainer.nodeName === 'TABLE' &&
        range.startOffset === 0) {
        // start at the current table node, and get left leaf from there
        leaf = range.startContainer.children[range.startOffset];
        leaf = getValidLeaf_(leaf, 'left');
      }
      else {
        // start at the current node, and get left leaf from there
        leaf = range.startContainer.childNodes[range.startOffset];
        if (leaf.nodeType === Node.TEXT_NODE &&
          range.startContainer.nodeName === 'QOWT-PAGE' &&
          range.startContainer.previousElementSibling) {
          leaf = range.startContainer
            .previousElementSibling.querySelector('div#contentsContainer');
          leaf = getValidLeaf_(leaf, 'right');

          if (leaf) {
            // make sure our new offset is at the back also
            newOffset = leaf.nodeType === Node.TEXT_NODE ?
                leaf.textContent.length : leaf.childNodes.length;
          }
        } else if (leaf.nodeName === 'DIV' && leaf.id === 'pageBorders') {
          leaf = range.startContainer
            .querySelector('div#contents qowt-section:first-child');
          leaf = getValidLeaf_(leaf, 'left');
        } else {
          leaf = getValidLeaf_(leaf, 'left');
        }
      }

      if (leaf) {
        range.setStart(leaf, newOffset);
        range.setEnd(leaf, newOffset);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }
  }


  /**
   * @param {HTMLElement} node the node to start at
   * @param {String} side either left or right
   * @return {HTMLElement=} return either the left (firstChild) or right
   *     (lastChild) most leaf that is a valid caret container,
   */
  function getValidLeaf_(node, side) {

    function getChild_(node, side) {
      if (node) {
        if (node.nodeName === 'SPAN') {
          return (side === 'left' ? node.firstChild : node.lastChild);
        } else if (node.nodeName === 'TABLE') {
          // In shady, colgroup element is first child of table element,
          // the second element has the actual table content.
          return node.lastElementChild;
        } else if (node.nodeName === 'QOWT-SECTION') {
          return (side === 'left' ? Polymer.dom(node).firstElementChild
          : Polymer.dom(node).lastElementChild);
        }
        return (side === 'left' ? node.firstElementChild
          : node.lastElementChild);
      }
    }

    // first find the correct leaf
    var leaf = node;
    while (leaf && getChild_(leaf, side)) {
      leaf = getChild_(leaf, side);
    }

    // if that is not a valid container, move back up until we have either a
    // valid container or the original node
    while (leaf && (leaf !== node) && !isValidCaretContainer_(leaf)) {
      leaf = leaf.parentNode;
    }

    return leaf;
  }

  // for MS Office documents, the only valid insertion point
  // is if the startContainer is either P, SPAN or TEXT_NODE
  // NOTE: this is somewhat hard coded... what about
  // when we want to use custom elements? - for now content editable
  // doesn't play nice with custom elements anyway... keeping this
  // element specificity inside the text tool should be OK
  function insertPointInvalid_(range) {
    var valid = (range && range.collapsed &&
                 range.startContainer &&
                 isValidCaretContainer_(range.startContainer));

    return !valid;
  }


  function isValidCaretContainer_(node) {
    var valid = (node.nodeType === Node.TEXT_NODE || node.nodeName === 'P' ||
        node.nodeName === 'SPAN');
    return valid && nodeIsEditable_(node);
  }


  function nodeIsEditable_(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    while (node && node.contentEditable === 'inherit') {
      node = node.parentNode;
    }
    return node && (node.contentEditable === 'true');
  }


  function moveInsertPoint_(direction) {
    var opposite = (direction === 'forward') ? 'backward' : 'forward';
    var curRange = getRange_();
    window.getSelection().modify('move', direction, 'paragraph');
    window.getSelection().modify('move', opposite, 'paragraphboundary');
    var newRange = getRange_();
    return !(compareRanges_(curRange, newRange));
  }


  function getSnapshot_() {
    var snapshot = {};
    var range = getRange_();

    if (range) {

      var parent;
      var reget = false;
      var node;
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        parent = range.startContainer.parentNode;
        // normalize in case the parent had multiple text nodes
        parent.normalize();
        reget = true;
      }
      if (range.endContainer.nodeType === Node.TEXT_NODE) {
        parent = range.endContainer.parentNode;
        // normalize in case the parent had multiple text nodes
        parent.normalize();
        reget = true;
      }
      if (reget) {
        range = getRange_();
      }
      var startOffset = range.startOffset;
      if (!range.collapsed &&
          startOffset !== 0 &&
          range.startContainer.nodeName === 'QOWT-SECTION') {
        startOffset -= 1;
      }
      var startContainer = (range.startContainer.nodeType === Node.TEXT_NODE) ?
          range.startContainer.parentNode :
          range.startContainer;

      var endOffset = range.endOffset;
      var endContainer = (range.endContainer.nodeType === Node.TEXT_NODE) ?
          range.endContainer.parentNode :
          range.endContainer;

      if (startContainer.supports && startContainer.supports('flow')) {
        snapshot.startContainer = startContainer.flowStart().id;
        snapshot.startOffset =
            startContainer.absoluteOffsetWithinFlow(startOffset);
      } else {
        snapshot.startContainer = startContainer.id;
        snapshot.startOffset = startOffset;
      }

      if (!range.collapsed) {
        if (startContainer.nodeName === 'QOWT-PAGE' &&
          startContainer.childNodes[startOffset] &&
          startContainer.childNodes[startOffset].nodeName === 'DIV' &&
          startContainer.childNodes[startOffset].id === 'pageBorders') {
          node = startContainer.querySelector('qowt-section');
          node = Polymer.dom(node).firstChild;
          if (node.nodeName === 'P') {
            if (node.firstElementChild.nodeName === 'SPAN') {
              node = node.firstElementChild;
            }
          }
          snapshot.startContainer = node.id;
          snapshot.startOffset = 0;
        }
        if (endContainer.nodeName === 'QOWT-PAGE' &&
          endContainer.childNodes[endOffset - 1] &&
          endContainer.childNodes[endOffset - 1].nodeName === 'DIV') {
          node = endContainer.querySelector('qowt-section:last-child');
          if (node.lastElementChild.nodeName === 'P') {
            node = node.lastElementChild;
            if (node.lastElementChild.nodeName === 'SPAN') {
              node = node.lastElementChild;
              if (node.firstChild) {
                endContainer = node.firstChild;
                endOffset = node.firstChild.length;
              } else {
                endContainer = node;
                endOffset = 0;
              }
            } else if (node.children.length === 1 &&
              node.lastElementChild.nodeName === 'BR') {
              endContainer = node;
              endOffset = 0;
            } else {
              endContainer = node;
              endOffset = node.childNodes.length - 1;
            }
          } else {
            endContainer = node;
            endOffset = node.childNodes.length - 1;
          }
        }
      }

      if (endContainer.supports && endContainer.supports('flow')) {
        snapshot.endContainer = endContainer.flowStart().id;
        snapshot.endOffset = endContainer.absoluteOffsetWithinFlow(endOffset);
      } else {
        snapshot.endContainer = endContainer.id;
        snapshot.endOffset = endOffset;
      }

      // The browser providing a wrong selection range for table selection
      // while pressing the 'delete' key in front of a table element.
      // The following code corrects the snapshot and passes it to 'Core'.
      if (range.startContainer.nodeName === '#text' &&
        startOffset === 1 && startContainer.nodeName === 'P') {
        node = startContainer.querySelector('span:last-child');
        if (node) {
          snapshot.startContainer = node.id;
          snapshot.startOffset = node.textContent.length;
        }
      }

      // The browser providing a wrong selection range for section selection
      // when the table is at the end offset of selection range.
      if (endContainer.nodeName === 'QOWT-SECTION' &&
        endContainer.childNodes[endOffset - 1] &&
        endContainer.childNodes[endOffset - 1].nodeName === 'TABLE') {
        node = endContainer.childNodes[endOffset - 1];
        endOffset = endContainer.absoluteOffsetOfNodeWithinFlow(node);
        snapshot.endOffset = endOffset;
        snapshot.tableEId = node.getAttribute('qowt-eid');
      }

    }
    return snapshot;
  }

  function restoreSnapshot_(restoreTo) {
    if (restoreTo) {
      // Only restore to cached snapshot_ if it is different from
      // the current; no point otherwise (and costs time).
      var newSnapshot = getSnapshot_();
      if (!compareSnapshots_(restoreTo, newSnapshot)) {

        var startContainer = document.getElementById(restoreTo.startContainer);
        var endContainer = document.getElementById(restoreTo.endContainer);
        var startOffset = restoreTo.startOffset;
        var endOffset = restoreTo.endOffset;

        if (startContainer && startContainer.supports &&
            startContainer.supports('flow')) {
          startContainer =
              startContainer.flowNodeAtOffset(restoreTo.startOffset);
          startOffset = startContainer.relativeOffset(restoreTo.startOffset);
        }
        if (endContainer && endContainer.supports &&
            endContainer.supports('flow')) {
          endContainer = endContainer.flowNodeAtOffset(restoreTo.endOffset);
          endOffset = endContainer.relativeOffset(restoreTo.endOffset);
        }

        // if the container is a span, then set the offset as a char offset
        // on the first text node within the span
        if (startContainer && startContainer.nodeName === 'SPAN' &&
            startContainer.isEmpty && !startContainer.isEmpty()) {
          startContainer.normalize();
          startContainer = startContainer.firstChild;
        }
        if (endContainer && endContainer.nodeName === 'SPAN' &&
            endContainer.isEmpty && !endContainer.isEmpty()) {
          endContainer.normalize();
          endContainer = endContainer.firstChild;
        }
        // if the end container is a qowt-section and selection has table
        // element, then need to update endOffset of selection range.
        if (endContainer &&
          endContainer.nodeName === 'QOWT-SECTION' &&
          restoreTo.tableEId) {
          var node = document.getElementById(restoreTo.tableEId);
          endOffset = Array.from(node.parentNode.childNodes).indexOf(node);
          endOffset += 1;
        }

        if(startContainer && startContainer.nodeName === 'P') {
          if(((startContainer.children.length === 1) ||
            (startContainer.children.length === 2 &&
            (startContainer.lastElementChild instanceof HTMLBRElement ||
            startContainer.lastElementChild.isEmpty()))) &&
            startContainer.firstElementChild instanceof QowtHyperlink) {
              startOffset = restoreTo.startOffset;
              endOffset = restoreTo.endOffset;
          }
        }

        if (startContainer || endContainer) {
          try {
            // Get the current range, in case we are only updating either
            // the start or the end, we want to keep the other bit in place.
            var sel = window.getSelection(),
                range = (sel.rangeCount > 0) ?
                  sel.getRangeAt(0) : document.createRange();
            if (startContainer) {
              range.setStart(startContainer, startOffset);
            }
            if (endContainer) {
              range.setEnd(endContainer, endOffset);
            }
            sel.removeAllRanges();
            sel.addRange(range);
          } catch(e) {
            console.warn('failed to restore selection');
          }
        } else {
          console.warn('Could not get boundary point for saved selection ' +
            'snapshot; Restore snapshot failed.');
        }
      }
    }
  }


  /**
   * compare two ranges, return true if they are the same
   *
   * @param rangeA {object} first range to compare
   * @param rangeB {object} second range to compare
   * @return {boolean} return true if both ranges are the same
   */
  function compareRanges_(rangeA, rangeB) {
    var rangesEqual = false;
    if (rangeA && rangeB) {
      rangesEqual = (rangeA.collapsed === rangeB.collapsed &&
          rangeA.startContainer === rangeB.startContainer &&
          rangeA.startOffset === rangeB.startOffset &&
          rangeA.endContainer === rangeB.endContainer &&
          rangeA.endOffset === rangeB.endOffset);
    }
    return rangesEqual;
  }


  /**
   * Checks wether or not the specified argument is a valid snapshot.
   *
   * @param {Object|undefined} snapshot Object to be checked.
   * @return true if the input argument is a valid snapshot, false
   *         otherwise.
   */
  function isValidSnapshot_(snapshot) {
    return snapshot &&
           snapshot.startContainer !== undefined &&
           snapshot.startOffset !== undefined &&
           snapshot.endContainer !== undefined &&
           snapshot.endOffset !== undefined;
  }

  /**
   * compare two snapshots, return true if they are the same
   *
   * @param snapshotA {object} first snapshot to compare
   * @param snapshotB {object} second snapshot to compare
   * @return {boolean} return true if both snapshots are the same
   */
  function compareSnapshots_(snapshotA, snapshotB) {
    var areEqual = false;
    if (isValidSnapshot_(snapshotA) && isValidSnapshot_(snapshotB)) {
      areEqual = (snapshotA.startContainer === snapshotB.startContainer &&
                  snapshotA.startOffset === snapshotB.startOffset &&
                  snapshotA.endContainer === snapshotB.endContainer &&
                  snapshotA.endOffset === snapshotB.endOffset);
    }
    return areEqual;
  }

  return TextSelectionHelper;
});
