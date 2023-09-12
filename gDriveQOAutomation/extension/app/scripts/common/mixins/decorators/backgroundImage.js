define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/variants/utils/resourceLocator'
], function(
    DecoratorBase,
    MixinUtils,
    ResourceLocator) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['src'],

    observers: [
      'backgroundImageChanged_(model.src)'
    ],

    get src() {
      return _.get(this, 'model.src');
    },

    set src(value) {
      this.setInModel_('src', value);
    },

    backgroundImageChanged_: function(current) {
      if (current) {
        var imageUrl = ResourceLocator.pathToUrl(current);
        if (imageUrl) {
          this.style.backgroundImage = 'url(' + imageUrl + ')';
        } else {
          // Throw error if the image is not registered. We can not register
          // image here because image blob is absent.
          throw new Error('Error: Url missing, image is not registered');
        }
      } else {
        // TODO: should we consider unregistering the image from
        // ResourceLocator?
        this.style.backgroundImage = '';
      }
    },

    computedDecorations_: {
      src: function(/* computedStyles */) {
        return this.style.backgroundImage;
      }
    }

  });

  return api_;
});
