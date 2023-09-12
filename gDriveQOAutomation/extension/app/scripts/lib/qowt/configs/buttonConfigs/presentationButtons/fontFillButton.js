define([
  'common/elements/customSelector',
  'qowtRoot/configs/buttonConfigs/paletteColors'
], function(
  CustomSelector,
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
   *                         menuitem configurations.
   * @param returns {object} config.subscribe Set of signals with
   *                         callbacks that give button behaviours.
   */
  return {
    type: 'colorDropdown',
    action: 'fillColor',
    formattingProp: 'fill',
    contentType: 'document',
    items: PaletteColors,
    transformFunction: function(val) {
      return {
            type: 'solidFill',
            color: {
              type: 'srgbClr',
              clr: val
            }
          };
    },
    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal /*, signalData */) {
        signal = signal || '';
        var fill;
        var element = CustomSelector.findInSelectionChain(['fill']);
        if (element) {
          fill = element.getComputedDecorations().fill;
          var color = fill && fill.color && fill.color.clr;
          if (color) {
            this.setSelectedItem(color);
          }
        }
      }
    }
  };
});
