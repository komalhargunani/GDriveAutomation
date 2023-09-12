define([
  'common/elements/customSelector',
  'qowtRoot/utils/i18n'
], function(
    CustomSelector,
    I18n) {

  'use strict';

  /**
   * Return a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   * @return config {object} A button configuration.
   *         config.type {string} The type of widget to create.
   *         config.action {string} The widgets requested action.
   *         config.sticky {boolean} True for a bi-state button,
   *                False for a plain button that doesn't latch.
   *         config.subscribe {object} Optional set of signals with callbacks
   *                that give button behaviours.
   */
  return {
    type: 'button',
    action: 'pointToggleNumber',
    shortcut: {
      'OSX': 'CMD+Shift+7',
      'DEFAULT': 'CTRL+Shift+7'
    },
    sticky: true,
    group: I18n.getMessage('keyboard_shortcut_group_paragraph_formatting'),
    preExecuteHook: function(set) {
      var bullet = {
        type: 'buNone'
      };
      if (set) {
        bullet.type = 'buAuto';
        // TODO(wasim.pathan) replace key indices e.g.21 for autotype with
        // readable names like 'arabicPeriod'. crbug/443194
        bullet.autotype = 21;
        bullet.startAt = 1;
        bullet.char = undefined;
      }
      return {
        formatting: {
          'type': bullet.type,
          'autotype': bullet.autotype,
          'startAt': bullet.startAt,
          'char': bullet.char
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
        // if there is no element in the selection chain that
        // supports our action, we will disable this button
        var element = CustomSelector.findInSelectionChain(['type', 'autotype']);
        var isNumberedList;

        if (element) {
          isNumberedList = (element.getComputedDecorations().type === 'buAuto');
        }

        this.setActive(isNumberedList);
      }
    }
  };

});
