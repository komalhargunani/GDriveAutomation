/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename 'itl' to 'italic' in dcp schema, core
 * and everywhere else (eg alignButton, these observe functions etc etc)
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

    supports_: ['itl'],

    observers: [
      'itlChanged_(model.rpr.itl)'
    ],

    get itl() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.itl);
    },

    set itl(value) {
      this.setInModel_('rpr.itl', value, [true, false]);
    },

    itlChanged_: function(current) {
      if (current === undefined) {
        this.style.fontStyle = '';
      } else {
        this.style.fontStyle = current ? 'italic' : 'normal';
      }
    },

    computedDecorations_: {
      itl: function(computedStyles) {
        return (computedStyles['font-style'] === 'italic');
      }
    }

  });

  return api_;

});
