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

    supports_: ['emb'],

    observers: [
      'embChanged_(model.rpr.emb)'
    ],

    get emb() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.emb);
    },

    set emb(value) {
      this.setInModel_('rpr.emb', value, [true, false]);
    },

    embChanged_: function(current) {
      if (current) {
        this.classList.add(kCLASS_NAME_);
      } else {
        this.classList.remove(kCLASS_NAME_);
      }
    },

    computedDecorations_: {
      emb: function(/* computedStyles */) {
        // TODO(jliebrand): Some formatting is applied using a className,
        // this is fine for direct formatting but does not allow us to
        // determine formatting applied by styles.
        // For now this does not matter as the only clients of this
        // function are toolbar buttons.
        return this.classList.contains(kCLASS_NAME_);
      }
    }

  });

  var kCLASS_NAME_ = 'embossText';

  return api_;
});

