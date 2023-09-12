define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/converters/converter'],
function(DecoratorBase, MixinUtils, UnitConversionUtils, Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['lnSpc'],

    observers: [
      'lnSpcChanged_(model.ppr.lnSpc)'
    ],

    get lnSpc() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.lnSpc);
    },

    set lnSpc(value) {
      this.setInModel_('ppr.lnSpc', value);
    },

    lnSpcChanged_: function() {
      this.applyLineSpacing_();
    },

    attached: function() {
      this.applyLineSpacing_();
    },

    applyLineSpacing_: function() {
      this.style.removeProperty('line-height');
      if (this.lnSpc) {
        this.style.lineHeight = this.computeLineSpacingValue_(this.lnSpc);
      }
    },

    computedDecorations_: {
      lnSpc: function() {
        var lineSpacing = this.lnSpc;
        if (!lineSpacing) {
          var run = this.querySelector('span[is="qowt-point-run"]');
          var computedStyles = run && window.getComputedStyle(run);
          var lineHeight = computedStyles && computedStyles.lineHeight;
          if (lineHeight && lineHeight !== 'normal') {
            var value = Converter.cssSize2pt(lineHeight);
            value = Math.round(value * 100);
            lineSpacing = {format: 'points', value: value};
          }
        }
        return lineSpacing;
      }
    },

    /**
     * Return the lnSpcReduction attribute of the parent element. If it is
     * undefined, return 0 otherwise return the Number value.
     * @return {Number} The lnSpcReduction applied to the parentElement
     */
    getLnSpcReduction_: function() {
      var lnSpcReduction = this.parentElement &&
          this.parentElement.getAttribute('lnSpcReduction');
      lnSpcReduction = lnSpcReduction ? parseFloat(lnSpcReduction) : 0;
      return lnSpcReduction;
    },

    /**
     * Compute spacing value for line spacing, spacing before,
     * and spacing after
     * @param {Object} spacing JSON structure for text spacing from DCP is
     * {
     *   "format": "percentage" / "points",
     *   "value": <text spacing value>
     * }
     * @return {string} The computed spacing value
     */
    computeLineSpacingValue_: function(spacing) {
      var value;
      if (spacing && spacing.format && spacing.value) {
        var format = spacing.format;
        value = spacing.value;

        switch (format) {
          case 'percentage':
            // Value can be an integer or suffixed by % sign.
            // Get a value in percent only
            value = UnitConversionUtils.convertSTPercentageToCSSPercent(value);
            value = parseFloat(value);

            // Microsoft office renders single line spacing as 120% of font size
            // Spacing needs to be corrected so that it is 120% of font size, as
            // normal HTML renderer uses 100% of font size.
            value = value * 1.2;

            var lnSpcReduction = this.getLnSpcReduction_();
            value = (value - (value * (lnSpcReduction / 100)));
            value /= 100;
            break;

          case 'points':
            // Model value is in points * 100.
            value = (value / 100);
            value += 'pt';
            break;

          default:
            throw new Error('Invalid paragraph spacing format');
        }
      }
      return value;
    }

  });

  return api_;
});
