// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellHorizontalAlignment command including response
 * behaviours. See the dcp schema on details of response
 *
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
     *        which is to have its horizontal alignment changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its horizontal alignment changed
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its horizontal alignment changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its horizontal alignment changed
     * @param alignmentPos {string} The new horizontal alignment setting
     * @return {Object} A SetCellHorizontalAlignment command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     alignmentPos) {
        if (alignmentPos === undefined) {
          throw ("ERROR: SetCellHorizontalAlignment requires an alignment " +
              "setting");
        }

        return FormatCellsBase.create('SetCellHorizontalAlignment',
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, {
          ha: alignmentPos
        });
    }

  };

  return _factory;
});
