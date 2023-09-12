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

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['lin'],

    observers: [
      'linChanged_(model.ppr.lin)',
      'linChanged_(model.ppr.hin)'
    ],

    /**
     * @return {number} The left indentation amount for the
     *                  paragraph in points
     */
    get lin() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.lin);
    },

    /**
     * Set the left indent in the model.
     * Note: we keep the true value in the model, but round it to a two digit
     * fixed number when we set the styling for the element. ie the model and
     * view of the element are kept separate.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model
     *
     * @param {number} value the left indentation for the paragraph
     */
    set lin(value) {
      this.setInModel_('ppr.lin', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits)
     *
     * @param {number} current value
     */
    linChanged_: function(/* current */) {
      if (this.lin !== undefined) {
        this.style.marginLeft = Number(this.lin).toFixed(2) + 'pt';
      } else{
        this.style.marginLeft = '';
      }
    },

    /**
     * @return {object} return the hanging indent "Decoration" for a given
     *                  computed css style. Called by the DecoratorBase module
     */
    computedDecorations_: {
      lin: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be
        // rounded as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output

        // and finally note that if this element does not have Hanging Indent
        // (hin) then we have to check the left margin rather than left padding.
        var computedVal = this.lin;
        if (isNaN(computedVal)) {
          computedVal = (isNaN(this.hin)) ?
              Converter.cssSize2pt(computedStyles.marginLeft) :
              Converter.cssSize2pt(computedStyles.paddingLeft);
        }

        return computedVal;
      }
    }

  });

  return api_;
});
