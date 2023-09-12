define([
  'common/elements/customSelector',
  'qowtRoot/utils/i18n'
], function(
    CustomSelector,
    I18n ) {

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
    action: 'pointToggleBullet',
    shortcut: {
      'OSX': 'CMD+Shift+8',
      'DEFAULT': 'CTRL+Shift+8'
    },
    sticky: true,
    group: I18n.getMessage('keyboard_shortcut_group_paragraph_formatting'),
    preExecuteHook: function(set) {
      var bullet = {type: 'buNone'};
      if (set) {
        bullet.type = 'buChar';
        bullet.char = '•';
        bullet.bulletFont = undefined; // Use cascaded font
        bullet.autotype = undefined;
        bullet.startAt = undefined;
      }
      return {
        formatting: {
          'type': bullet.type,
          'char': bullet.char,
          'bulletFont': bullet.bulletFont,
          'autotype': bullet.autotype,
          'startAt': bullet.startAt
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
        var element = CustomSelector.findInSelectionChain(['type', 'char']);
        var isBulletedList;

        if (element) {
          isBulletedList = (element.getComputedDecorations().type === 'buChar');
        }

        this.setActive(isBulletedList);
      }
    }
  };

});
