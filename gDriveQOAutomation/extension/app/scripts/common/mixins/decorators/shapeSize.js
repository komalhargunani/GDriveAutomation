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

    supports_: ['width', 'height'],

    observers: [
      'widthChanged_(model.formatting.width)',
      'heightChanged_(model.formatting.height)'
    ],

    /**
     * @return {number} The width.
     */
    get width() {
      return (this.model && this.model.formatting &&
          this.model.formatting.width);
    },

    /**
     * @param {number} value The width.
     */
    set width(value) {
      this.setInModel_('width', value);
    },

    /**
     * @param {number} current The current value of width.
     */
    widthChanged_: function(current) {
      if (current !== undefined) {
        var width = calculatedWidth(current, this.model.formatting);
        this.style.width = width + 'pt';
      } else {
        this.style.width = 'auto';
      }
    },

    /**
     * @return {number} The height.
     */
    get height() {
      return (this.model && this.model.formatting &&
          this.model.formatting.width);
    },

    /**
     * @param {number} value The height.
     */
    set height(value) {
      this.setInModel_('height', value);
    },

    /**
     * @param {number} current The current value of height.
     */
    heightChanged_: function(current) {
      if (current !== undefined) {
        var height = calculatedHeight(current, this.model.formatting);
        this.style.height = height + 'pt';
      } else {
        this.style.height = 'auto';
      }
    },

    /**
     * @return {number} The width and height for a given computed css style.
     */
    computedDecorations_: {
      width: function(/* computedStyles */) {
        return this.width;
      },
      height: function(/* computedStyles */) {
        return this.height;
      }
    }
  });

  /**
   * @return {number} Calculated content width in points.
   * @param {number} value The width of the shape in points.
   * @param {object} formatting Shape formatting object.
   */
  function calculatedWidth(value, formatting) {
    var width = value;
    if (formatting.borders) {
      if (formatting.borders.left && formatting.borders.left.width) {
        var left_border_width =
            Converter.eighthpt2pt(formatting.borders.left.width);
        width = width - left_border_width / 2;
      }
      if (formatting.borders.right && formatting.borders.right.width) {
        var right_border_width =
            Converter.eighthpt2pt(formatting.borders.right.width);
        width = width - right_border_width / 2;
      }
    }

    if (formatting.leftMargin) {
      width = width - formatting.leftMargin;
    }

    if (formatting.rightMargin) {
      width = width - formatting.rightMargin;
    }

    return width;
  }

  /**
   * @return {number} Calculated content height in points.
   * @param {number} value The height of the shape in points.
   * @param {object} formatting Shape formatting object.
   */
  function calculatedHeight(value, formatting) {
    var height = value;
    if (formatting.borders) {
      if (formatting.borders.top && formatting.borders.top.width) {
        var top_border_width =
            Converter.eighthpt2pt(formatting.borders.top.width);
        height = height - top_border_width / 2;
      }
      if (formatting.borders.bottom && formatting.borders.bottom.width) {
        var bottom_border_width =
            Converter.eighthpt2pt(formatting.borders.bottom.width);
        height = height - bottom_border_width / 2;
      }
    }

    if (formatting.topMargin) {
      height = height - formatting.topMargin;
    }

    if (formatting.bottomMargin) {
      height = height - formatting.bottomMargin;
    }

    return height;
  }

  return api_;

});
