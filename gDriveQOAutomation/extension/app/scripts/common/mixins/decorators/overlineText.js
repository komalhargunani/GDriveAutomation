/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element overline text decorator mixin
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
  'common/mixins/decorators/textDecorationBase'], function(
  MixinUtils,
  DecoratorBase,
  TextDecorationBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, TextDecorationBase, {

    supports_: ['ovl'],

    observers: [
      'ovlChanged_(model.rpr.ovl)'
    ],

    /**
     * Get the overline text value from the model
     *
     * @return {boolean} returns true or false
     */
    get ovl() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.ovl);
    },

    /**
     * Set the overline text boolean in the model
     *
     * @param {boolean} value true or false
     */
    set ovl(value) {
      this.setInModel_('rpr.ovl', value, [true, false]);
    },

    /**
     * Data obsever for when the model changes, will set the right styling
     * on the element
     *
     * @param {boolean} current the new value after the change
     */
    ovlChanged_: function(current) {
      if (current) {
        this.addTextDecoration_('overline');
      } else {
        this.removeTextDecoration_('overline', current);
      }
    },

    computedDecorations_: {
      ovl: function(computedStyles) {
        return (computedStyles['text-decoration'].indexOf('overline') !== -1);
      }
    }

  });

  return api_;

});
