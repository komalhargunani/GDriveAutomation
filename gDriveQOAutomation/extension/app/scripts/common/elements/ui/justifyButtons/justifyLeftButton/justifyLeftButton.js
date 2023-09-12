define([
  'qowtRoot/utils/platform',
  'common/elements/ui/justifyButtons/justifyButton/justifyButton'
], function(
    Platform
    /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘+' : 'Ctrl+';
  var justifyLeftButtonProto = {
    is: 'qowt-justify-left-button',
    behaviors: [
      JustifyButtonBehavior
    ],

    action: 'textAlignLeft',
    alignment: 'L',
    shortCut: prefix + 'Shift+L',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:text_align_left";
    }
  };

  window.QowtJustifyLeftButton = Polymer(justifyLeftButtonProto);

  return {};
});
