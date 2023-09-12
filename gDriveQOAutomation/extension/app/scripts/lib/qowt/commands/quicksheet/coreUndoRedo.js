// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines  Undo/Redo command including response behaviours.
 * See the dcp schema on details of response, but in general this
 * command performs undo/redo of the last successful user operation in
 * sheet
 * @author Venkatraman Jeyaraman (Venkatraman@google.com)
 */
define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/events/errors/sheetUndoError',
  'qowtRoot/events/errors/sheetRedoError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    UpdateCellsBase,
    ErrorCatcher,
    QOWTSilentError,
    SheetUndoError,
    SheetRedoError,
    PubSub,
    SheetSelectionManager) {

  'use strict';

  var factory_ = {

    /**
     * Defines the undo command including response behaviours.
     * @constructor
     * @param {Object} cellSelection - The cell selection object
     * @return {Object} An Undo command
     */
    createUndo: function(cellSelection) {
      var undoCommand_ = UpdateCellsBase.create({
        commandName: 'UndoCommand',
        errorFactory: SheetUndoError
      }, {
        /* ulo stands for Undolastoperation */
        name: "ulo"
      });

      undoCommand_.canInvert = true;
      var currentSelection = cellSelection ? cellSelection :
          SheetSelectionManager.getCurrentSelection();
      undoCommand_.getInverse = function() {
        return factory_.createRedo(currentSelection);
      };

      undoCommand_.baseOnSuccess = undoCommand_.onSuccess;
      undoCommand_.onSuccess = function(response, params) {
        undoCommand_.baseOnSuccess(response, params);
        PubSub.publish('qowt:sheet:requestFocus', currentSelection);
      };

      return undoCommand_;
    },

    /**
     * Defines the redo command including response behaviours
     * @constructor
     * @param {Object} currentSelection - The cell selection object
     * @return {Object} A Redo command
     */
    createRedo: function(currentSelection) {
      var redoCommand_ = UpdateCellsBase.create({
        commandName: 'RedoCommand',
        errorFactory: SheetRedoError
      }, {
        /* rlo stands for Redolastoperation */
        name: "rlo"
      });

      redoCommand_.canInvert = true;
      redoCommand_.getInverse = function() {
        return factory_.createUndo(currentSelection);
      };

      redoCommand_.baseOnSuccess = redoCommand_.onSuccess;
      redoCommand_.onSuccess = function(response, params) {
        redoCommand_.baseOnSuccess(response, params);
        if (currentSelection) {
          PubSub.publish('qowt:sheet:requestFocus', currentSelection);
        }
      };

      // This selection check is kept at end because if error occurs then it
      // will be logged to GA. Undo/redo will work fine only the selection will
      // not work properly. User will be able to do further actions.
      if (currentSelection === undefined) {
        ErrorCatcher.handleError(new
            QOWTSilentError('ERROR: RedoCommand requires a selection'));
      }

      return redoCommand_;
    }
  };

  return factory_;
});
