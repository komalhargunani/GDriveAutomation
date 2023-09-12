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

    supports_: ['indent'],

    observers: [
      'indentChanged_(model.tableProperties.indent)'
    ],

    /**
     * @return {Number} The indentation amount in twips.
     */
    get indent() {
      return (this.model &&
              this.model.tableProperties &&
              this.model.tableProperties.indent);
    },

    /**
     * Set the indent in the model, indentation amount in twips.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {number} value the indentation in twips.
     */
    set indent(value) {
      this.setInModel_('tableProperties.indent', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {number} current value of indent.
     */
    indentChanged_: function(current) {
      if (this.previousIndent_ !== current) {
        if (current !== undefined && TypeUtils.isInteger(current)) {
          // Setting the indent.
          if (this.model.tableProperties && this.model.tableProperties.align &&
              this.model.tableProperties.align !== 'left') {
            // Note that this code assumes LTR table. In word if table has
            // alignment property, and it is not left aligned, then the indent
            // property is ignored. We need to change this logic when we support
            // RTL tables.
            return;
          }
          // Note: that this code assumes LTR table.
          // If table is left aligned, then the indent property is set.
          // We need to change this logic when we support RTL tables.
          this.style.marginLeft = Converter.twip2pt(current) + 'pt';
        } else {
          // Unset the indent.
          this.style.marginLeft = 0;
        }
        this.previousIndent_ = current;
      }
    },

    /**
     * @return {object|undefined} return the indent "Decoration" in twips for a
     *   given computed css style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      indent: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be
        // rounded as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output
        var computedVal = this.indent ||
            Converter.pt2twip(Converter.cssSize2pt(computedStyles.marginLeft));

        return computedVal;
      }
    }

  });

  return api_;

});
