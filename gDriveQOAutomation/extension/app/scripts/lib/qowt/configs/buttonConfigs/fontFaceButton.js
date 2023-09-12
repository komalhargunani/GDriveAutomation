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
   * @return {object} config  A button configuration.
   * <ul>
   * <li>config.type {string} The type of widget to create.
   * <li>config.label {boolean} True for a textual dropdown.
   * <li>config.action {string} The widgets requested action.
   * <li>config.opt_scrollable {boolean} True to make the button menu
   *     scrollable.
   * <li>config.subscribe {object} Set of signals with callbacks that give
   *     button behaviours.
   * </ul>
   */
  return {
    type: 'dropdown',
    label: true,
    action: 'fontFace',
    opt_scrollable: true,
    preExecuteHook: function(value) {
      return {
        formatting: {
          'font': value
        }
      };
    },
    subscribe: {
      /**
       * Update the button status as a result of a changed formatting.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about formatting.
       */
      'qowt:formattingChanged': function(signal, signalData) {
        signal = signal || '';
        if (_.has(signalData, 'formatting.font')) {
          this.setSelectedItem(signalData.formatting.font);
        }
      },

      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var textFnt;
        var element = CustomSelector.findInSelectionChain(['font']);
        if (element) {
          textFnt = element.getComputedDecorations().font;
        } else {
          var widget = WidgetFactory.create(signalData.newSelection);
          if (widget && widget.getFontFace) {
            textFnt = widget.getFontFace();
          }
        }
        this.setSelectedItem(textFnt);
      }
    }
  };
});
