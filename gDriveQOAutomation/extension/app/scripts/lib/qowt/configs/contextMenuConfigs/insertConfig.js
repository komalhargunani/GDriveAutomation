
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'Insert' context menu item for Sheet, and returns a
 * context menu item configuration.
 *
 * Here 'this' is bound to the menuitem widget generated from this config.
 *
 * @param returns {object} A context menuitem configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.stringId The string Id to use in context menu
 * @param returns {string} config.onSelect The function that must be run
 *                         when the menu item is selected
 * @param returns {object} config.subscribe The events the widget listens to
 */

define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager'
  ], function(
    PaneManager,
    PubSub,
    SheetSelectionManager) {

  'use strict';

  return {
    type: 'menuItem',
    stringId: 'context_menu_insert',
    action: 'insert',
    onSelect: function() {
      var sel = SheetSelectionManager.getCurrentSelection();
      if(sel && sel.contentType === "sheetCell" && sel.topLeft) {
        var tL = sel.topLeft;
        if(tL.colIdx === undefined) {
           PubSub.publish('qowt:requestAction', {
              'action': 'insertRow'
          });
        } else if(tL.rowIdx === undefined) {
           PubSub.publish('qowt:requestAction', {
              'action': 'insertColumn'
          });
        }
      }
    },
    subscribe: {
      /**
       * Update the state of the item as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var val = false;
        if(signalData && signalData.newSelection) {
          var sel = signalData.newSelection;
          if(sel.contentType === "sheetCell") {
            val = (PaneManager.isOneOrMoreRowsSelected() ||
                PaneManager.isOneOrMoreColumnsSelected()) &&
                !PaneManager.isEntireSheetSelected();
          }
        }
        this.setEnabled(val);
      }
    }
  };
});