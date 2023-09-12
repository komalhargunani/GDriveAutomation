/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename 'bld' to 'bold' in dcp schema, core
 * and everywhere else (eg alignButton, these observe functions etc etc)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'third_party/lo-dash/lo-dash.min'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['bld'],

    observers: [
       'bldChanged_(model.rpr.bld)'
    ],

    get bld() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.bld);
    },

    set bld(value) {
      this.setInModel_('rpr.bld', value, [true, false]);
    },

    bldChanged_: function(current) {
      if (current === undefined) {
        this.style.fontWeight = '';
      } else {
        this.style.fontWeight = current ? 'bold' : 'normal';
      }
    },

    computedDecorations_: {
      bld: function(computedStyles) {
        if (!computedStyles) {
          return;
        }
        // As per CSS standards, font-weight Property 'bold' or '700'
        // represent bold text.
        return ((computedStyles['font-weight'] === 'bold') ||
            (computedStyles['font-weight'] === '700'));
      }
    }

  });

  return api_;

});
