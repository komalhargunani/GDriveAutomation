define([
  'qowtRoot/utils/platform',
  'common/elements/ui/justifyButtons/justifyButton/justifyButton'
], function(
    Platform
    /*base*/) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘+' : 'Ctrl+';
  var justifyCenterButtonProto = {
    is: 'qowt-justify-center-button',
    behaviors: [
      JustifyButtonBehavior
    ],

    action: 'textAlignCenter',
    alignment: 'C',
    shortCut: prefix + 'Shift+E',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:text_align_center";
    }
  };

  window.QowtJustifyCenterButton = Polymer(justifyCenterButtonProto);

  return {};
});
