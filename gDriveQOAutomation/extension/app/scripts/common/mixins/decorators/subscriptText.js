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

    supports_: ['sub'],

    observers: [
      'subChanged_(model.rpr.sub)'
    ],

    get sub() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.sub);
    },

    set sub(value) {
      this.setInModel_('rpr.sub', value, [true, false]);
    },

    subChanged_: function(current) {
      if (current !== this.previousSub_) {
        if (current !== undefined) {
          this.style.zoom = '75%';
          this.style.verticalAlign = 'sub';
          this.style.lineHeight = '0';
        } else {
          this.style.zoom = '';
          this.style.verticalAlign = '';
          this.style.lineHeight = '';
        }
      }
      this.previousSub_ = current;
    },

    // NOTE: does not us the computedStyles object
    // because sub/super script does not inherit
    computedDecorations_: {
      sub: function(/* computedStyles */) {
        return this.model.rpr && this.model.rpr.sub;
      }
    }

  });

  return api_;
});
