define([
  'qowtRoot/utils/platform',
  'common/elements/ui/justifyButtons/justifyButton/justifyButton'
], function(
    Platform
    /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘+' : 'Ctrl+';
  var justifyRightButtonProto = {
    is: 'qowt-justify-right-button',
    behaviors: [
      JustifyButtonBehavior
    ],

    action: 'textAlignRight',
    alignment: 'R',
    shortCut: prefix + 'Shift+R',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:text_align_right";
    }
  };

  window.QowtJustifyRightButton = Polymer(justifyRightButtonProto);

  return {};
});
