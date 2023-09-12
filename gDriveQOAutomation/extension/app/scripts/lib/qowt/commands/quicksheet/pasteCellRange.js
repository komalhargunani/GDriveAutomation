// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a PasteCellRange command including response behaviours.
 * See the dcp schema on details of response, but in general this command Paste
 * a range of cells and also updates dependant cells.
 * @author Venkatraman Jeyaraman (Venkatraman@google.com)
 *
 * @constructor
 * @param rangeSelection {Object} The selection object containing the range to
 *        paste the copied cells
 * @return {Object} A PasteCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/coreUndoRedo',
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/events/errors/sheetPasteError',
  'qowtRoot/models/sheet'
], function(
  CoreUndoRedo,
  UpdateCellsBase,
  PaneManager,
  SheetPasteError,
  SheetModel) {

  'use strict';

  var _factory = {

    create: function(rangeSelection) {

      if (rangeSelection === undefined) {
        throw ("ERROR: PasteCellRange requires Range selection to be " +
            "defined");
      }

      if ((rangeSelection.topLeft === undefined) ||
          (rangeSelection.bottomRight === undefined)) {
        throw ("ERROR: PasteCellRange requires valid topleft and " +
            "bottomright object to be defined");
      }

      var command_ = UpdateCellsBase.create(
          {
            commandName: 'PasteCellRange',
            errorFactory: SheetPasteError,
            endSignal: 'qowt:cellPasteComplete'
          },
          {
            name: "pcr",
            r1: rangeSelection.topLeft.rowIdx,
            c1: rangeSelection.topLeft.colIdx,
            r2: rangeSelection.bottomRight.rowIdx,
            c2: rangeSelection.bottomRight.colIdx
          });

      command_.canInvert = true;

      command_.getInverse = function() {
        return CoreUndoRedo.createUndo();
      };

      command_.baseOnSuccess = command_.onSuccess;
      command_.onSuccess = function(response, params) {
        command_.baseOnSuccess(response, params);
        SheetModel.activeCutOpSheetIdx = undefined;

        // To update cell formatting in toolbar menu after
        // completion of paste operation.
        PaneManager.reselectCurrentSelection();
      };

      return command_;
    }
  };

  return _factory;
});