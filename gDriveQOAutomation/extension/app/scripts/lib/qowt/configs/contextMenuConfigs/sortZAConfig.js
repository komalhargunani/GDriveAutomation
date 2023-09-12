// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Defines a 'Sort Z-A' context menu item for generic use, and returns a
 * context menu item configuration.
 *
 * Here 'this' is bound to the menuitem widget generated from this config.
 *
 * @param returns {object} A context menuitem configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.stringId The string Id to use in context menu
 * @param returns {string} config.action The widgets requested action.
 * @param returns {object} config.context The widgets context object.
 * @param returns {object} config.subscribe Signals widget listens to.
 */

define(['qowtRoot/utils/sheet-lo-dash'], function() {

  'use strict';

  return {
    type: 'menuItem',
    stringId: 'context_menu_sort_collation_descending',
    action: 'sortCellRange',
    actionId: 'sortCellRangeDescending',
    context: {
      'contentType': 'sheetCell',
      'ascending': false
    },
    subscribe: {
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var r1 = -1, r2 = -1;
        var c1 = -1, c2 = -1;
        var newSel = signalData && signalData.newSelection ?
          signalData.newSelection : undefined;
        if(newSel && newSel.topLeft && _.isValidCell(newSel.topLeft)) {
          r1 = newSel.topLeft.rowIdx;
          c1 = newSel.topLeft.colIdx;
        }
        if(newSel && newSel.bottomRight && _.isValidCell(newSel.bottomRight)) {
          r2 = newSel.bottomRight.rowIdx;
          c2 = newSel.bottomRight.colIdx;
        }
        if(newSel && newSel.contentType === "sheetCell" &&
            (r1 !== -1 && r2 !== -1 && r1 !== r2 && c1 !== -1 && c2 !== -1)) {
          this.setEnabled(true);
        } else {
          this.setEnabled(false);
        }
      }
    }
  };
});