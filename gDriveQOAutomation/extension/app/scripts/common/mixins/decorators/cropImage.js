define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'
], function(
    DecoratorBase,
    MixinUtils,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['crop'],

    observers: [
      'cropChanged_(model.imageProperties.crop)',
      'cropChanged_(model.imageProperties.crop.b)',
      'cropChanged_(model.imageProperties.crop.l)',
      'cropChanged_(model.imageProperties.crop.r)',
      'cropChanged_(model.imageProperties.crop.t)',
      'cropChanged_(model.imageProperties.hgt)',
      'cropChanged_(model.imageProperties.wdt)'
    ],

    get cropTop() {
      return _.get(this, 'model.imageProperties.crop.t', 0 /* default*/);
    },

    set cropTop(value) {
      this.setInModel_('imageProperties.crop.t', value);
    },

    get cropBottom() {
      return _.get(this, 'model.imageProperties.crop.b', 0 /* default*/);
    },

    set cropBottom(value) {
      this.setInModel_('imageProperties.crop.b', value);
    },

    get cropLeft() {
      return _.get(this, 'model.imageProperties.crop.l', 0 /* default*/);
    },

    set cropLeft(value) {
      this.setInModel_('imageProperties.crop.l', value);
    },

    get cropRight() {
      return _.get(this, 'model.imageProperties.crop.r', 0 /* default*/);
    },

    set cropRight(value) {
      this.setInModel_('imageProperties.crop.r', value);
    },

    get crop() {
      return _.get(this, 'model.imageProperties.crop');
    },

    set crop(value) {
      this.setInModel_('imageProperties.crop', value);
    },

    cropChanged_: function(current) {
      if (current) {
        this.computeCropMetrics();
        this.setAttribute('crop', true);
      } else {
        this.removeAttribute('crop');
      }
    },

    computedDecorations_: {
      crop: function(/* computedStyles */) {
        return this.crop;
      }
    },

    /**
     * @private
     * Compute the cropping information.
     * Create an object that has the original width and height of
     * the cropped image, and also the horizontal and vertical position
     * where the image should be placed to achieve cropping.
     */
    computeCropMetrics: function() {
      // Each edge of the dcp.crop rectangle is defined by a percentage
      // offset from the corresponding edge of the bounding box.
      // A positive percentage specifies an inset,
      // while a negative percentage specifies an outset.

      // calculate original height and width of the image.
      var kUnit_ = 'mm';
      if (this.hgt && this.wdt && this.crop) {
        var originalHeight = (100 * Converter.twip2mm(this.hgt)) /
            (100 - (this.cropTop + this.cropBottom));
        var originalWidth = (100 * Converter.twip2mm(this.wdt)) /
            (100 - (this.cropLeft + this.cropRight));

        // calculate the horizontal and vertical position, where the
        // background image is to be placed to achieve cropping.
        // top left corner being (0, 0).
        this.xposition =
            ((this.cropLeft / 100) * originalWidth * -1);
        this.yposition =
            ((this.cropTop / 100) * originalHeight * -1);

        this.style.backgroundSize = originalWidth + kUnit_ +
            ' ' + originalHeight + kUnit_;
        this.style.backgroundPosition = this.xposition + kUnit_ +
            ' ' + this.yposition + kUnit_;
      }
    }

  });

  return api_;
});
