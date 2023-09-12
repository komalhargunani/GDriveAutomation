define([], function() {

  'use strict';

  window.LeftRightArrowKeyBehavior = {
    keyBindings: {
      'left': 'onLeftKey_',
      'right': 'onRightKey_'
    },

    onLeftKey_: function(event) {
      this.focusElm_(this.focusPrevious_.bind(this), event);
    },

    onRightKey_: function(event) {
      this.focusElm_(this.focusNext_.bind(this), event);
    },


    /**
     * Focuses an element
     * @param {Function} funcThatFocusesElm - this.focusPrevious_ or
     *                                         this.focusNext_
     * @param {Event} event
     * @private
     */
    focusElm_: function(funcThatFocusesElm, event) {
      // Redirect to currently virtually focused element
      var canceled = this.redirectKey_(event.detail.keyboardEvent);
      if (!canceled) {
        funcThatFocusesElm();
        // some elements might want to set selection to the focus. If they
        // wish so then they should do it in the function this.setSelected_
        if (_.isFunction(this.setSelected_)) {
          this.setSelected_();
        }
      }
      event.detail.keyboardEvent.preventDefault();
      event.detail.keyboardEvent.stopImmediatePropagation();
    }
  };

  return {};
});
