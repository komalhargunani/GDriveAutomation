// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SortCellRange command including response behaviours.
 * See the dcp schema on details of response, but in general this command sorts
 * a range of cells and also updates dependant cells.
 *
 * @constructor
 * @param rangeSelection {Object} The range of cells to sort
 * @return {Object} A SortCellRange command
 */
define([
  'qowtRoot/commands/quicksheet/coreUndoRedo',
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/errors/qowtError'
  ], function(
    CoreUndoRedo,
    UpdateCellsBase,
    QOWTError) {

  'use strict';


  var _factory = {

    create: function(rangeSelection, ascending) {
      if (rangeSelection === undefined) {
        throw new QOWTError({
          title: 'sheet_sort_error_title',
          details: 'sheet_sort_error',
          message: 'sort command failed: no selection'
        });
      }

      if (ascending === undefined) {
        throw new QOWTError({
          title: 'sheet_sort_error_title',
          details: 'sheet_sort_error',
          message: 'sort command failed: no ascending'
        });
      }

      if (rangeSelection.topLeft === undefined &&
          rangeSelection.bottomRight === undefined) {
        throw new QOWTError({
          title: 'sheet_sort_error_title',
          details: 'sheet_sort_error',
          message: 'sort command failed: no topLeft/bottomRight'
        });
      }

      var command_ = UpdateCellsBase.create(
        {
          commandName: 'SortCellRange',
          // TODO(respino) errorFactory defines a message to be shown in the
          // notification area on failure, this should be a simple localised
          // string rather than an object.  Anything more advanced, like showing
          // a modal dialog, should be handled in the command's onFailure
          errorFactory: { errorId: 'sheet_format_cells_error' },
          endSignal: 'qowt:cellContentComplete'
        },
        {
          name: 'sort',
          r1: rangeSelection.topLeft.rowIdx,
          c1: rangeSelection.topLeft.colIdx,
          r2: rangeSelection.bottomRight.rowIdx,
          c2: rangeSelection.bottomRight.colIdx,
          caseSensitive: false,
          criteria: [
            {
              sortCol: rangeSelection.topLeft.colIdx,
              ascending: ascending,
              sortBy: 'value'
            }
          ]
      });

      command_.canInvert = true;

      command_.getInverse = function() {
        return CoreUndoRedo.createUndo();
      };

      return command_;
    }
  };

  return _factory;
});
