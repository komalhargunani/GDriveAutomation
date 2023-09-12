define([
  'qowtRoot/configs/buttonConfigs/paletteColors'
], function(
    PaletteColors) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @return {object} A button configuration.
   * @return {string} config.type The type of widget to create.
   * @return {string} config.action The widgets requested action.
   * @return {object} config.items An array containing all the menuitem
   *     configurations.
   * @return {object} config.subscribe Set of signals with callbacks that give
   *     button behaviours.
   */
  return {
    type: 'colorDropdown',
    action: 'modifyShapeOutlineColor',
    formattingProp: 'ln',
    transformFunction: function(val) {
      return {
        fill: {
          'color': {
            'clr': val,
            'effects': [
              {
                'name': 'alpha',
                'value': 100000
              }
            ],
            'type': 'srgbClr'
          },
          'type': 'solidFill'
        }
      };
    },
    items: [
      {
        type: 'menuItem',
        action: 'modifyShapeOutlineColor',
        stringId: 'menu_item_color_transparent',
        iconClass: 'noColor',
        context: {
          formatting: {
            ln: {
              fill: {
                type: 'noFill'
              }
            }
          }
        }
      }
    ].concat(PaletteColors),
    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var selection = signalData.newSelection &&
            signalData.newSelection.scope;
        var isEnable = false;
        var shapeOutlineFillColor;

        if (selection instanceof QowtPointShape && selection.supports('ln')) {
          isEnable = true;
          var outlineFill = selection.getComputedDecorations().ln.fill;
          shapeOutlineFillColor = outlineFill && outlineFill.color &&
              outlineFill.color.clr;
        }
        this.setEnabled(isEnable);
        this.setSelectedItem(shapeOutlineFillColor);
      },

      /**
       * Reflects the current applied outline color in the color indicator. This
       * is essential when current selection is same (i.e. for same shape) but
       * the applied outline color value is different.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        var selection = signalData && signalData.node;
        var shapeOutlineFillColor;

        if (selection instanceof QowtPointShape && selection.supports('ln')) {
          var outlineFill = selection.getComputedDecorations().ln.fill;
          shapeOutlineFillColor = outlineFill && outlineFill.color &&
              outlineFill.color.clr;
        }
        this.setSelectedItem(shapeOutlineFillColor);
      }
    }
  };
});
