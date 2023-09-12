define([], function() {
  'use strict';

  window.GridNavigationBehavior = {
    properties: {
      noOfCols: Number
    },


    keyBindings: {
      'left': 'onLeftKey_',
      'right': 'onRightKey_',
      'up': 'onUpKey_',
      'down': 'onDownKey_'
    },


    /**
     * @return {Number} - No of columns in grid.
     */
    get noOfCols() {
      function areAllOfEqualDimensions(items) {
        var widthOfFirstItem = items[0].offsetWidth;
        return _.every(items, function(item) {
          return item.offsetWidth === widthOfFirstItem;
        });
      }

      var noOfCols = 0;
      if (areAllOfEqualDimensions(this.items)) {
        var containerWidth =
            parseFloat(window.getComputedStyle(this.$.collapse).width);
        noOfCols = parseInt(containerWidth / this.items[0].offsetWidth);
      } else {
        // TODO(umesh.kadam): implement this when appropriate
      }
      return noOfCols;
    },


    /**
     * Focuses the previous element in the row
     * @param {Event} event - mouse event
     * @private
     */
    onLeftKey_: function(event) {
      this.focusElm_(this.focusPrevious_.bind(this), event);
    },


    /**
     * Focuses the next element in the row
     * @param {Event} event - mouse event
     * @private
     */
    onRightKey_: function(event) {
      this.focusElm_(this.focusNext_.bind(this), event);
    },


    /**
     * Focuses the previous element in the column. If the currently focused
     * element is the first element in the column then this function focuses the
     * last element in the column
     * @param {Event} event - mouse event
     * @private
     */
    onUpKey_: function(event) {
      this.focusElm_(this.focusPreviousItemInCol_.bind(this), event);
    },


    /**
     * Focuses the next element in the column. If the currently focused element
     * is the last element in the column then this function focuses the first
     * element in the column
     * @param {Event} event
     * @private
     */
    onDownKey_: function(event) {
      this.focusElm_(this.focusNextItemInCol_.bind(this), event);
    },


    /**
     * Focuses an element
     * @param {Function} funcThatFocusesElm - function to be called to focus an
     *                                        appropriate element.
     * @param {Event} event
     * @private
     */
    focusElm_: function(funcThatFocusesElm, event) {
      var isOkay = _.isFunction(this.isOkayToNavigate_) ?
          this.isOkayToNavigate_() : true;
      if (isOkay) {
        funcThatFocusesElm();
        event.detail.keyboardEvent.preventDefault();
        event.detail.keyboardEvent.stopImmediatePropagation();
      }
    }
  };

  return {};
});
