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

    supports_: ['acp'],

    observers: [
        'acpChanged_(model.rpr.acp)'
    ],

    get acp() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.acp);
    },

    set acp(value) {
      this.setInModel_('rpr.acp', value, [true, false]);
    },

    acpChanged_: function(current) {
      if (!current) {
        this.style.textTransform = '';
      } else {
        this.style.textTransform = current ? 'uppercase' : 'none';
      }
    },

    computedDecorations_: {
      acp: function(computedStyles) {
        if (!computedStyles) {
          return;
        }
        return computedStyles.textTransform.indexOf('uppercase') !== -1;
      }
    }

  });

  return api_;

});
