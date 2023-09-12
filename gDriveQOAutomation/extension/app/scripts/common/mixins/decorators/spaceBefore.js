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
  'common/mixins/decorators/decoratorBase'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['spb'],

    observers: [
      'spbChanged_(model.ppr.spb)'
    ],

    get spb() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.spb);
    },

    set spb(value) {
      this.setInModel_('ppr.spb', value);
    },

    spbChanged_: function(current) {
      if (current !== undefined) {
        this.style.paddingTop = Math.max(current, 0) + 'pt';
      } else {
        this.style.paddingTop = '';
      }
    },

    // NOTE: does not us the computedStyles object
    // because at the moment we do not support inherited space before/after
    computedDecorations_: {
      spb: function(/* computedStyles */) {
        return this.model.ppr && this.model.ppr.spb;
      }
    }

  });

  return api_;

});
