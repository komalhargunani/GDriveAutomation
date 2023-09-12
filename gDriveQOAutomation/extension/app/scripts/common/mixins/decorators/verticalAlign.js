define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'
], function(
  DecoratorBase,
  MixinUtils,
  Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['verticalAlign'],

    observers: [
      'verticalAlignChanged_(model.cpr.verticalAlign)'
    ],

    /**
     * @return {string} The vertical alignment.
     */
    get verticalAlign() {
      return (this.model &&
              this.model.cpr &&
              this.model.cpr.verticalAlign);
    },

    /**
     * Set the vertical alignment in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {string} value the vertical alignment.
     */
    set verticalAlign(value) {
      this.setInModel_('cpr.verticalAlign', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current value of vertical alignment.
     */
    verticalAlignChanged_: function(current) {
      if (current !== undefined) {
        // Set the vertical alignment.
        this.style.verticalAlign = current;
      } else {
        // Unset the vertical alignment.
        this.style.verticalAlign = '';
      }
    },

    /**
     * @return {string} return the vertical alignment for a given computed css
     *     style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      verticalAlign: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all
        var computed = this.verticalAlign ||
            Converter.colorString2hex(computedStyles.verticalAlign);

        if (computed === 'baseline') {
          computed = '';
        }
        return computed;
      }
    }

  });

  return api_;

});
