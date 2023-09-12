define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
  DecoratorBase,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    relHeight : undefined,
    supports_: ['relativeHeight'],

    observers: [
      'relativeHeightChanged_(model.relativeHeight)'
    ],

    get relativeHeight() {
      return (this.model && this.model.relativeHeight);
    },

    set relativeHeight(value) {
      this.setInModel_('relativeHeight', value);
    },

    relativeHeightChanged_: function(current) {
        this.relHeight = current;
    },

    computedDecorations_: {
      relativeHeight: function(/* computedStyles */) {
        return this.relHeight;
      }
    }

  });

  return api_;

});
