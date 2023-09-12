// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellContent command including response behaviours.
 * See the dcp schema on details of response, but in general this command sets
 * the text contents of a cell to have a different value than before and also
 * updates dependant cells.
 *
 * SetCellContent is also used when deleting the text content of a cell or of a
 * cell range, in response to a delete or backspace key press.
 */
define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/events/errors/sheetEditError',
  'qowtRoot/commands/quicksheet/coreUndoRedo'
  ], function(
    UpdateCellsBase,
    SheetEditError,
    CoreUndoRedo
    ) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * @param fromColIndex {integer} The index of the column of the upper-left
     *                               cell which is to have its contents changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *                               which is to have its contents changed
     * @param toColIndex {integer} The index of the column of the lower-right
     *                             cell which is to have its contents changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *                             which is to have its contents changed
     * @param cellText {string} The updated text for the cell. (ie. edit text)
     * @return {Object} A SetCellContent command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
        cellText) {
      if (cellText === undefined) {
        throw ("ERROR: SetCellContent requires an updated cell text");
      }
      if ((fromColIndex === undefined && toColIndex !== undefined) ||
          (fromColIndex !== undefined && toColIndex === undefined) ||
          (fromRowIndex === undefined && toRowIndex !== undefined) ||
          (fromRowIndex !== undefined && toRowIndex === undefined)) {
        throw ("ERROR: SetCellContent: either the rows or columns need to" +
            " be defined");
      }

      /**
       * For DCP, see dcplegacyservice-cpp-main/schemas/requests/quicksheet/
       *              SetCellContent/SetCellContent-request-schema.json
       */
      // 'SetCellContent', 'cellContentComplete',
      var command = UpdateCellsBase.create(
          {
            commandName: 'SetCellContent',
            errorFactory: SheetEditError,
            endSignal: 'qowt:cellContentComplete'
          },
          {
            name: "scc",
            r1: fromRowIndex,
            c1: fromColIndex,
            r2: toRowIndex,
            c2: toColIndex,
            t: cellText
          });
      command.canInvert = true;
      command.getInverse = function() {
        return CoreUndoRedo.createUndo();
      };
      return command;
    }
  };

  return _factory;
});
