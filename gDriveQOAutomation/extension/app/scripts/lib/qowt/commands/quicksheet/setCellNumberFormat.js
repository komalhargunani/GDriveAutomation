// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellNumberFormat command. See the dcp schema on
 * details of response, but in general this command sets the number format of
 * cells.
 *
 *  @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/commands/quicksheet/formatCellsBase'
], function(
    FormatCellsBase) {

  'use strict';

  var _factory = {

    /**
     * @constructor
     * @param fromColIndex {number} The index of the col of the upper-left cell
     *                     which is to have its number format changed
     * @param fromRowIndex {number} The index of the row of the upper-left cell
     *                     which is to have its number format changed
     * @param toColIndex {number} The index of the col of the lower-right cell
     *                   which is to have its number format changed
     * @param toRowIndex {number} The index of the row of the lower-right cell
     *                   which is to have its number format changed
     * @param numberFormat {string} The new number format setting
     * @return {Object} A SetCellNumberFormat command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
        numberFormat) {
      if (numberFormat === undefined) {
        throw ("ERROR: SetCellNumberFormat requires numberFormat parameter");
      }

      return FormatCellsBase.create(
          'SetCellNumberFormat', fromColIndex, fromRowIndex, toColIndex,
          toRowIndex, {
            nf: numberFormat
          });
    }
  };

  return _factory;
});
