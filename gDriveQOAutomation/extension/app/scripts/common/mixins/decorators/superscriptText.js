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

    supports_: ['sup'],

    observers: [
      'supChanged_(model.rpr.sup)'
    ],

    get sup() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.sup);
    },

    set sup(value) {
      this.setInModel_('rpr.sup', value, [true, false]);
    },

    supChanged_: function(current) {
      if (current !== this.previousSup_) {
        if (current !== undefined) {
          var sups = parseFloat(current);
          this.style.fontSize = sups + 'pt';
          this.style.zoom = '75%';
          this.style.verticalAlign = 'super';
          this.style.lineHeight = '0';
        } else {
          this.style.fontSize = '';
          this.style.zoom = '';
          this.style.verticalAlign = '';
          this.style.lineHeight = '';
        }
      }
      this.previousSup_ = current;
    },

    // NOTE: does not us the computedStyles object
    // because sub/super script does not inherit
    computedDecorations_: {
      sup: function(/* computedStyles */) {
        return this.model.rpr && this.model.rpr.sup;
      }
    }

  });


  return api_;

});
