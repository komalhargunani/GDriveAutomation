define([
  'qowtRoot/commands/quicksheet/formatCellsBase'
], function(
    FormatCellsBase) {

  'use strict';

  var factory_ = {

    /**
     * @constructor
     *
     * Defines a SetCellStrikethrough command including response behaviours.
     * See the dcp schema on details of response, but in general this command
     * sets the strikethrough of cells.
     *
     * @param {Integer} fromColIndex - The index of the col of the upper-left
     *        cell which is to have its strikethrough status changed
     * @param {Integer} fromRowIndex - The index of the row of the upper-left
     *        cell which is to have its strikethrough status changed
     * @param {Integer} toColIndex - The index of the col of the lower-right
     *        cell which is to have its strikethrough status changed
     * @param {Integer} toRowIndex - The index of the row of the lower-right
     *        cell which is to have its strikethrough status changed
     * @param {Boolean} isStrikethrough -  The new strikethrough setting
     * @return {Object} A SetCellStrikethrough command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     isStrikethrough) {
      if (isStrikethrough === undefined) {
        throw ('ERROR: SetCellStrikethrough requires a strikethrough setting');
      }

      return FormatCellsBase.create('SetCellStrikethrough', fromColIndex,
          fromRowIndex, toColIndex, toRowIndex, {
            strikethrough: isStrikethrough
          });
    }
  };
  return factory_;
});
