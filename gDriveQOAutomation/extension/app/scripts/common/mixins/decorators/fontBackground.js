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

    supports_: ['hgl', 'shading'],

    observers: [
      'bgChanged_(model.rpr.hgl)',
      'bgChanged_(model.rpr.shading)'
    ],

    get hgl() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.hgl);
    },

    set hgl(value) {
      this.setInModel_('rpr.hgl', value);
    },

    get shading() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.shading);
    },

    set shading(value) {
      this.setInModel_('rpr.shading', value);
    },

    bgChanged_: function(/* current */) {
      var highlight = this.hgl;
      var shading = this.shading && this.shading.backgroundColor;
      if (highlight && highlight !== 'auto') {
        this.style.backgroundColor = highlight;
      } else if (shading && shading !== 'auto') {
        this.style.backgroundColor = shading;
      } else {
        this.style.backgroundColor = '';
      }
    },

    computedDecorations_: {
      hgl: function(/*computedStyles*/) {
        // We don't actually look at the computed styles because background
        // color could also be set by shading.
        return this.hgl || 'auto';
      },

      shading: function(/*computedStyles*/) {
        // We don't actually look at the computed styles because background
        // color could also be set by hgl.
        return this.shading || {backgroundColor: 'auto'};
      }
    }

  });

  return api_;

});
