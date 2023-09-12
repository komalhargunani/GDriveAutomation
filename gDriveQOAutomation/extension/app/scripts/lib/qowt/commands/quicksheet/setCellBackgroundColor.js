// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellBackgroundColor command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the background color of cells.
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
     *                     which is to have its background color changed
     * @param fromRowIndex {number} The index of the row of the upper-left cell
     *                     which is to have its background color changed
     * @param toColIndex {number} The index of the col of the lower-right cell
     *                   which is to have its background color changed
     * @param toRowIndex {number} The index of the row of the lower-right cell
     *                   which is to have its background color changed
     * @param backgroundColor {string} The new background color setting
     * @return {Object} A SetCellBackgroundColor command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
        backgroundColor) {
      if (backgroundColor === undefined) {
        throw ("ERROR: SetCellBackgroundColor requires a background color " +
            "setting");
      }

      return FormatCellsBase.create(
          'SetCellBackgroundColor', fromColIndex, fromRowIndex, toColIndex,
          toRowIndex, {
            bg: backgroundColor
          });
    }
  };

  return _factory;
});
