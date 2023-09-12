define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/pubsub/pubsub'
], function(
    DecoratorBase,
    MixinUtils,
    PubSub) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    observers: [
      'backgroundSizeChanged_(model.imageProperties.hgt)',
      'backgroundSizeChanged_(model.imageProperties.wdt)'
    ],

    backgroundSizeChanged_: function() {
      // If model has image crop information, the image background size property
      // value is calculated wrt crop information and applied in crop image
      // decorator.
      if (!this.crop) {
        this.style.backgroundSize = this.style.width + ' ' + this.style.height;
        if (this.hasOverlay_()) {
          PubSub.publish('qowt:underlaySizeChanged', this);
        }
      }
    },

    computedDecorations_: {
      backgroundSize: function(/* computedStyles */) {
        return _.get(this, 'style.backgroundSize');
      }
    },

    hasOverlay_: function() {
      return this.parentNode && _.isFunction(this.parentNode.isSelected) &&
          this.parentNode.isSelected();
    }

  });

  return api_;
});
