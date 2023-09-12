define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/dcp/utils/unitConversionUtils'], function(
  MixinUtils,
  DecoratorBase,
  Converter,
  UnitConversionUtils) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['leftMargin'],

    observers: [
      'leftMarginChanged_(model.ppr.leftMargin)'
    ],

    /** @return {number} The indentation amount for the paragraph in EMU */
    get leftMargin() {
      return (this.model && this.model.ppr && this.model.ppr.leftMargin);
    },

    /**
     * Set the leftMargin in the model.
     * @param {number} value The leftMargin (in EMU units) for the paragraph.
     */
    set leftMargin(value) {
      this.setInModel_('ppr.leftMargin', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits).
     * @param {number} current The new value
     */
    leftMarginChanged_: function(current) {
      if (current !== undefined) {
        // Margins are rendered in points since they are not shrinkable by the
        // text box.
        // TODO(elqursh): Port convertEmuToPoint to the standard Converter
        // module (crbug/432586).
        var leftMargin = UnitConversionUtils.convertEmuToPoint(
            Number(current).toFixed(2));
        this.style.marginLeft = leftMargin + 'pt';
      } else {
        this.style.marginLeft = '';
      }
    },

    /**
     * @return {!{leftMargin: function(CSSStyleDeclaration): number}} The
     *     leftMargin "Decoration" (in EMU) for a given computed css style.
     *     Called by the DecoratorBase module.
     */
    computedDecorations_: {
      leftMargin: function(computedStyles) {
        // If this element has leftMargin in it's model then we do not need to
        // look in to the computed style.
        var computedVal = this.leftMargin;
        if (isNaN(computedVal) && computedStyles) {
          computedVal = Converter.cssSize2pt(computedStyles.marginLeft);
          // Convert from point to EMU.
          computedVal = UnitConversionUtils.convertPointToEmu(computedVal);
        }
        return computedVal;
      }
    }
  });

  return api_;

});
