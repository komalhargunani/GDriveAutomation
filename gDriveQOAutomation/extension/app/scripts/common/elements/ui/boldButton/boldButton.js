define([
    'qowtRoot/utils/platform',
    'common/elements/ui/formatButton/formatButton'

], function(Platform /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  var boldButtonProto = {
    is: 'qowt-bold-button',
    behaviors: [
      QowtFormatButtonBehavior
    ],
    action: 'bold',
    formatCode: 'bld',
    widgetFormat: 'hasBold',
    shortCut: prefix + 'B',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:bold";
    }
  };
  window.QowtBoldButton = Polymer(boldButtonProto);

  return {};
});
