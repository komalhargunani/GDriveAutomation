define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['htp'],

    get htp() {
      return (this.headerDistanceFromTop);
    },

    set htp(value) {
      this.headerDistanceFromTop = value || 0;
    },

    computedDecorations_: {
      htp: function() {
        return (this.headerDistanceFromTop);
      }
    }

  });

  return api_;

});
