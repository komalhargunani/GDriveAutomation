define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/converters/converter'], function(
  MixinUtils,
  DecoratorBase,
  ColorUtility,
  Converter) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['fill'],

    observers: [
      'fillChanged_(model.rpr.fill)'
    ],

    /** @return {object} The fill (color) of the text. */
    get fill() {
      return (this.model && this.model.rpr && this.model.rpr.fill);
    },

    /**
     * Set the fill in the model.
     * @param {object} value The fill (color) of the text.
     */
    set fill(value) {
      this.setInModel_('rpr.fill', value);
    },

    /**
     * Data observer for when the model changes.
     * @param {number} current The new value
     */
    fillChanged_: function(current) {
      if (current !== undefined) {
        this.style.color = this.fillColor_(current);
      } else {
        this.style.color = '';
      }
    },

    /**
     * Computes the CSS color given a fill object.
     * @param {object} fill object (Corresponding to fill DCP schema).
     * @returns {string} CSS color.
     * @private
     */
    fillColor_: function(fill) {
      var cssColor, color;
      switch (fill.type) {
        case 'noFill':
          cssColor = '';
          break;
        case 'gradientFill':
          // Gradient fill is not supported in text. Instead use first color in
          // gradient.
          color = fill.gsLst && fill.gsLst[0] && fill.gsLst[0].color;
          // Schema allows for gradient not to specify color stops which seems
          // to imply no gradient, falling back to black.
          cssColor = color ? ColorUtility.getColor(color) : '#000000';
          break;
        case 'solidFill':
          color = fill.color;
          cssColor = color ? ColorUtility.getColor(color) : '#000000';
          break;
        case 'blipFill':
        case 'patternFill':
        case 'grpFill':
          // Not supported, fall back to black
          cssColor = '#000000';
          break;
        default:
          // Invalid fill type
          throw new Error('Invalid fill type provided');
      }
      return cssColor;
    },

    /**
     * @return {!{fill: function(CSSStyleDeclaration): object}} The fill
     *     setting for a given element. Here we always compute the fill as a
     *     solid fill with a SRGB color. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      fill: function(computedStyles) {
        // Computed colors are always represented as hex values. Therefore
        // we always return a solid fill object
        var hexColor = Converter.colorString2hex(computedStyles.color);
        var computedFill = {
          type: 'solidFill',
          color: {
            type: 'srgbClr',
            clr: hexColor
          }
        };
        return computedFill;
      }
    }
  });

  return api_;
});
