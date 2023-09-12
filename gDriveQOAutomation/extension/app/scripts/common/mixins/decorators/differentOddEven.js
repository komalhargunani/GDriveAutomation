define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['doe'],

    get doe() {
      return (this.differentOddEven);
    },

    set doe(value) {
      this.differentOddEven = value || false;
    },

    computedDecorations_: {
      doe: function() {
        return (this.differentOddEven);
      }
    }

  });

  return api_;

});
