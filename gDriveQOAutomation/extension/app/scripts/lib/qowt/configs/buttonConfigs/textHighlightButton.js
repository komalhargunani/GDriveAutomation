// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview  Return a button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {object} config.items An array containing all the
 *                menuitem configurations.
 * @param returns {object} config.items.string The not localisable string
 *                to use in the menu item.
 * @param returns {object} subscribe Optional set of signals with callbacks that
 *                give button behaviours.
 */

define([
  'common/elements/customSelector',
  'qowtRoot/widgets/factory',
  'third_party/lo-dash/lo-dash.min'
], function(CustomSelector, WidgetFactory) {

  'use strict';

  return {
    type: 'colorDropdown',
    action: 'highlightColor',
    formattingProp: 'hgl',

    items: [
      {
        type: 'menuItem',
        action: 'noHighlightColor',
        stringId: 'menu_item_color_none',
        iconClass: 'noColor',
        context: {
          formatting: {
            hgl: 'auto' // value used by Core
          }
        }
      },

      // DOCX only support this pre-defined list of 16 colors.
      '#000000',
      '#0000FF',
      '#00FFFF',
      '#00008B',
      '#008B8B',
      '#A9A9A9',
      '#006400',
      '#800080',
      '#8B0000',
      '#808000',
      '#00FF00',
      '#D3D3D3',
      '#FF00FF',
      '#FF0000',
      '#FFFFFF',
      '#FFFF00'
    ],

    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {object} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var textHgl;
        var element = CustomSelector.findInSelectionChain(['hgl']);
        if (element) {
          textHgl = element.getComputedDecorations().hgl;
        } else {
          var widget = WidgetFactory.create(signalData.newSelection);
          if (widget && widget.getHighlightColor) {
            textHgl = widget.getHighlightColor();
          }
        }
        this.setSelectedItem(textHgl);
      },

      /**
       * Update the button status as a result of a changed formatting.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about formatting.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        if (_.has(signalData, 'formatting.hgl')) {
          this.setSelectedItem(signalData.formatting.hgl);
        }
      }
    }
  };
});
