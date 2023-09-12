define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/events/errors/sheetEditError',
  'qowtRoot/commands/quicksheet/coreUndoRedo'
  ], function(
    UpdateCellsBase,
    SheetEditError,
    CoreUndoRedo) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * Defines a SetMergeCell command, this is a non-optimistic command. See the
     * dcp schema on details of response, but in general this command
     * merge/unmerge a selected range of cells and update the text content for
     * the merged/unmerged cell and will also updates dependant cells if any.
     *
     * @param {number} fromRowIndex - The index of the row from where the cell
     *     selection started to be merged/unmerged. fromRowIndex must be
     *     less than or equal to toRowIndex.
     * @param {number} fromColIndex - The index of the column from where the
     *     cell selection started to be merged/unmerged. fromColIndex must be
     *     less than or equal to toColIndex.
     * @param {number} toRowIndex - The index of the row where the cell
     *     selection ended to be merged/unmerged.
     * @param {number} toColIndex - The index of the column where the cell
     *     selection ended to be merged/unmerged.
     *
     * @param {string} mergeOption - Selected merge option. Merge option could
     *     be one of the following:
     *     1. Merge All
     *     2. Merge horizontally
     *     3. Merge vertically
     *     4. Unmerge
     * @return {Object} A SetMergeCell command
     */
    create: function(fromRowIndex, fromColIndex, toRowIndex, toColIndex,
                     mergeOption) {
      if (mergeOption === undefined) {
        throw new Error("ERROR: SetMergeCell requires a mergeOption.");
      }

      if ((fromColIndex === undefined && toColIndex !== undefined) ||
          (fromColIndex !== undefined && toColIndex === undefined) ||
          (fromRowIndex === undefined && toRowIndex !== undefined) ||
          (fromRowIndex !== undefined && toRowIndex === undefined)) {
        throw new Error("ERROR: SetMergeCell: either the rows or columns " +
            "need to be defined.");
      }

      if (((fromColIndex >= 0 && toColIndex >= 0) &&
          (fromColIndex > toColIndex)) ||
          ((fromRowIndex >= 0 && toRowIndex >= 0) &&
          (fromRowIndex > toRowIndex))) {
        throw new Error("ERROR: SetMergeCell: fromIndex must be less than " +
            "or equal to toIndex.");
      }

      if((fromColIndex >= 0 && toColIndex >= 0) &&
          (fromRowIndex >= 0 && toRowIndex >= 0) &&
          (fromColIndex === toColIndex) && (fromRowIndex === toRowIndex)){
        throw new Error("ERROR: SetMergeCell: Merging or un-merging a single " +
            "cell is not possible.");
      }

      /**
       * For DCP, see pronto/src/dcp/schemas/requests/sheet/
       * SetMergeCellOperation-request-schema.json
       */
      var command = UpdateCellsBase.create(
          {
            commandName: 'setMergeCell',
            errorFactory: SheetEditError,
            endSignal: 'qowt:cellContentComplete'
          },
          {
            name: "setMergeCell",
            r1: fromRowIndex,
            c1: fromColIndex,
            r2: toRowIndex,
            c2: toColIndex,
            option: mergeOption
          });
      command.canInvert = true;
      command.getInverse = CoreUndoRedo.createUndo;
      return command;
    }
  };

  return _factory;
});
