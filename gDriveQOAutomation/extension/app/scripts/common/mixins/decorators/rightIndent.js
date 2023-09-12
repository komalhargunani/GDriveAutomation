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

    supports_: ['rin'],

    observers: [
      'rinChanged_(model.ppr.rin)'
    ],

    /**
     * @return {number} The right indentation amount for the
     *                  paragraph in points
     */
    get rin() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.rin);
    },

    /**
     * Set the right indent in the model.
     * Note: we keep the true value in the model, but round it to a two digit
     * fixed number when we set the styling for the element. ie the model and
     * view of the element are kept separate.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model
     *
     * @param {number} value the left indentation for the paragraph
     */
    set rin(value) {
      this.setInModel_('ppr.rin', value);
    },

    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value (which we round to two digits)
     *
     * @param {number} current value
     */
    rinChanged_: function(current) {
      if (current !== undefined) {
        this.style.marginRight = Number(current).toFixed(2) + 'pt';
      } else {
        this.style.marginRight = '';
      }
    },

    /**
     * @return {object} return the right indent "Decoration" as a float for a
     *     given computed css style.
     */
    computedDecorations_: {
      rin: function(computedStyles) {
        var computedVal = this.rin ||
            Converter.cssSize2pt(computedStyles.marginRight);

        return computedVal;
      }
    }

  });

  return api_;

});
