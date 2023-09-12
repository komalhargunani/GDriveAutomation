define([
  'qowtRoot/commands/quicksheet/formatCellsBase'
], function(
    FormatCellsBase) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * @param {integer} fromColIndex - The index of the col of the upper-left
     *    cell which is to have its border style changed
     * @param {integer} fromRowIndex - The index of the row of the upper-left
     *    cell which is to have its border style changed
     * @param {integer} toColIndex - The index of the col of the lower-right
     *    cell which is to have its border style changed
     * @param {integer} toRowIndex - The index of the row of the lower-right
     *    cell which is to have its border style changed
     * @param {object} borderInfo - This object contains the information
     *    regarding the border properties of the cell. The properties will be in
     *    the following manner:
     *     "borders": {
     *       "side": {
     *           "borderStyle":
     *           "borderColor":
     *       },
     *    Here side can have the following values: "left", "top", "right",
     *    "bottom", "midH", "midV", "none".
     *
     * @return {Object} A setCellBorder command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     borderInfo) {
      if (borderInfo === undefined) {
        throw ('ERROR: setCellBorder: requires the border info');
      }

      if (!Object.keys(borderInfo).length) {
        throw ('ERROR: atleast one border side should be defined');
      } else if (!(borderInfo.hasOwnProperty('left') ||
        borderInfo.hasOwnProperty('right') ||
        borderInfo.hasOwnProperty('top') ||
        borderInfo.hasOwnProperty('bottom') ||
        borderInfo.hasOwnProperty('insideVertical') ||
        borderInfo.hasOwnProperty('insideHorizontal') ||
        borderInfo.hasOwnProperty('all') ||
        borderInfo.hasOwnProperty('removeBorder'))) {
        throw ('ERROR: Invalid border has been defined');
      }

      if ((fromColIndex === undefined && toColIndex !== undefined) ||
        (fromColIndex !== undefined && toColIndex === undefined) ||
        (fromRowIndex === undefined && toRowIndex !== undefined) ||
        (fromRowIndex !== undefined && toRowIndex === undefined)) {
        throw ('ERROR: setCellBorder: either the rows or columns ' +
          'need to be defined');
      }

      return FormatCellsBase.create('setCellBorder', fromColIndex,
        fromRowIndex, toColIndex, toRowIndex, {
          borders: borderInfo
      });
    }
  };
  return _factory;
});
