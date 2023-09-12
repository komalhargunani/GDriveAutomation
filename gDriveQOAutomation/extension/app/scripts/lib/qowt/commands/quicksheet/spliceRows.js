// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Defines a SpliceRows command including response behaviours.
 * See the dcp schema on details of response, but in general this
 * command inserts or deletes a number of rows into/from the grid.
 */
define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/events/errors/sheetInsertRowError',
  'qowtRoot/events/errors/sheetDeleteRowError',
  'qowtRoot/commands/quicksheet/coreUndoRedo'
], function (
  UpdateCellsBase,
  PaneManager,
  SheetInsertRowError,
  SheetDeleteRowError,
  CoreUndoRedo) {

  'use strict';

  var factory_ = {

    /**
     * @param {number} rowIndex index where the rows are to be inserted/deleted
     * @param {number} numRows how many rows will be inserted/deleted
     * @param {boolean=} opt_isDelete Boolean to tell if the operation is delete
     *    or not
     */
    create:function (rowIndex, numRows, opt_isDelete) {
      var error_, revertObj_;
      numRows = numRows !== undefined ? numRows : 1;

      if (rowIndex === undefined) {
        throw ("ERROR: SpliceRows requires index");
      }

      error_ = opt_isDelete ? SheetDeleteRowError : SheetInsertRowError;

      // extend default command (optimistic==true, callsService==true)
      var api_ = UpdateCellsBase.create(
        {
          commandName: 'SpliceRows',
          errorFactory: error_
        }, {
          name: "spr",
          ri: rowIndex,
          nu: numRows,
          de: opt_isDelete
        },
        true);

      /**
       * Optimistic part of the request
       */
      api_.doDirtyOptimistic = function () {
        if(opt_isDelete) {
          revertObj_ = PaneManager.deleteRows(rowIndex, numRows);
        } else {
          PaneManager.insertRows(rowIndex, numRows);
        }
      };

      /**
       * Reverts the optimistic part of the request if the request fails
       */
      api_.doRevert = function () {
        if(opt_isDelete) {
          PaneManager.insertRows(rowIndex, numRows, revertObj_);
        } else {
          PaneManager.deleteRows(rowIndex, numRows);
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
