define([
  'common/elements/ui/borderMenu/qowtBorderConfig',
  'qowtRoot/utils/i18n',
  'common/elements/ui/baseButton/baseButton'
], function(
    BorderConfig,
    I18n
    /*baseButton*/) {

  'use strict';

  var borderButtonProto = {
    is: 'qowt-border-button',
    behaviors: [QowtBaseButtonBehavior],
    properties: {
      borderaction: {
        type: String,
        value: undefined
      }
    },

    formatCode: 'borders',

    ready: function() {
      this.blurOnClick = false;
    },

    attached: function() {
      this.action = this.borderaction;
      this.id = 'cmd-' + this.action;
      this.setAttribute('aria-label',
          I18n.getMessage(this.action.toLowerCase() + '_aria_spoken_word'));
    },

    /**
     * @protected
     * @override
     */
    setFormattingByButtonState_: function(formatting, buttonState) {
      formatting[this.formatCode] = BorderConfig[this.action];
      if (buttonState) {
        var childNodes =
          _.get(Polymer.dom(this), 'parentNode.childNodes', [] /*default*/);
        _.forEach(childNodes, function(child) {
          // deactivate all but this.
          child.active = (child.id === this.id);
        }.bind(this));
      }
    }
  };

  window.QowtBorderButton = Polymer(borderButtonProto);

  return {};
});
