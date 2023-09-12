// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellWrapText command. See the dcp schema on
 * details of response, but in general this command sets the wrapText of cells.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */
define([
  'qowtRoot/commands/quicksheet/formatCellsBase'
  ], function(
    FormatCellsBase) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * @param fromColIndex {integer} The index of the col of the upper-left cell
     *        which is to have its wraptext changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its wraptext changed
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its wraptext changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its wraptext changed
     * @param wrapText {boolean} The new wrap text setting
     * @return {Object} A SetCellWrapText command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     wrapText) {
      if (wrapText === undefined) {
        throw new Error("ERROR: SetCellWrapText requires a wrap text setting");
      }

      return FormatCellsBase.create('SetCellWrapText', fromColIndex,
          fromRowIndex, toColIndex, toRowIndex, {
            wrapText: wrapText
          });
    }

  };

  return _factory;
});
