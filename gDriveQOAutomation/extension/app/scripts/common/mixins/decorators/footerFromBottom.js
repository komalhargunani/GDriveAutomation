define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['ftb'],

    get ftb() {
      return (this.footerDistanceFromBottom);
    },

    set ftb(value) {
      this.footerDistanceFromBottom = value || 0;
    },

    computedDecorations_: {
      ftb: function() {
        return (this.footerDistanceFromBottom);
      }
    }

  });

  return api_;

});
