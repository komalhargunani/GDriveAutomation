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

    supports_: ['rightMargin'],

    observers: [
      'rightMarginChanged_(model.ppr.rightMargin)'
    ],

    /** @return {number} The indentation amount for the paragraph in EMU */
    get rightMargin() {
      return (this.model && this.model.ppr && this.model.ppr.rightMargin);
    },

    /**
     * Set the rightMargin in the model.
     * @param {number} value The rightMargin (in EMU units) for the paragraph.
     */
    set rightMargin(value) {
      this.setInModel_('ppr.rightMargin', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits).
     * @param {number} current The new value
     */
    rightMarginChanged_: function(current) {
      if (current !== undefined) {
        // Margins are rendered in points since they are not shrinkable by the
        // text box.
        // TODO(elqursh): Port convertEmuToPoint to the standard Converter
        // module (crbug/432586).
        var rightMargin = UnitConversionUtils.convertEmuToPoint(
            Number(current).toFixed(2));
        this.style.marginRight = rightMargin + 'pt';
      } else {
        this.style.marginRight = '';
      }
    },

    /**
     * @return {!{rightMargin: function(CSSStyleDeclaration): number}} The
     *     rightMargin "Decoration" (in EMU) for a given computed css style.
     *     Called by the DecoratorBase module.
     */
    computedDecorations_: {
      rightMargin: function(computedStyles) {
        // If this element has rightMargin in it's model then we do not need to
        // look in to the computed style.
        var computedVal = this.rightMargin;
        if (isNaN(computedVal) && computedStyles) {
          computedVal = Converter.cssSize2pt(computedStyles.marginRight);
          // Convert from point to EMU.
          computedVal = UnitConversionUtils.convertPointToEmu(computedVal);
        }
        return computedVal;
      }
    }
  });

  return api_;

});
