define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/converters/converter'],
function(DecoratorBase, MixinUtils, UnitConversionUtils, Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['spcBef', 'spcAft'],

    observers: [
      'spcBefChanged_(model.ppr.spcBef)',
      'spcAftChanged_(model.ppr.spcAft)'
    ],

    get spcBef() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.spcBef);
    },

    set spcBef(value) {
      this.setInModel_('ppr.spcBef', value);
    },

    get spcAft() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.spcAft);
    },

    set spcAft(value) {
      this.setInModel_('ppr.spcAft', value);
    },

    spcBefChanged_: function(current) {
      if (current !== this.previousSpcBef_) {
        this.style.removeProperty('padding-top');
        if (this.spcBef) {
          this.style.paddingTop = this.computeSpacingValue_(this.spcBef);
        }
        this.previousSpcBef_ = current;
      }
    },

    spcAftChanged_: function(current) {
      if (current !== this.previousSpcAft_) {
        this.style.removeProperty('padding-bottom');
        if (this.spcAft) {
          this.style.paddingBottom = this.computeSpacingValue_(this.spcAft);
        }
        this.previousSpcAft_ = current;
      }
    },

    computedDecorations_: {
      // We always return computed para spacing before or
      // after in 'points' format, when it is not available explicitly.
      spcBef: function(computedStyles) {
        var spacing = this.spcBef;
        if (!spacing && computedStyles.paddingTop !== '') {
          var value = Converter.cssSize2pt(computedStyles.paddingTop);
          // The value is specified using points where 100 points equal 1 font
          // point size
          value = Math.round(value * 100);
          spacing = {format: 'points', value: value};
        }
        return spacing;
      },

      spcAft: function(computedStyles) {
        var spacing = this.spcAft;
        if (!spacing && computedStyles.paddingBottom !== '') {
          var value = Converter.cssSize2pt(computedStyles.paddingBottom);
          // The value is specified using points where 100 points equal 1 font
          // point size
          value = Math.round(value * 100);
          spacing = {format: 'points', value: value};
        }
        return spacing;
      }
    },

    onMaxParaFontSizeChanged_: {
      spcBef: function() {
        if (this.spcBef) {
          this.style.paddingTop = this.computeSpacingValue_(this.spcBef);
        }
      },
      spcAft: function() {
        if (this.spcAft) {
          this.style.paddingBottom = this.computeSpacingValue_(this.spcAft);
        }
      }
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
    computeSpacingValue_: function(spacing) {
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
            value = this.maxParaFontSize * value / 100;

            // Microsoft office renders single line spacing as 120% of font size
            // Spacing needs to be corrected so that it is 120% of font size, as
            // normal HTML renderer uses 100% of font size.
            value = value * 1.2;
            value += 'pt';
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
