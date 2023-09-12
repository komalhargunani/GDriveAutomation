// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * Defines a 'wrap text' button for generic use.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */
define([
  'qowtRoot/widgets/factory'
], function(WidgetFactory) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @return {object} A button configuration.
   * <ul>
   * <li>{string} config.type The type of widget to create.
   * <li>{string} config.action The widgets requested action.
   * <li>{boolean} config.sticky True for a bi-state button.
   * <li>{object} config.subscribe Set of signals with callbacks that give
   *     button behaviours.
   * </ul>
   */
  return {
    type: 'button',
    action: 'wrapText',
    sticky: true,

    preExecuteHook: function(set) {
      return {
        formatting: {
          'wrapText': set
        }
      };
    },

    'subscribe': {

         /**
          * Update the button status as a result of a changed selection.
          * @param {string} signal The signal name.
          * @param {string} signalData Contextual information about selection.
          */
         'qowt:selectionChanged': function(signal, signalData) {
           signal = signal || '';
           var widget = WidgetFactory.create(signalData.newSelection);
           if (widget && widget.hasWrapText) {
             this.setActive(widget.hasWrapText());
           }
         }
       }
  };

});
