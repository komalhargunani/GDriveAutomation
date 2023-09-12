// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'background color' button for Sheet.
 * Returns a button configuration.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/widgets/factory',
  'qowtRoot/configs/buttonConfigs/sheetButtons/paletteColors'],
  function(
    WidgetFactory,
    PaletteColors) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @param returns {object} A button configuration.
   * @param returns {string} config.type The type of widget to create.
   * @param returns {string} config.action The widgets requested action.
   * @param returns {object} config.items An array containing all the
 *                           menuitem configurations.
   * @param returns {object} config.subscribe Set of signals with
   *                         callbacks that give button behaviours.
   */
  return {
    type: 'colorDropdown',
    action: 'backgroundColor',
    formattingProp: 'bg',

    items: [
      {
        type: 'menuItem',
        action: 'backgroundColor',
        stringId: 'menu_item_color_none',
        iconClass: 'noColor',
        context: {
          formatting: {
            bg: 'NONE'
          }
        }
      }
    ].concat(PaletteColors),
    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var widget = WidgetFactory.create(signalData);

        // Play it safe and turn the button off if we can't get a widget
        // or the widget doesn't support our query.
        if(widget && widget.getBackgroundColor) {
          this.setSelectedItem(widget.getBackgroundColor());
        }
        else {
          this.setSelectedItem();
        }
      }
    }
  };
});
