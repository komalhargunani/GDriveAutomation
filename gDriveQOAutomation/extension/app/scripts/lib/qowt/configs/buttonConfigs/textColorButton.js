// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'text color' button for generic use.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/widgets/factory',
  'common/elements/customSelector',
  'qowtRoot/configs/buttonConfigs/paletteColors',
  'third_party/lo-dash/lo-dash.min'
], function(
  WidgetFactory,
  CustomSelector,
  PaletteColors
  /*lo-dash*/) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @param returns {object} A button configuration.
   * @param returns {string} config.type The type of widget to create.
   * @param returns {string} config.action The widgets requested action.
   * @param returns {object} config.items An array containing all the
   *                         menuitem configurations.
   * @param returns {object} config.subscribe Set of signals with
   *                         callbacks that give button behaviours.
   */
  return {
    type: 'colorDropdown',
    action: 'textColor',
    formattingProp: 'clr',

    items: PaletteColors,
    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var textClr;
        var element = CustomSelector.findInSelectionChain(['clr']);
        if (element) {
          textClr = element.getComputedDecorations().clr;
        } else {
          var widget = WidgetFactory.create(signalData.newSelection);
          if (widget && widget.getTextColor) {
            textClr = widget.getTextColor();
          }
        }
        this.setSelectedItem(textClr);
      },

      /**
       * Update the button status as a result of a changed formatting.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about formatting.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        if (_.has(signalData, 'formatting.clr')) {
          this.setSelectedItem(signalData.formatting.clr);
        }
      }
    }
  };
});
