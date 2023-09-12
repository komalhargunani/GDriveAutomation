define([
    'common/elements/ui/justifyButtons/justifyButton/justifyButton'],
    function(/* base */) {

  'use strict';

  var justifyFullButtonProto = {
    is: 'qowt-justify-full-button',
    behaviors: [
      JustifyButtonBehavior
    ],

    action: 'textAlignJustify',
    alignment: 'J',

    /** @private */
    ready: function() {
      this.icon = "qo-chrome-icons:text_align_justified";
    }
  };

  window.QowtJustifyFullButton = Polymer(justifyFullButtonProto);

  return {};
});
