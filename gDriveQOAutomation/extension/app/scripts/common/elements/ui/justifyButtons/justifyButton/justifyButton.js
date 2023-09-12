// TODO(davidshimel) Perhaps make justify buttons into parameterized instances
// of justifyButton (instead of separate classes) once the toolbar is fully
// declarative.

define([
  'qowtRoot/utils/platform',
  'common/elements/ui/baseButton/baseButton'
], function(
    Platform
    /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘+' : 'Ctrl+';
  var JustifyButtonBehaviorImpl = {
    alignment: '',
    formatCode: 'jus',
    shortCut: prefix + 'Shift+J',

    /**
     * @protected
     * @override
     */
    setFormattingByButtonState_: function(formatting, buttonState) {
      if (buttonState) {
        formatting[this.formatCode] = this.alignment;
      }
    },

    /** @override */
    _tapHandler: function(/* event */) {
      // Justify buttons are part of a group. Only handle clicks when we are
      // about to be active.
      if (!this.active) {
        window.QowtBaseButtonBehaviorImpl._tapHandler.apply(this, arguments);
      }
    }
  };

  window.JustifyButtonBehavior = [
    QowtBaseButtonBehavior,
    JustifyButtonBehaviorImpl
  ];

  return {};
});
