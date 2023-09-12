define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/bulletDecoratorBase',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/dcp/utils/unitConversionUtils'], function(
  MixinUtils,
  DecoratorBase,
  BulletDecoratorBase,
  Converter,
  UnitConversionUtils) {

  "use strict";

  /**
   * API for indentation decorator. In Presentation OOXML the indent
   * parameter handles both first line indentation and hanging indentation. The
   * sign of the parameter dictates the kind of indentation. Positive meaning
   * first line indentation, and negative meaning a hanging indentation.
   */
  var api_ = MixinUtils.mergeMixin(DecoratorBase, BulletDecoratorBase, {

    supports_: ['indent'],

    observers: [
      'indentChanged_(model.ppr.indent)'
    ],

    /** @return {number} The indentation amount for the paragraph in EMU */
    get indent() {
      return (this.model && this.model.ppr && this.model.ppr.indent);
    },

    /**
     * Set the indent in the model.
     * @param {number} value The indent (in EMU units) for the paragraph.
     */
    set indent(value) {
      this.setInModel_('ppr.indent', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits).
     * @param {number} current The new value
     */
    indentChanged_: function(current) {
      var beforeRule = this.getBulletStyle() || {};
      if (current !== undefined) {
        // Indentation is rendered in points since it is not shrinkable by the
        // text box.
        // TODO(elqursh): Port convertEmuToPoint to the standard Converter
        // module (crbug/432586).
        var indent = UnitConversionUtils.convertEmuToPoint(
            Number(current).toFixed(2));
        this.style.textIndent = indent + 'pt';

        beforeRule['min-width'] = Math.abs(indent) + 'pt !important';

        // Bullets do not affect text indentation in the case of first line
        // indent (+ve indent). Undo the shift caused by the bullet through
        // a -ve margin left.
        if (indent > 0) {
          beforeRule['margin-left'] = -indent + 'pt !important';
        } else {
          beforeRule['margin-left'] = '0pt !important';
        }
      } else {
        this.style.removeProperty('text-indent');
        delete beforeRule['min-width'];
        delete beforeRule['margin-left'];
      }
      this.setBulletStyle(beforeRule);
    },

    /**
     * @return {!{indent: function(CSSStyleDeclaration): number}} The indent
     *     "Decoration" (in EMU) for a given computed css style. Called by the
     *     DecoratorBase module.
     */
    computedDecorations_: {
      indent: function(computedStyles) {
        // If this element has indent in it's model then we do not need to look
        // in to the computed style.
        var computedVal = this.indent;
        if (isNaN(computedVal) && computedStyles) {
          computedVal = Converter.cssSize2pt(computedStyles.textIndent);
          // Convert from point to EMU.
          computedVal = UnitConversionUtils.convertPointToEmu(computedVal);
        }
        return computedVal;
      }
    }
  });

  return api_;

});
