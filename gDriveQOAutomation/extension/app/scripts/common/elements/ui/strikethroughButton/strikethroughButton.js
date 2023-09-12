define([
  'qowtRoot/utils/platform',
  'common/elements/ui/formatButton/formatButton'], function(Platform /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? 'Option+Shift+' : 'Alt+Shift+';
  var strikethroughButtonProto = {
    is: 'qowt-strikethrough-button',
    behaviors: [
      QowtFormatButtonBehavior
    ],

    action: 'strikethrough',
    formatCode: 'strikethrough',
    widgetFormat: 'hasStrikethrough',
    shortCut: prefix + '5',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:strikethrough";
    }
  };

  window.QowtStrikethroughButton = Polymer(strikethroughButtonProto);

  return {};
});
