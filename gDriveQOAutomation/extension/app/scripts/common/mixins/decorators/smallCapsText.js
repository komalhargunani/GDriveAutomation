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

    supports_: ['scp'],

    observers: [
      'scpChanged_(model.rpr.scp)'
    ],

    get scp() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.scp);
    },

    set scp(value) {
      this.setInModel_('rpr.scp', value, [true, false]);
    },

    scpChanged_: function(current) {
      if (this.previousScp_ !== current) {
        if (current) {
          this.style.fontVariant = 'small-caps';
        } else {
          this.style.fontVariant = 'normal';
        }
        this.previousScp_ = current;
      }
    },

    // NOTE: does not us the computedStyles object
    // because at the moment we do not support inherited space before/after
    computedDecorations_: {
      scp: function(/* computedStyles */) {
        return this.model.rpr && this.model.rpr.scp;
      }
    }

  });

  return api_;

});
