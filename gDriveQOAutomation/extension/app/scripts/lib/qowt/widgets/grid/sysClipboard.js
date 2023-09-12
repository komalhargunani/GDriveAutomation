// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * System Clipboard
 * ================
 *
 * @fileoverview The system clipboard widget encapsulates the part of the
 * HTML DOM that is used to facilitate cut/copy/paste of the system clipboard.
 *
 * Details of the cut/copy/paste functionality of Quicksheet can be found at
 * qowtDocumentation/speclets/quicksheet/cutCopyPaste.md
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  var kText_Node_ClassName_ = 'qowt-sheet-text-node',
      copyTextNode_,
      pasteTextNode_,
      cachedCellContent_,
      destroyToken_;

  var api_ = {

    /**
     * Initialise the singleton system clipboard widget
     */
    init: function() {
      if (destroyToken_) {
        throw new Error('sysClipboard.init() called multiple times.');
      }

      copyTextNode_ = document.createElement('textarea');
      copyTextNode_.className = kText_Node_ClassName_;
      pasteTextNode_ = document.createElement('textarea');
      pasteTextNode_.className = kText_Node_ClassName_;

      destroyToken_ = PubSub.subscribe('qowt:destroy', api_.destroy);
    },

    /**
     * Cuts to the system clipboard any text that
     * is selected in the currently active DOM element.
     *
     * This method can be used when the formula bar
     * or floating editor is active
     */
    cutText: function() {
      cut_();
    },

    /**
     * Copies to the system clipboard any text that
     * is selected in the currently active DOM element.
     *
     * This method can be used when the formula bar
     * or floating editor is active
     */
    copyText: function() {
      copy_();
    },

    /**
     * Copies to the system clipboard the specified cell content
     * (in the form of plain text).
     *
     * Cell nodes in Quicksheet are never active DOM elements
     * and so this method provides a way to copy cell content
     * to the clipboard that does not rely on there being an
     * active DOM element from which to extract the text
     */
    copyCellContent: function(content) {
      if (content) {
        copyTextNode_.value = content;
      }
      else {
        copyTextNode_.value = '';
      }

      copyTextNode_.select();
      copy_();

      // also internally cache the content
      cachedCellContent_ = content;
      removeSelection_(copyTextNode_);
    },

    /**
     * Pastes from the system clipboard into the
     * currently active DOM element.
     *
     * This method can be used when the formula bar
     * or floating editor is active
     */
    paste: function() {
      paste_();
    },

    /**
     * Returns the current textual content of the system clipboard
     *
     * @return {string} The current text on the system clipboard
     */
    getContents: function() {
      pasteTextNode_.select();
      document.execCommand('paste');
      var contents = pasteTextNode_.value;
      // don't keep a cached copy of the clipboard
      // text, to be as security conscious as possible
      pasteTextNode_.value = '';
      removeSelection_(pasteTextNode_);
      return contents;
    },

    /**
     * Determines whether the system clipboard
     * currently contains Quicksheet cell content.
     *
     * The system clipboard can be manipulated by not only Quicksheet but
     * by Quickword, Quickpoint and any other non-Quickoffice application.
     *
     * @return {boolean} True if the clipboard currently contains
     *                   Quicksheet cell content, otherwise false
     */
    containsCellContent: function() {
      // NOTE: Before we compare the contents of the system clipboard
      // with the cached content we first trim all whitespace from the
      // end of both of these strings. This is a workaround to avoid
      // the issue whereby the final end-of-line character in the system
      // clipboard's text is removed when it pasted for comparison,
      // if it's on an empty line.
      // This can cause the comparison of the two strings to incorrectly
      // determine that they are different when they are in fact the same
      return cachedCellContent_ &&
          (cachedCellContent_.trim() === api_.getContents().trim());
    },

    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a
     * specified node in the HTML DOM.
     * Here the widget's div elements are appended as children to
     * the specified node.
     *
     * @param {object} node The HTML node that this widget is to attach itself
     *     to
     */
    appendTo: function(node) {
      if (!node) {
        throw new Error('appendTo - missing node parameter!');
      }

      if (copyTextNode_) {
        node.appendChild(copyTextNode_);
      }

      if (pasteTextNode_) {
        node.appendChild(pasteTextNode_);
      }
    },

    /**
     * Resets the widget
     */
    destroy: function() {
      if (copyTextNode_ && copyTextNode_.parentNode) {
        copyTextNode_.parentNode.removeChild(copyTextNode_);
      }
      if (pasteTextNode_ && pasteTextNode_.parentNode) {
        pasteTextNode_.parentNode.removeChild(pasteTextNode_);
      }

      copyTextNode_ = undefined;
      pasteTextNode_ = undefined;
      cachedCellContent_ = undefined;

      PubSub.unsubscribe(destroyToken_);

      destroyToken_ = undefined;
    }
  };

  var cut_ = function() {
    document.execCommand('cut');
  };

  var copy_ = function() {
    document.execCommand('copy');
  };

  var paste_ = function() {
    document.execCommand('paste');
  };

  var removeSelection_ = function(element) {
    window.getSelection().removeAllRanges();
    element.blur();
  };
  return api_;
});
