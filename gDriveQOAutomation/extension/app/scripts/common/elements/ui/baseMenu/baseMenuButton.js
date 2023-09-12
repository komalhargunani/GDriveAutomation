define([], function() {

  'use strict';

  window.QowtBaseMenuButtonBehaviorImpl = {
    action: '',
    formatCode: '',

    properties: {
      icon: String,
      src: String
    },

    ready: function() {
      this.icon = 'qo-chrome-icons:' + this.iconName;
      this.toggles = true;
    }
  };

  // Behaviors have to be defined on the global object
  window.QowtBaseMenuButtonBehavior = [
    Polymer.IronButtonState,
    Polymer.IronControlState,
    window.QowtBaseMenuButtonBehaviorImpl
  ];

  return {};
});
