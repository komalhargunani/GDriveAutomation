// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base class for commands that affect cell formatting. See the
 * dcp schema on details of response, but in general this command creates new
 * cell widgets with updated formatting.
 */
define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/events/errors/sheetFormattingError',
  'qowtRoot/commands/quicksheet/coreUndoRedo'
  ], function(
    UpdateCellsBase,
    SheetFormattingError,
    CoreUndoRedo) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * @param commandName {string} The name of the command being created
     * @param fromColIndex {integer} The index of the col of the upper-left cell
     *        which is to have its formatting set
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its formatting set
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its formatting set
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its formatting set
     * @param fmObject {Object} A SheetFormatting object
     * @return {Object} A FormatCellsBase command
     */
    create: function(commandName, fromColIndex, fromRowIndex, toColIndex,
                     toRowIndex, fmObject) {
        if (fmObject === undefined || commandName === undefined) {
          throw ("ERROR: " + commandName + " had an undefined argument");
        }
        if((fromColIndex === undefined && toColIndex !== undefined) ||
           (fromColIndex !== undefined && toColIndex === undefined) ||
           (fromRowIndex === undefined && toRowIndex !== undefined) ||
           (fromRowIndex !== undefined && toRowIndex === undefined)) {
          throw ("ERROR: " + commandName + ": either the rows or cols need " +
              "to be defined");
        }

        /**
         * For DCP, see dcplegacyservice-cpp-main/schemas/requests/quicksheet/
         * SetCellFormat/SetCellFormat-request-schema.json
         */
        var command = UpdateCellsBase.create(
          {
              commandName: commandName,
              errorFactory: SheetFormattingError,
              endSignal: 'qowt:cellFormatComplete'
          },
          {
              name: "scf",
              r1: fromRowIndex,
              c1: fromColIndex,
              r2: toRowIndex,
              c2: toColIndex,
              fm: fmObject
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
