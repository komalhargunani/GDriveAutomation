define([
  'qowtRoot/utils/platform',
  'common/elements/ui/formatButton/formatButton'
], function(Platform /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  var italicButtonProto = {
    is: 'qowt-italic-button',
    behaviors: [
      QowtFormatButtonBehavior
    ],
    action: 'italic',
    formatCode: 'itl',
    widgetFormat: 'hasItalic',
    shortCut: prefix + 'I',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:italic";
    }
  };

  window.QowtItalicButton = Polymer(italicButtonProto);

  return {};
});
