define([
  'qowtRoot/controls/grid/paneManager',
  'common/elements/custom/qowt-item/qowt-item-behavior'
  ], function(
    PaneManager
    /*QowtItem*/
  ) {

  'use strict';

  window.QowtSheetRowcolItem = Polymer({
    is: 'qowt-sheet-rowcol-item',

    behaviors: [
      QowtItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String,

      /** Specify either 'row' or 'column' as the type for this item. */
      type: {
        type: String,
        value: 'row'
      }
    },

    /**
     * @override
     * @param {Boolean} isDisabled Sets the menu item disabled state.
     * @param {String} signal Name of the signal being handled.
     * @param {Object} signalData
     * @param {Object} signalData.newSelection
     * @param {String} signalData.contentType
     */
    enableHandler: function(makeDisabled, signal, signalData) {
      makeDisabled = makeDisabled || '';
      signal = signal || '';

      var state = true;
      if(signalData && signalData.newSelection) {
        var sel = signalData.newSelection;
        if(sel.contentType === "sheetCell" && sel.topLeft &&
           ((this.type === 'column' && sel.topLeft.colIdx !== undefined) ||
            (this.type === 'row' && sel.topLeft.rowIdx !== undefined)) &&
            !PaneManager.isEntireSheetSelected()) {
          state = false;
        }
      }
      this.disabled = state;
    }
  });

  return {};
});

