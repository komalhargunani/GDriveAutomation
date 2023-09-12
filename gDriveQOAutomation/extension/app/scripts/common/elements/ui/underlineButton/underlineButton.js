define([
  'qowtRoot/utils/platform',
  'common/elements/ui/formatButton/formatButton'], function(Platform /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  var underlineButtonProto = {
    is: 'qowt-underline-button',
    behaviors: [
      QowtFormatButtonBehavior
    ],
    action: 'underline',
    formatCode: 'udl',
    widgetFormat: 'hasUnderline',
    shortCut: prefix + 'U',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:underline";
    }
  };

  window.QowtUnderlineButton = Polymer(underlineButtonProto);

  return {};
});
