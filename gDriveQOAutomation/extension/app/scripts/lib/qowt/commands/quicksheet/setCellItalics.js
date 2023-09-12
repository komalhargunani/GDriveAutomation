// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellItalics command including response behaviours.
 * See the dcp schema on details of response, but in general this command sets
 * the italics of cells.
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
     *        which is to have its italics changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its italics changed
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its italics changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its italics changed
     * @param italics {boolean} The new italics setting
     * @return {Object} A SetCellItalics command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     italics) {
        if (italics === undefined) {
          throw ("ERROR: SetCellItalics requires a italics setting");
        }

        return FormatCellsBase.create('SetCellItalics', fromColIndex,
            fromRowIndex, toColIndex, toRowIndex, {
          itl: italics
        });
    }

  };

  return _factory;
});
