// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Defines a SpliceColumns command including response behaviours.
 * See the dcp schema on details of response, but in general this
 * command inserts or deletes a number of columns into/from the grid.
 */
define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/events/errors/sheetInsertColumnError',
  'qowtRoot/events/errors/sheetDeleteColumnError',
  'qowtRoot/commands/quicksheet/coreUndoRedo'
], function (
  UpdateCellsBase,
  PaneManager,
  SheetInsertColumnError,
  SheetDeleteColumnError,
  CoreUndoRedo) {

  'use strict';

  var factory_ = {

    /**
     * @param {number} colIndex index where the columns are to be
     *    inserted/deleted
     * @param {number} numCols how many columns will be inserted/deleted
     * @param {boolean=} opt_isDelete Boolean to tell if the operation is delete
     *    or not
     */
    create:function (colIndex, numCols, opt_isDelete) {
      var error_, revertObj_;
      numCols = numCols !== undefined ? numCols : 1;

      if (colIndex === undefined) {
        throw ("ERROR: SpliceColumns requires index");
      }

      error_ = opt_isDelete ? SheetDeleteColumnError : SheetInsertColumnError;

      // extend default command (optimistic==true, callsService==true)
      var api_ = UpdateCellsBase.create(
        {
          commandName: 'SpliceCols',
          errorFactory: error_
        }, {
          name: "spc",
          ci: colIndex,
          nu: numCols,
          de: opt_isDelete
        },
        true);

      /**
       * Optimistic part of the request
       */
      api_.doDirtyOptimistic = function () {
        if(opt_isDelete) {
          revertObj_ = PaneManager.deleteColumns(colIndex, numCols);
        } else {
          PaneManager.insertColumns(colIndex, numCols);
        }
      };

      /**
       * Reverts the optimistic part of the request if the request fails
       */
      api_.doRevert = function () {
        if(opt_isDelete) {
          PaneManager.insertColumns(colIndex, numCols, revertObj_);
        } else {
          PaneManager.deleteColumns(colIndex, numCols);
        }
      };

      api_.canInvert = true;
      api_.getInverse = function() {
        return CoreUndoRedo.createUndo();
      };

      return api_;
    }
  };
  return factory_;
});

