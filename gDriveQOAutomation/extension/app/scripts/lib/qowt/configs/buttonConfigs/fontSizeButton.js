// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'font size' button for generic use.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'common/elements/customSelector',
  'qowtRoot/widgets/factory',
  'third_party/lo-dash/lo-dash.min'],
  function(CustomSelector, WidgetFactory) {

  'use strict';

      /**
       * Returns a button configuration.
       * Here 'this' is bound to button widget generated from this config.
       *
       * @param returns {object} A button configuration.
       * @param returns {string} config.type The type of widget to create.
       * @param returns {boolean} config.label True for a textual dropdown.
       * @param returns {string} config.action The widgets requested action.
       * @param returns {boolean} config.opt_scrollable True to make the
       *                          button menu scrollable.
       * @param returns {object} config.items The non-localisable strings
       *                          to use for the button menu items.
       * @param returns {object} config.subscribe Set of signals with
       *                          callbacks that give button behaviours.
       */
      return {
        type: 'dropdown',
        label: true,
        action: 'fontSize',
        opt_scrollable: true,
        preExecuteHook: function(value) {
          return {
            formatting: {
              'siz': value
            }
          };
        },
        items: ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48',
                '60', '72', '96'],
        subscribe: {
          /**
           * Update the button status as a result of a changed selection.
           * @param {string} signal The signal name.
           * @param {string} signalData Contextual information about selection.
           */
          'qowt:selectionChanged': function(signal, signalData) {
            signal = signal || '';
            var textSiz;
            var element = CustomSelector.findInSelectionChain(['siz']);
            if (element) {
              textSiz = element.getComputedDecorations().siz;
            } else {
              var widget = WidgetFactory.create(signalData.newSelection);
              if (widget && widget.getFontSizePoints) {
                textSiz = widget.getFontSizePoints();
              }
            }
            this.setSelectedItem((textSiz === undefined) ?
                undefined : Math.round(textSiz));
          },

          /**
           * Update the button status as a result of a changed formatting.
           * @param {string} signal The signal name.
           * @param {string} signalData Contextual information about formatting.
           */
          'qowt:formattingChanged': function(signal, signalData) {
            signal = signal || '';
            if (_.has(signalData, 'formatting.siz')) {
              var textSiz = signalData.formatting.siz;
              this.setSelectedItem((textSiz === undefined) ?
                  undefined : Math.round(textSiz));
            }
          }
        }
      };
});
