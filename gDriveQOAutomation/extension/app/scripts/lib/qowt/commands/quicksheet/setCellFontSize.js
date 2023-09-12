// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellFontSize command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the font size of cells.
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
     *        which is to have its boldness changed
     * @param fromRowIndex {integer} The index of the row of the upper-left cell
     *        which is to have its boldness changed
     * @param toColIndex {integer} The index of the col of the lower-right cell
     *        which is to have its boldness changed
     * @param toRowIndex {integer} The index of the row of the lower-right cell
     *        which is to have its boldness changed
     * @param fontSize {string} The font size value in string
     * @return {Object} A SetCellFontSize command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     fontSize) {
        if (fontSize === undefined) {
          throw ("ERROR: SetCellFontSize requires a fontSize value");
        }
        /* This is required to convert incoming string to a number value as dcp
         expects font size as a number */
        //TODO  - Cant the method be passed in Integer directly rather than a
        // String.Revisit the when the word implements the Font size formatting
        var fs = Math.round(fontSize);

        return FormatCellsBase.create('SetCellFontSize', fromColIndex,
            fromRowIndex, toColIndex, toRowIndex, {
          siz: fs
        });
    }

  };

  return _factory;
});
