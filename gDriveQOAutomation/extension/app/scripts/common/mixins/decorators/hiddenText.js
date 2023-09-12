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

    supports_: ['hid'],

    observers: [
      'hidChanged_(model.rpr.hid)'
    ],

    get hid() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.hid);
    },

    set hid(value) {
      this.setInModel_('rpr.hid', value, [true, false]);
    },

    hidChanged_: function(current) {
      this.style.display = current ? 'none' : '';
    },

    computedDecorations_: {
      hid: function(computedStyles) {
        return computedStyles.display === 'none';
      }
    }

  });

  return api_;

});
