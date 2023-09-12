define([], function() {

  'use strict';

  var buttonGroupProto = {
    listeners: {
      'change': 'onChange_'
    },

    /**
     * Returns an array of selectable items.
     *
     * @property items
     * @type Array
     */
    get items() {
      var nodes = Polymer.dom(this).querySelectorAll(this.selectable || '*');
      return nodes;
    },

    getGroupMembers: function() {
      return this.items;
    },

    onChange_: function(event) {
      if (event.target.active) {
        this.items.forEach(function(button) {
          if (button !== event.target) {
            button.active = false;
          }
        }.bind(this));
      }
    }
  };

  window.QowtButtonGroupBehavior = buttonGroupProto;

  return {};
});
