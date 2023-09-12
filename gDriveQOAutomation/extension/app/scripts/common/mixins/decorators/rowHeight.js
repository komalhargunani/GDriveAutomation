define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/typeUtils'], function(
    DecoratorBase,
    MixinUtils,
    Converter,
    TypeUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['height'],

    observers: [
      'heightChanged_(model.ropr.height)'
    ],

    /**
     * @return {number} The row height amount in twips.
     */
    get height() {
      return this.model && this.model.ropr && this.model.ropr.height;
    },


    /**
     * Set the height in the model, row height amount in twips.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {number} value the row height in twips.
     */
    set height(value) {
      this.setInModel_('ropr.height', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current value of height.
     */
    heightChanged_: function(current) {
      if (current !== undefined && TypeUtils.isInteger(current)) {
        // Set the row height.
        this.style.height = Converter.twip2pt(current) + 'pt';
      } else {
        // Unset the row height.
        this.style.height = '';
      }
    },


    /**
     * @return {number|undefined} return the height "Decoration" in twips for a
     *     given computed css style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      height: function(computedStyles) {
        // If this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be rounded
        // as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output
        var computedVal;
        if (this.height) {
          computedVal = this.height;
        } else {
          if (!computedStyles.height || computedStyles.height === 'auto') {
            computedVal = 0;
          } else {
            computedVal = Converter.pt2twip(Converter.cssSize2pt(computedVal));
          }
        }
        return computedVal;
      }
    }
  });

  return api_;

});
