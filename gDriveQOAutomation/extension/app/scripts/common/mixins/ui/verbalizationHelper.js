define([
  'qowtRoot/utils/i18n'
], function(
   I18n) {

  'use strict';

  return {

    /**
     * This is a map representing the labels against the keycodes for the keys
     * used in shortcut. The labels will be used to get the internationalized
     * message to be read out.
     */
    SHORTCUT_KEY_LABELS_: {
      'CTRL': 'control_key',
      'CMD': 'command_key',
      'ALT': (window.__polymer_core_platform_info.isOsx) ? 'option_key':
          'alt_key',
      'SHIFT': 'shift_key'
    },

    /**
    * This is a map representing the labels against the unicodes for the keys
    * used in shortcut.
    */
    UNICODE_KEY_LABELS_: {
      '#38': '\u2191',
      '#39': '\u2192',
      '#40': '\u2193',
      '#191': '\u002F'
    },

    /**
     * Prepares button text to speak. This text consists of button's
     * aria-label + shortcut key
     *
     * @param {DOM Node} item - focused button
     * @return {string} text to speak
     * @private
     */
    prepareFocusedBtnText_: function(item) {
      var ariaLabel = item.getAttribute('aria-label');
      var shortCutLabel = this.getShortCutLabel_(item);
      return shortCutLabel ? ariaLabel + ' ' + shortCutLabel :
          ariaLabel;
    },


    /**
     * Gets the shortcut label to be spoken if the item has a shortcut.
     * The shortcut for toolbar buttons is set as shortCut property.
     * @param item - Current item
     * @return {string} - Label for the shortcut to be read out
     * @private
     */
    getShortCutLabel_: function(item) {
      var shortCutLabel = item.shortCut;
      if (shortCutLabel) {
        var revisedLabel = this.transformShortcutLabel_(shortCutLabel);
        shortCutLabel = I18n.getMessage('shortcut', [revisedLabel]);
      }
      return shortCutLabel ? shortCutLabel : '';
    },

    /**
     * Gets the key label for the key.
     * @param {string} key - Key for which the key label needs to be find out.
     * @return {string} - transformed key label.
     * @private
     */
    getKeyLabel: function(key) {
      return this.UNICODE_KEY_LABELS_[key] ? this.UNICODE_KEY_LABELS_[key] :
          key;
    },

    /**
     * Transforms the shortcut label to sensible text that can be read out to
     * user. eg replaces 'Cmd' with 'Command'
     * @param {string} keycombo - String representing the shortcut
     * eg. 'Cmd+Shift+R'
     * @return {string} - Transformed string eg. 'Command+Shift+R'.
     * @private
     */
    transformShortcutLabel_: function(keycombo) {
      var revisedLabel = '';
      if (keycombo) {
        var keys = keycombo.split('+');
        keys.forEach(function(key) {
          var label;
          var keyLabel = this.SHORTCUT_KEY_LABELS_[key.toUpperCase()];
          label = keyLabel ? I18n.getMessage(keyLabel) : this.getKeyLabel(key);
          revisedLabel += label + '+';
        }, this);
      }
      return revisedLabel.slice(0, -1);
    }
  };
});
