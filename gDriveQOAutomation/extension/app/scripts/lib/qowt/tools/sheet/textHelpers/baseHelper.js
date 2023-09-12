// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base module for a text helper of the Sheet Text Tool.
 * The Sheet Text Tool uses two text helpers - the 'normal' text helper
 * and the 'formula' text helper - to manage manipulation of the text
 * that is being edited.
 *
 * This module provides a base API that contains the mandatory
 * methods of both text helpers. These methods can be overridden.
 * It also provides some common utility methods that can be used
 * by the text helpers.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet'],
  function(
    SheetSelectionManager,
    SheetModel) {

  'use strict';

    var contentType_ = 'sheetText';

    var factory_ = {

      create: function() {

        var api_ = {

          // Properties that can be overridden

          /**
           * The mode of the text helper
           */
          mode: 'base',

          /**
           * Initializes the text helper
           */
          init: function() {
          },

          /**
           * Resets the text helper
           */
          reset: function() {
          },

          /**
           * Invoked by the Sheet Text Tool when a
           * mousedown event occurs on the panes container
           *
           * @param {object} event The mousedown event
           */
          onMouseDownOnPanesContainer: function(/* event */) {
          },

          /**
           * Invoked by the Sheet Text Tool when a
           * mousedown event occurs on a pane
           *
           * @param {object} event The mousedown event
           */
          onMouseDownOnPane: function(/* event */) {
          },

          /**
           * Invoked by the Sheet Text Tool when a
           * keydown event occurs for an arrow key
           *
           * @param {object} event The keydown event
           */
          onArrowKeyDown: function(/* event */) {
          },

          /**
           * Invoked by the Sheet Text Tool when a mutation
           * event occurs in the active text editor
           */
          onMutationEvent: function() {
          },

          /**
           * Invoked by the Sheet Text Tool when a choice
           * is selected from the auto-complete menu and
           * needs to be injected into the active text editor
           *
           * @param {string} text The text that was selected
           *                      from the auto-complete menu
           */
          onInjectAutocompleteText: function(/* text */) {
          },

          // Properties that cannot be overridden

          /**
           * Commits the cell edit
           *
           * @param {object} event The event that caused the commit
           */
          doCommitCellEdit: function(event) {
            var selectionObj = SheetSelectionManager.getCurrentSelection();
            if(selectionObj && (selectionObj.contentType === contentType_) &&
              (selectionObj.textWidget)) {
              selectionObj.textWidget.commit(event, (this.mode === 'formula'));
            }

            SheetModel.lastAnchorCell = undefined;
          },

          /**
           * Injects a newline character into the text editor's text
           * at the current cursor position.
           */
          doInjectNewlineCharacter: function() {
            var selectionObj = SheetSelectionManager.getCurrentSelection();
            if(selectionObj && selectionObj.textWidget &&
               selectionObj.textWidget.injectNewlineCharacter) {
              selectionObj.textWidget.injectNewlineCharacter();
            }
          }
        };

        // prevent subclasses from overridding the utility methods
        Object.defineProperties(api_, {doCommitCellEdit: {writable: false}});

        return api_;
      }
    };

    return factory_;
});
