// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellUnderline command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the underline of cells.
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
     *        which is to have its underline changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its underline changed
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its underline changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its underline changed
     * @param underline {boolean} The new underline setting
     * @return {Object} A SetCellUnderline command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     underline) {
        if (underline === undefined) {
          throw ("ERROR: SetCellUnderline requires a underline setting");
        }

        return FormatCellsBase.create('SetCellUnderline', fromColIndex,
            fromRowIndex, toColIndex, toRowIndex, {
          udl: underline
        });
    }

  };

  return _factory;
});
