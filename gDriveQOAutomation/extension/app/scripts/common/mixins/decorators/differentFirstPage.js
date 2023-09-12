define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['dfp'],

    get dfp() {
      return (this.differentFirstPage);
    },

    set dfp(value) {
      this.differentFirstPage = value || false;
    },

    computedDecorations_: {
      dfp: function() {
        return (this.differentFirstPage);
      }
    }

  });

  return api_;

});
