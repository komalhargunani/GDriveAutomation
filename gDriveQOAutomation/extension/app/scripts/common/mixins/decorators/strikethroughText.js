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
  'common/mixins/decorators/textDecorationBase'], function(
  MixinUtils,
  DecoratorBase,
  TextDecorationBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, TextDecorationBase, {

    // for double strike through('dstr') fall back to strike through.
    // Implement double strike through once chrome starts supporting
    // text-decoration-style: double, please refer following link for details
    // https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style
    supports_: ['str', 'dstr'],

    observers: [
      'strChanged_(model.rpr.str)',
      'strChanged_(model.rpr.dstr)'
    ],

    get dstr() {
      return (this.model &&
          this.model.rpr &&
          this.model.rpr.dstr);
    },

    set dstr(value) {
      this.setInModel_('rpr.dstr', value, [true, false]);
    },

    get str() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.str);
    },

    set str(value) {
      this.setInModel_('rpr.str', value, [true, false]);
    },

    strChanged_: function(current) {
      if (this.dstr || this.str) {
        this.addTextDecoration_('line-through');
      } else {
        this.removeTextDecoration_('line-through', current);
      }
    },

    computedDecorations_: {
      str: function(computedStyles) {
        return (
          computedStyles['text-decoration'].indexOf('line-through') !== -1);
      },
      dstr: function(computedStyles) {
        return (
          computedStyles['text-decoration'].indexOf('line-through') !== -1);
      }
    }

  });

  return api_;

});
