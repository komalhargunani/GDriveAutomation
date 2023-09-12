define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['rsp'],

    observers: [
      'cellRowSpanChanged_(model.cpr.rsp)'
    ],

    /**
     * @return {number|undefined} The row span of the cell, that is number of
     *     rows this cell spans.
     */
    get rsp() {
      return this.model && this.model.cpr && this.model.cpr.rsp;
    },


    /**
     * Set the row span of the cell in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {number} value the cell row span.
     */
    set rsp(value) {
      this.setInModel_('cpr.rsp', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current the current value of row span of cell.
     */
    cellRowSpanChanged_: function(current) {
      if (current !== undefined) {
        // Set the cell row span.
        this.rowSpan = current;
      } else {
        // Unset the cell row span.
        this.rowSpan = 1;
      }
    },


    /**
     * @return {number|undefined} return the cell row span.
     * NOTE: Does not use the computedStyles object, as the cell row span are
     * attributes of the cell element.
     */
    computedDecorations_: {
      rsp: function(/* computedStyles */) {
        return this.rsp;
      }
    }
  });

  return api_;

});
