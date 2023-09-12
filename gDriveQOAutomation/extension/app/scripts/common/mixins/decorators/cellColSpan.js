define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['csp'],

    observers: [
      'cellColSpanChanged_(model.cpr.csp)'
    ],

    /**
     * @return {number|undefined} The col span of the cell, that is number of
     *     columns this cell spans.
     */
    get csp() {
      return this.model && this.model.cpr && this.model.cpr.csp;
    },


    /**
     * Set the col span of the cell in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {number} value the cell col span.
     */
    set csp(value) {
      this.setInModel_('cpr.csp', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current the current value of col span of cell.
     */
    cellColSpanChanged_: function(current) {
      if (current !== undefined) {
        // Set the cell col span.
        this.colSpan = current;
      } else {
        // Unset the cell col span.
        this.colSpan = 1;
      }
    },


    /**
     * @return {number|undefined} return the cell column span.
     * NOTE: Does not use the computedStyles object, as the cell colSpan are
     * attributes of the cell element.
     */
    computedDecorations_: {
      csp: function(/* computedStyles */) {
        return this.csp;
      }
    }
  });

  return api_;

});
