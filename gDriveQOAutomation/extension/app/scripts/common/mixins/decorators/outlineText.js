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

    supports_: ['otl'],

    observers: [
      'otlChanged_(model.rpr.otl)'
    ],

    get otl() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.otl);
    },

    set otl(value) {
      this.setInModel_('rpr.otl', value, [true, false]);
    },

    otlChanged_: function(current) {
      if (current) {
        this.classList.add('outlineText');
      } else {
        this.classList.remove('outlineText');
      }
    },

    // outline text does not inherit since we use css classes to set them
    // so we do not check the actual computedStyles object
    computedDecorations_: {
      otl: function(/* computedStyles */) {
        return this.classList.contains('outlineText');
      }
    }

  });

  return api_;
});

