/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Since our document contains content as well as structural nodes
 * we can not let the browser simply execute 'delete edits'. Either
 * backspace and/or forward-delete need to be validated before we
 * allow them from happening. For delete edits at the caret position
 * we may need to first move the caret to a more suitable position
 * for example, and for range selections we need to iterate the range
 * and ensure no structural nodes get deleted.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/domTextSelection'], function(
    ErrorCatcher,
    QOWTSilentError,
    WidowOrphanHelper,
    DomUtils,
    DomTextSelection) {

  'use strict';

  var _api = {

    /**
     * This function will make sure it does not perform delete
     * when there is only single empty paragraph remains in the document
     * @param {KeyboardEvent} evt key down event which we can stop propagating
     * @param {Element} scope The root node of the text tool.
     */
    handlePoint: function(evt, scope) {
      var sel = window.getSelection();
      var keyCode = evt && evt.keyCode;
      var isBackSpaceKey = (keyCode === _kBackspaceKeyCode);
      var isDeleteKey = (keyCode === _kDeleteKeyCode);
      if (!(sel.type === 'Caret' &&
      isIgnorableDeletionAttempt_(isBackSpaceKey, isDeleteKey, scope))) {
        WidowOrphanHelper.unbalanceSelection();
      } else {
        evt.preventDefault();
      }
    },


    /**
     * Handle the delete key by moving the caret if needed or
     * deleting the range ourselves if it spans multiple pages
     *
     * @param {KeyboardEvent} evt key down event which we can stop propagating
     * @param {Element} scope The root node of the text tool.
     */
    handle: function(evt, scope) {
      var keyCode = evt && evt.keyCode;
      var isBackSpaceKey = (keyCode === _kBackspaceKeyCode);
      var isDeleteKey = (keyCode === _kDeleteKeyCode);
      if (isDeleteKey || isBackSpaceKey) {
        var sel = window.getSelection();
        // make sure that deleting backward/forward at the start/end of the
        // document content does nothing
        if (!(sel.type === 'Caret' &&
            isIgnorableDeletionAttempt_(isBackSpaceKey, isDeleteKey, scope))) {
          WidowOrphanHelper.unbalanceSelection();
        }

        if (DomTextSelection.isCollapsed()) {
          // make sure that deleting forward/backward at the start/end of the
          // text tool scope does nothing
          if (isIgnorableDeletionAttempt_(isBackSpaceKey, isDeleteKey, scope)) {
            evt.preventDefault();
          } else if (paraHasOnlyNonEditableElements_()) {
            var range = DomTextSelection.getRange();
            var startContainer, idx;
            if (range.startContainer instanceof QowtWordPara) {
              idx = getCaretOffset_();
              startContainer = range.startContainer;
            } else {
              idx = DomUtils.peerIndex(range.startContainer);
              startContainer =
                getContainersClosetTag_(range.startContainer, 'p');
            }
            var totalChildNodes = startContainer.childNodes.length;
            if ((isDeleteKey && idx === totalChildNodes) ||
                (isBackSpaceKey && idx === 0)) { // merge case
              return false;
            } else {
              evt.preventDefault();
              // The algorithm works as follows
              // 1. Index is initialized with the caret position. But since the
              // paragraph also has textNodes and may contain empty runs, we
              // need to modify it so that it correctly points to non-editable
              // item user want to delete.
              // 2. If the index is zero and key is delete, we are at the start
              // and the index is correct.
              // 3. Else If the key is backspace and index = totalChildNodes,
              // we need to reduce it by 3 (2 + 1). 2 because there are 2
              // textNodes and 1 because the array from which is element is
              // needed is zero based whereas index that we get is 1 based.
              // 4. Else if the key is backspace and we are not at the end,
              // index needs to be reduced by 2 (1 + 1), 1 because we just
              // need consider the textNode at the start, other 1 because the
              // array from which is element is needed is zero based whereas
              // index that we get is 1 based.
              // 5. Finally, if the range.startContainer is not Paragrpah,
              // we need to increase the index by total number of empty runs
              // the paragraph may have.
              if (isDeleteKey && idx !== 0) {
                idx -= 1;
              } else if (isBackSpaceKey) {
                if (idx === totalChildNodes &&
                  startContainer.childNodes[totalChildNodes - 1].nodeType
                     === 3) {
                  idx -= 3;
                } else {
                  idx -= 2;
                }
              }

              if (!(range.startContainer instanceof QowtWordPara)) {
                idx += getEmptyRunLength(startContainer);
              }
              deleteNonEditableElementAtIdx_(idx);
              return true;
            }
          }
        } else {

          // Since we are deleting the selection, the NEXT
          // paragraph's content can be pulled in to the one at
          // the start of the selection. So we must ensure it too
          // is unbalanced
          var nextNode = DomUtils.nextNode(DomTextSelection.endNode());
          if (!nextNode) {
            nextNode = DomTextSelection.endNode();
          }
          WidowOrphanHelper.unbalanceNode(nextNode);
        }
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  var _kBackspaceKeyCode = 8,
      _kDeleteKeyCode = 46;

  /**
   * Checks if cursor is after the default break
   * @return {boolean} True if cursor is after the default break,
   * otherwise false.
   *
   * @private
   */
  function caretIsAfterDefaultBreak_() {
    var range = DomTextSelection.getRange();
    var target = range.startContainer;
    return range.startOffset === 1 && target && target.childNodes[0] &&
        target.childNodes[0].nodeName === 'BR';
  }

  function caretIsAtStart_(scope) {
    var range = DomTextSelection.getRange();
    var target = range.startContainer;
    var isAtStartOfContainer = target && range.startOffset === 0;

    function getNonEditableParentIfAny(elm) {
      while (elm) {
        if (elm.contentEditable === 'false') {
          return elm;
        }
        elm = elm.parentNode;
      }
      return undefined;
    }

    if (isAtStartOfContainer) {
      var previousNode = DomUtils.previousNode(target);
      // if the previous node is in scope but it is non-editable then we need
      // to see if the non-editable node's previous node falls in scope.
      var nonEditableNode = scope.contains(previousNode) &&
          getNonEditableParentIfAny(previousNode);
      if (nonEditableNode) {
        previousNode = DomUtils.previousNode(nonEditableNode);
      }

      // If the previousNode is a QowtBackground then we are essentially outside
      // the document, as QowtBackground is the first child of msdoc and all
      // QowtPages are nextSiblings to QowtBackground.
      var isOutside = (previousNode instanceof QowtBackground) ||
          !(scope.contains(previousNode));

      // If the prev node is outside the text tool scope, we are at the start.
      return isOutside;
    }
    return false;
  }

  function caretIsAtEnd_(scope) {
    var range = DomTextSelection.getRange();
    if (range.endContainer) {
      var length = range.endContainer.nodeType === Node.ELEMENT_NODE ?
          range.endContainer.childNodes.length :
          range.endContainer.nodeType === Node.TEXT_NODE ?
            range.endContainer.textContent.length : 0;

      if (range.endOffset === length) {
        var nextNode = DomUtils.nextNode(range.endContainer);
        var isOutside = !(scope.contains(nextNode));

        // if the next node is outside the text tool scope, we are at the end.
        return isOutside;
      }
    }
    return false;
  }


  /**
   * @param {Element} container - container element
   * @return {Element|undefined} returns the child elements in container
   * @private
   */
  function getContainerChildren_(container) {
    var childElemSelector = ':scope > :not(br), span[is=qowt-line-break]';
    return (container && container.querySelectorAll &&
        container.querySelectorAll(childElemSelector)) || undefined;
  }


  /**
   * @return {Number} returns caret offset or -1 if not present
   * Note: Call this function only if range is collapsed.
   * @private
   */
  function getCaretOffset_() {
    var range = DomTextSelection.getRange();
    return _.get(range, 'startOffset', -1 /*default*/);
  }

  function paraHasOnlyNonEditableElements_() {
    function areAllNonEditableElements(elements) {
      return (!_.isEmpty(elements) && _.every(elements, function(elm) {
        return (elm.contentEditable === 'false' ||
          elm instanceof HTMLBRElement);
      }));
    }
    var startContainer = getRangeStartContainer_();
    var closestPara = getContainersClosetTag_(startContainer, 'p');
    if(closestPara && !(closestPara.isEmpty() ||
      closestPara.hasEmptyRunsAndBr_(closestPara.children))) {
      var childNodes = getEmptyRunStrippedElements_(closestPara.children);
      return areAllNonEditableElements(childNodes);
    } else {
      return false;
    }
  }

  function getEmptyRunLength(paragraph) {
    var count = 0;
    if (paragraph instanceof QowtWordPara) {
      var children = paragraph.children;
      for(var i = 0; i < children.length; i++) {
        var elm = children[i];
        if (elm instanceof QowtWordRun && elm.isEmpty()) {
          count++;
        }
      }
    }
    return count;
  }
  /**
   * @param {Array} elements
   * @return {Array | NodeList} elements excluding empty qowt-word-runs
   * @private
   */
  function getEmptyRunStrippedElements_(elements) {
    elements = [].slice.call(elements);
    _.remove(elements, function(elm) {
      return (elm instanceof QowtWordRun && elm.isEmpty());
    });
    return elements;
  }


  /**
   * @return {Element| undefined} - The startContainer element or undefined
   * @private
   */
  function getRangeStartContainer_() {
    var range = DomTextSelection.getRange();
    return _.get(range, 'startContainer');
  }


  /**
   * Deletes the nonEditable element at a given index.
   * Note: function should be called only after testing
   * paraHasOnlyNonEditableElements_()
   * @private
   */
  function deleteNonEditableElementAtIdx_(idx) {
    // Ignore empty runs. They might be present for holding the para/ run
    // properties.
    var firstPara = getContainersClosetTag_(getRangeStartContainer_(), 'p');
    var nonEditableElms = getEmptyRunStrippedElements_(
        getContainerChildren_(firstPara));
    var elmToDelete = !_.isEmpty(nonEditableElms) && nonEditableElms[idx];
    if (elmToDelete && elmToDelete.contentEditable === 'false') {
      Polymer.dom(firstPara).removeChild(elmToDelete);
      Polymer.dom(firstPara).flush();
      elmToDelete.setAttribute('removedFromShady', true);
    } else {
      ErrorCatcher.handleError(new QOWTSilentError(
          'Deleting non editable element at idx : ' + idx + ' failed.'));
    }
  }


  /**
   * @param {Node} container - container element/ node
   * @param {string} tag - closest tag to be found
   * @return {Element} returns the closest tag element for the container
   * @private
   */
  function getContainersClosetTag_(container, tag) {
    return container.closest ? container.closest(tag) :
        container.parentNode.closest(tag);
  }

  /**
   * Checks if deletion is backward/forward at the start/end of the document
   * @return {boolean} True if deletion is backward/forward at the
   * start/end of the document, otherwise false.
   *
   * @private
   */
  function isIgnorableDeletionAttempt_(isBackSpaceKey, isDeleteKey, scope) {
    return (isBackSpaceKey &&
        (caretIsAtStart_(scope) || caretIsAfterDefaultBreak_(scope))) ||
        (isDeleteKey && caretIsAtEnd_(scope));
  }

  return _api;
});

