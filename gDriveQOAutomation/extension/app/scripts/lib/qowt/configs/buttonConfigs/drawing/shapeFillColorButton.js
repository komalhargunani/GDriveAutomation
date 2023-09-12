// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'Fill color' button for Point.
 * Returns a button configuration.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/widgets/factory',
  'qowtRoot/configs/buttonConfigs/paletteColors'
], function(
    WidgetFactory,
    PaletteColors) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @return {object} A button configuration.
   * @return {string} config.type The type of widget to create.
   * @return {string} config.action The widgets requested action.
   * @return {object} config.items An array containing all the
   *                           menuitem configurations.
   * @return {object} config.subscribe Set of signals with
   *                         callbacks that give button behaviours.
   */
  return {
    type: 'colorDropdown',
    action: 'modifyShapeFillColor',
    formattingProp: 'fillClr',
    items: [
      {
        type: 'menuItem',
        action: 'modifyShapeFillColor',
        stringId: 'menu_item_color_transparent',
        iconClass: 'noColor',
        context: {
          formatting: {
            fillClr: 'NONE'
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
        signal = signal;
        signalData = signalData || {};
        var selection = signalData.newSelection;
        var shapeFill, shapeFillColor;
        var enable = false;
        if (selection && selection.scope && selection.scope.id) {
          // This check is added since we don't support fill for graph and
          // tables in rendering and editing for now.
          if (selection.scope.getAttribute('qowt-divtype') === 'grFrm') {
            enable = false;
          } else {
            var widget = WidgetFactory.create({fromId: selection.scope.id});
            // Play it safe and turn the button off if we can't get a widget
            // or the widget doesn't support our query.

            if (widget && widget.getFill) {
              shapeFill = widget.getFill();
              enable = true;
              if (shapeFill && shapeFill.type === 'solidFill') {
                shapeFillColor = shapeFill.color && shapeFill.color.clr;
              }
            }
          }
        }
        this.setEnabled(enable);
        this.setSelectedItem(shapeFillColor);
      }
    }
  };
});
