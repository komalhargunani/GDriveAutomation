/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename 'udl' to 'italic' in dcp schema, core
 * and everywhere else (eg alignButton, these observe functions etc etc)
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

    supports_: ['udl'],

    observers: [
      'udlChanged_(model.rpr.udl)'
    ],

    get udl() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.udl);
    },

    set udl(value) {
      this.setInModel_('rpr.udl', value, [true, false]);
    },

    udlChanged_: function(current) {
      if (current) {
        this.addTextDecoration_('underline');
      } else {
        this.removeTextDecoration_('underline', current);
      }
    },

    computedDecorations_: {
      udl: function(computedStyles) {
        return (computedStyles['text-decoration'].indexOf('underline') !== -1);
      }
    }

  });

  return api_;

});
