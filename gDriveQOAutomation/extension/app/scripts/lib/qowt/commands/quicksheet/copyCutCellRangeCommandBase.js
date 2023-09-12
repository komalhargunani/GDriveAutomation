// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base class for a CopyCellRange command and a
 * CutCellRange command. It provides a common onSuccess() method.
 *
 * Note that if a subclass of this module requires to perform command-specific
 * work if the command's execution is successful then the subclass should
 * define an onSubclassSuccess() method as part of its public API, which
 * carries out that work. The onSubclassSuccess() method will be invoked
 * from within the immutable onSuccess() method of CopyCutCellRangeCommandBase.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/widgets/grid/sysClipboard',
  'qowtRoot/controls/grid/paneManager'
  ], function(
    CommandBase,
    SysClipboard,
    PaneManager) {

  'use strict';

  var factory_ = {

    /**
     * Create a new command object.
     *
     * @param {object} rangeSelection The selection object that contains
     *                                the range of cells to copy or cut -
     *                                this may be just a single cell, or more
     * @param {string or undefined} opt_cmdName Optional unique name
     *                                          for this command
     * @param {boolean or undefined} opt_optimistic Optional flag indicating
     *                               whether this command is optimistic or not.
     *                               If provided, true if the command
     *                               is optimistic, otherwise false.
     *                               Defaults to true if undefined
     * @return {object} A new command object
     */
    create: function(rangeSelection, opt_cmdName, opt_optimistic) {
      if(!rangeSelection) {
        throw new Error('create - CopyCutCellRangeCommandBase requires a' +
            ' range selection to be defined');
      }

      if(!rangeSelection.topLeft ||
        !rangeSelection.bottomRight ||
        !rangeSelection.anchor) {
        throw new Error("create - CopyCutCellRangeCommandBase requires valid " +
          "anchor, topLeft and bottomRight object to be defined");
      }

      var callsService = true;
      var api_ = CommandBase.create(opt_cmdName, opt_optimistic, callsService);

      api_.onSuccess = function() {
        // copy the cell range to the system clipboard
        // (and cater for the case where rangeSelection
        // represents a range of rows or a range of columns)
        var mainPane = PaneManager.getMainPane();
        var startRowIdx = rangeSelection.topLeft.rowIdx;
        var startColIdx = rangeSelection.topLeft.colIdx;
        var endRowIdx = rangeSelection.bottomRight.rowIdx;
        var endColIdx = rangeSelection.bottomRight.colIdx;

        if((startRowIdx >= 0) && (endRowIdx >= 0) &&
          (startColIdx === undefined) && (endColIdx === undefined)) {
          // we are dealing with entire rows - need to calculate
          // which rightmost column to process across to
          startColIdx = 0;
          endColIdx = getRightmostCellWidgetColIdx_(
            mainPane, startRowIdx, endRowIdx);
        }
        else if((startColIdx >= 0) && (endColIdx >= 0) &&
          (startRowIdx  === undefined) && (endRowIdx  === undefined)) {
          // we are dealing with entire columns - need to
          // calculate which row to process down to
          startRowIdx = 0;
          endRowIdx = getLowestCellWidgetRowIdx_(
            mainPane, startColIdx, endColIdx);
        }

        var text = '';
        var addTab = false;

        // as in Excel use a tab to seperate horizontally neighbouring
        // cells and a newline to seperate vertically neighbouring cells
        for(var rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx++) {
          for(var colIdx = startColIdx; colIdx <= endColIdx; colIdx++) {
            if(addTab) {
              text += '\t';
            }
            else {
              addTab = true;
            }
            var row = mainPane.getRow(rowIdx);
            if(row) {
              var cell = row.getCell(colIdx);
              if(cell && cell.cellText) {
                text += cell.cellText;
              }
            }
          }
          text += '\n';
          addTab = false;
        }

        SysClipboard.copyCellContent(text);

        // call the 'extra' successful part (if there is one) of the subclass
        if(api_.onSubclassSuccess) {
          api_.onSubclassSuccess();
        }
      };

      // prevent the subclass from overwriting the onSuccess() method
      Object.defineProperties(api_, {onSuccess: {writable: false}});

      return api_;
    }
  };

  var getRightmostCellWidgetColIdx_ = function(mainPane, startRowIdx,
                                               endRowIdx) {
    var colIdx = 0;
    for(var idx = startRowIdx; idx <= endRowIdx; idx++) {
      var row = mainPane.getRow(idx);
      if(row && (row.getNumOfCells() > 0)) {
        colIdx = Math.max(colIdx, row.getNumOfCells() - 1);
      }
    }
    return colIdx;
  };

  var getLowestCellWidgetRowIdx_ = function(mainPane, startColIdx, endColIdx) {
    var rowIdx = 0;
    for(var idx = startColIdx; idx <= endColIdx; idx++) {
      var col = mainPane.getColumn(idx);
      if(col && (col.getNumOfCells() > 0)) {
        rowIdx = Math.max(rowIdx, col.getNumOfCells() - 1);
      }
    }
    return rowIdx;
  };

  return factory_;
});
