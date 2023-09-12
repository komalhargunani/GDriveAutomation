// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellFontFace command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the font face of cells.
 */
define([
  'qowtRoot/commands/quicksheet/formatCellsBase',
  'qowtRoot/models/sheet'
  ], function(
    FormatCellsBase,
    SheetModel) {

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
     * @param fontFace {string} The new font face setting
     * @return {Object} A SetCellFontFace command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     fontFace) {
        if (fontFace === undefined) {
          throw ("ERROR: SetCellFontFace requires fontFace parameter");
        }

        var x, fonts = SheetModel.fontNames;
        for(x=0;x<fonts.length;x++) {
          if(fontFace.toLowerCase() === fonts[x].toLowerCase()) {
            break;
          }
        }

        if(x>=fonts.length) {
          throw ("ERROR: SetCellFontFace: no index found for font " + fontFace);
        }

        return FormatCellsBase.create('SetCellFontFace', fromColIndex,
            fromRowIndex, toColIndex, toRowIndex, {
          fi: x
        });
    }

  };

  return _factory;
});
