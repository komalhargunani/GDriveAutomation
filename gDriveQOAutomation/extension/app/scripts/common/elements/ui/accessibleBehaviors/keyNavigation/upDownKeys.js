define([], function() {

  'use strict';

  window.UpDownArrowKeyBehavior = {
    keyBindings: {
      'up': 'onUpKey_',
      'down': 'onDownKey_'
    },


    onUpKey_: function(event) {
      this.focusElm_(this.focusPrevious_.bind(this), event);
    },


    onDownKey_: function(event) {
      this.focusElm_(this.focusNext_.bind(this), event);
    },


    /**
     *  Focuses an element if this is active
     * @param {Function} funcThatFocusesElm - this.focusPrevious_ or
     *                                         this.focusNext_
     * @param {Event} event
     * @private
     */
    focusElm_: function(funcThatFocusesElm, event) {
      if (this.active) {
        // Redirect to currently virtually focused element
        var canceled = this.redirectKey_(event.detail.keyboardEvent);
        if (!canceled) {
          funcThatFocusesElm();
        }
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopImmediatePropagation();
      }
    }
  };

  return {};
});
