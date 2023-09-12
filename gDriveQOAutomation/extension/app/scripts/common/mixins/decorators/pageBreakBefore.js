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

    supports_: ['pbb'],

    observers: [
      'pbbChanged_(model.ppr.pbb)'
    ],

    get pbb() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.pbb);
    },

    set pbb(value) {
      this.setInModel_('ppr.pbb', value, [true, false]);
    },

    pbbChanged_: function(current) {
      if (current) {
        this.setAttribute('break-before', '');
      } else {
        this.removeAttribute('break-before');
      }
    },

    computedDecorations_: {
      pbb: function(/* computedStyles */) {
        return this.model && this.model.ppr && this.model.ppr.pbb;
      }
    }

  });

  return api_;

});
