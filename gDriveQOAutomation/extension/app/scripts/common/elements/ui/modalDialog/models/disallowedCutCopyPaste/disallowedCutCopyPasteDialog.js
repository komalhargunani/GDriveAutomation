define([
  'qowtRoot/utils/platform',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/ui/modalDialog/modalDialog'
], function(
    Platform,
    MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-disallowed-cut-copy-paste-dialog',
    extends: 'dialog',
    buttonKeyComboMap: {
      'cmd_cut': {'keycomboOsx': 'CMD+X', 'keycombo': 'Ctrl+X'},
      'cmd_copy': {'keycomboOsx': 'CMD+C', 'keycombo': 'Ctrl+C'},
      'cmd_paste': {'keycomboOsx': 'CMD+V', 'keycombo': 'Ctrl+V'},
    },

    behaviors: [
      QowtModalDialogBehavior
    ],

    attached: function() {
      this.setAttribute('aria-label',
        this.getMessage_('disallowed_cut_copy_paste_title'));
      this.$.closeButton.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_close_button'));
      this.$.affirmative.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_close_button'));
    },

    detached: function() {

    },

    focus: function() {
      HTMLElement.prototype.focus.apply(this);
      this.speakLabelForElement(this, true);
    },

    affirmativeFocused_: function() {
      this.speakLabelForElement(this.$.affirmative, true);
    },

    closeButtonFocused_: function() {
      this.speakLabelForElement(this.$.closeButton, true);
    },

    /**
     * Gets the platform specific shortcut key combination
     * @param {string} label - string representing button.
     * @return {string} - platform specific shortcut key combination
     * @private
     */
    getKeyCombo_: function(label) {
      return Platform.isOsx ? this.buttonKeyComboMap[label].keycomboOsx :
          this.buttonKeyComboMap[label].keycombo;
    },
  };

  window.QowtDisallowedCutCopyPasteDialog = Polymer(
    MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});