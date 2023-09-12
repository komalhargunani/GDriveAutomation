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

    supports_: ['shading'],

    observers: [
        'shadingChanged_(model.cpr.shading)'
    ],

    /**
     * @return {string} The background color.
     */
    get shading() {
      return (this.model &&
              this.model.cpr &&
              this.model.cpr.shading);
    },

    /**
     * Set the background color in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {string} value the background color.
     */
    set shading(value) {
      this.setInModel_('cpr.shading', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current value of shading.
     */
    shadingChanged_: function(current) {
      if (current && current.backgroundColor !== undefined) {
        // Set the background color.
        this.style.backgroundColor = current.backgroundColor;
      } else {
        // Unset the background color.
        this.style.backgroundColor = '';
      }
    },

    /**
     * @return {string} return the background color for a given computed css
     *     style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      shading: function(computedStyles) {
        // if this element has background color in it's model then we do not
        // need to look in to the computed style at all
        var computed = (this.shading) || { backgroundColor:
            Converter.colorString2hex(computedStyles.backgroundColor)};
        return computed;
      }
    }

  });

  return api_;

});
