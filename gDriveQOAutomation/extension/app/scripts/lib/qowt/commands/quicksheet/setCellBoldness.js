// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetCellBoldness command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command sets the boldness of cells.
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
     * @param boldness {boolean} The new boldness setting
     * @return {Object} A SetCellBoldness command
     */
    create: function(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
                     boldness) {
        if (boldness === undefined) {
          throw ("ERROR: SetCellBoldness requires a boldness setting");
        }

        return FormatCellsBase.create('SetCellBoldness', fromColIndex,
            fromRowIndex, toColIndex, toRowIndex, {
          bld: boldness
        });
    }

  };

  return _factory;
});
