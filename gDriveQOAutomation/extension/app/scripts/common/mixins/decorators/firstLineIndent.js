/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename dcp properties to something readable in
 * dcp schema, core and everywhere else
 * (eg toolbar buttons, these observe functions, addNodes/formatNodes etc etc)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/utils/converters/converter'], function(
  MixinUtils,
  DecoratorBase,
  Converter) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['fli'],

    observers: [
      'fliChanged_(model.ppr.fli)'
    ],

    /**
     * @return {number} The first line only indentation amount for the
     *                  paragraph in points
     */
    get fli() {
      // TODO(jliebrand): this getter was previously incorrect in that it
      // checked for the existance of "this.model.fli". However, that seems
      // to never have been spotted by any unit / e2e test. We need to extend
      // our testing here so that this is covered.
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.fli);
    },

    /**
     * Set the first line indent in the model.
     * Note: we keep the true value in the model, but round it to a two digit
     * fixed number when we set the styling for the element. ie the model and
     * view of the element are kept separate.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model
     *
     * @param {number} value the first line only indentation for the paragraph
     */
    set fli(value) {
      this.setInModel_('ppr.fli', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits)
     *
     * @param {number} current the new value for first line indent
     */
    fliChanged_: function(current) {
      if (current !== this.previousFli_) {
        if (current !== undefined) {
          this.style.textIndent = Number(current).toFixed(2) + 'pt';
        } else {
          this.style.textIndent = '';
        }
        this.previousFli_ = current;
      }
    },

    /**
     * @return {object} return the first line indent "Decoration" for a given
     *                  computed css style. Called by the DecoratorBase module
     */
    computedDecorations_: {
      fli: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be
        // rounded as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output
        var computedVal = this.fli ||
            Converter.cssSize2pt(computedStyles.textIndent);

        // we only have first line indent if it's greater than 0. Negative
        // textIndent is used for hangingIndent...
        if (computedVal <= 0) {
          computedVal = undefined;
        }
        return computedVal;
      }
    }

  });

  // PRIVATE ===================================================================

  return api_;
});
