// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 * UpdateColumnHandler handles changes in the column formatting.
 * It receives the new formatting for the column
 * and updates the corresponding column in the grid.
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

/**
 * Constructor for the UpdateColumn DCP Handler.
 * This handler processes a 'ucn' element from a DCP response
 * in its visit() method
 *
 * @constructor
 * @return {object} A UpdateColumn DCP handler
 */
define([
  'qowtRoot/controls/grid/workbook'
  ],
  function(
    Workbook) {

  'use strict';

  var _api;

  _api = {
    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'ucn',

    /**
     * Processes a 'ucn' (column) element from a DCP response.
     * This involves updating the corresponding column with
     * the new column formatting.
     *
     * @param v {object}   A column element from a DCP response
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if(!v || !v.el || !v.el.etp ||
        (v.el.etp !== 'ucn')) { return undefined; }

        Workbook.formatColumn(v.el.ci, v.el.fm, v.el.delfm);
        return undefined;
      }
    };

    return _api;
});
