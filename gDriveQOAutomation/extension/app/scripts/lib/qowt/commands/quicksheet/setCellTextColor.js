// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellTextColor command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the text color of cells.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
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
     *                     which is to have its text color changed
     * @param fromRowIndex {number} The index of the row of the upper-left cell
     *                     which is to have its text color changed
     * @param toColIndex {number} The index of the col of the lower-right cell
     *                   which is to have its text color changed
     * @param toRowIndex {number} The index of the row of the lower-right cell
     *                   which is to have its text color changed
     * @param textColor {string} The new text color setting
     * @return {Object} A SetCellTextColor command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
        textColor) {
      if (textColor === undefined) {
        throw ("ERROR: SetCellTextColor requires a text color setting");
      }

      return FormatCellsBase.create(
          'SetCellTextColor', fromColIndex, fromRowIndex, toColIndex,
          toRowIndex, {
            clr: textColor
          });
    }
  };

  return _factory;
});
