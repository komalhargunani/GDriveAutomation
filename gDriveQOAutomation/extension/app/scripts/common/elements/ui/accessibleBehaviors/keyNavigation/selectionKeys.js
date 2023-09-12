define([], function() {

  'use strict';

  window.SelectionKeyBehavior = {
    keyBindings: {
      'up': 'onSelectionKey_',
      'down': 'onSelectionKey_',
      'enter': 'onSelectionKey_'
    },

    onSelectionKey_: function(event) {
      // Redirect to currently virtually focused element
      var canceled = this.redirectKey_(event.detail.keyboardEvent);
      if (!canceled && this.focusedItem) {
        _.isFunction(this.toggleFocusedItem_) &&
            this.toggleFocusedItem_(this.getCustomKeyEvent(event));
      }
      event.detail.keyboardEvent.preventDefault();
      event.detail.keyboardEvent.stopImmediatePropagation();
    }
  };

  return {};
});
