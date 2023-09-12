define([], function() {

  'use strict';

  var api_ = {

    /**
     * api for handling the incorrect selection on double click.
     */
    doubleClicked: function() {
      if (this.isIncorrectSelection()) {
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        if (this.isTextNodeSelected(range)) {
          var correctRange = document.createRange();
          // In case of incorrect selection while selecting
          // 1. Space Or Tab
          // 2. first Run we need to correct only the start offset.
          correctRange.setStart(range.startContainer, 0);
          if (!this.isSelectionWhiteSpace(range.startContainer)) {
            // Go on searching the spans for whitespace
            var result = this.getStartContainerAndOffset(range);
            if (result.startContainer) {
              // we have found the earlier text node with whitespace
              correctRange.setStart(result.startContainer,
                  result.startOffset);
            }
          }
          // In case of incorrect selection while selecting
          // 1. Space Or Tab
          // 2. last Run we need to correct only the end offset.
          correctRange.setEnd(range.endContainer, range.endOffset);
          if (!this.isSelectionWhiteSpace(range.endContainer)) {
            // Look for whitespace in current span
            var indexOfSpaceAfterEndOffset = this.
                getIndexOfWhiteSpaceAfterSelection(range);

            if (indexOfSpaceAfterEndOffset !== -1) {
              // Whitespace in current span after selection
              correctRange.setEnd(range.endContainer,
                  range.endOffset + indexOfSpaceAfterEndOffset);
            } else {
              // Go on searching the next spans with whitespace
              var endContainerAndOffset = this.
                  getEndContainerAndOffset(range.endContainer.parentElement.
                      nextSibling);

              if (endContainerAndOffset.endContainer) {
                correctRange.setEnd(endContainerAndOffset.endContainer,
                    endContainerAndOffset.endOffset);
              }
            }
          }
          // Correct the selection
          sel.removeAllRanges();
          sel.addRange(correctRange);
        }
      }
    },

    /**
     * Gives index of whitespace after selection range
     * @param {object} range - selection range object
     * @return {Number} - Index of whitespace after selection
     */
    getIndexOfWhiteSpaceAfterSelection: function(range) {
      return range.endContainer.substringData(range.endOffset,
          range.endContainer.length).indexOf(' ');
    },


    /**
     * Gives index of whitespace before selection range
     * @param {object} range - selection range object
     * @return {Number} - Index of whitespace before selection
     */
    getIndexOfWhiteSpaceBeforeSelection: function(range) {
      return range.startContainer.substringData(0,
          range.startOffset).lastIndexOf(' ');
    },


    /**
     * Returns true if First Run is selected, false otherwise
     */
    isFirstRunSelected: function(range) {
      var currentSpan = range.startContainer.parentElement;
      return currentSpan === currentSpan.parentElement.firstChild;
    },


    /**
     * Returns true if last Run is selected, false otherwise
     */
    isLastRunSelected: function(range) {
      var currentSpan = range.endContainer.parentElement;
      return currentSpan === currentSpan.parentElement.lastChild;
    },

    /**
     * Function for checking incorrect selection. Returns true in case of
     * incorrect selection, false otherwise
     */
    isIncorrectSelection: function() {
      // Incorrect selection i.e. the selection type is Range however
      // the caret is placed on some text and no range has been selected.
      var sel = window.getSelection();
      return sel && sel.rangeCount > 0 && sel.type === 'Range' &&
          sel.isCollapsed === true;
    },

    isLastCharSpace: function(spanNode) {
      return spanNode.textContent[spanNode.textContent.length - 1] === ' ';
    },

    /**
     * Return true if the selection contains space or tab
     */
    isSelectionWhiteSpace: function(container) {
      return container.nodeValue === ' ' ||
          this.isTabNode(container.parentElement);
    },

    /**
     * Return true in case of text node selection, false otherwise
     */
    isTextNodeSelected: function(range) {
      return range && range.collapsed && range.startContainer.nodeType === 3;
    },

    /**
     * Check if node is tab node
     * @param {object} node
     * @return {boolean} - Return true if node is tab node, false otherwise
     */
    isTabNode: function(node) {
      return node.getAttribute('qowt-runtype') === 'qowt-tab';
    },

    /**
     * Get start container and start offset for given selection range
     * @param {object} range - selection range object
     * @return {object} - object containing start container and start offset
     */
    getStartContainerAndOffset: function(range) {
      var node = range.startContainer.parentNode;
      var result = {startContainer: undefined, startOffset: undefined};
      while (this.isSpanNode(node)) {
        var index;
        if (range.startContainer === node.childNodes[0]) {
          index = this.getIndexOfWhiteSpaceBeforeSelection(range);
        } else {
          index = this.getIndexOfLastWhitespace(node);
        }

        if (index !== -1 || this.isTabNode(node)) {
          // Whitespace found
          if ((this.isLastCharSpace(node) ||
              this.isTabNode(node)) && node.nextSibling) {
            // If the last char is space or the node is tab node then we
            // need to set cursor at the start of next span.
            if (node.nextSibling.childNodes.length > 0) {
              result.startContainer = node.nextSibling.childNodes[0];
              result.startOffset = 0;
              return result;
            } else {
              // Return empty result as we need to set the cursor at
              // startContainer
              return result;
            }
          } else {
            // Normal text node with whitespace
            result.startContainer = node.childNodes[0];
            result.startOffset = index + 1; //Place cursor after the whitespace
            return result;
          }
        } else {
          if (node.previousSibling &&
              this.isSpanNode(node.previousSibling)) {
            node = node.previousSibling;
          } else { // This is first span in a paragraph
            if (node.childNodes.length > 0) {
              result.startContainer = node.childNodes[0];
              result.startOffset = 0;
              return result;
            } else {
              // Return empty result as we need
              // to set the cursor at startContainer only
              return result;
            }
          }
        }
      }
      return result;
    },


    /**
     * Get end container and end offset for given selection range
     * @param {object} node
     * @return {object} - object containing end container and end offset
     */
    getEndContainerAndOffset: function(node) {
      var result = {endContainer: undefined, endOffset: undefined};
      while (this.isSpanNode(node)) {
        var index = this.getIndexOfFirstWhitespace(node);
        if (index !== -1 || this.isTabNode(node)) {
          // Whitespace found
          if (((node.textContent[0] === ' ') ||
              this.isTabNode(node)) &&
              node.previousSibling) {
            // If the node contains space at the start or if it is tab
            // node, we need to set cursor on prev span
            if (node.previousSibling.childNodes.length > 0) {
              result.endContainer = node.previousSibling.childNodes[0];
              result.endOffset = node.previousSibling.childNodes[0].length;
              return result;
            } else {
              // Return empty result as we need
              // to set the cursor at endContainer only
              return result;
            }
          } else {
            result.endContainer = node.childNodes[0];
            result.endOffset = index - 1; //Place cursor before the whitespace
            return result;
          }
        } else {
          if (node.nextSibling && this.isSpanNode(node.nextSibling)) {
            node = node.nextSibling;
          } else { // This is last span in a paragraph
            if (node.childNodes.length > 0) {
              result.endContainer = node.childNodes[0];
              result.endOffset = node.childNodes[0].length;
              return result;
            } else {
              // Return empty result as we need
              // to set the cursor at startContainer only
              return result;
            }
          }
        }
      }
      return result;
    },

    /**
     * Check if node is span node
     * @param {object} node
     * @return {boolean} - Return true if node is span node, false otherwise
     */
    isSpanNode: function(node) {
      return node && node.nodeName === 'SPAN';
    },

    /**
     * Gives index of last whitespace in run
     */
    getIndexOfLastWhitespace: function(run) {
      var textContent = run.textContent;
      return textContent.lastIndexOf(' ');
    },

    /**
     * Gives index of first whitespace in run
     */
    getIndexOfFirstWhitespace: function(run) {
      var textContent = run.textContent;
      return textContent.indexOf(' ');
    }
  };
  return api_;
});
