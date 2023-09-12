define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
  DecoratorBase,
  MixinUtils) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['leftMargin', 'topMargin', 'rightMargin', 'bottomMargin'],

    observers: [
      'leftMarginChanged_(model.formatting.leftMargin)',
      'topMarginChanged_(model.formatting.topMargin)',
      'rightMarginChanged_(model.formatting.rightMargin)',
      'bottomMarginChanged_(model.formatting.bottomMargin)'
    ],

    /** @return {number} The left inset of the bounding rectangle in points. */
    get leftMargin() {
      return (this.model && this.model.formatting &&
          this.model.formatting.leftMargin);
    },

    /** @param {number} value The left margin. */
    set leftMargin(value) {
      this.setInModel_('leftMargin', value);
    },

    /**
     * @param {number} current The current value of left margin.
     */
    leftMarginChanged_: function(current) {
      if (current !== undefined) {
        this.style.paddingLeft = current + 'pt';
      } else {
        this.style.paddingLeft = '';
      }
    },

    /** @return {number} The top inset of the bounding rectangle in points. */
    get topMargin() {
      return (this.model && this.model.formatting &&
          this.model.formatting.topMargin);
    },

    /** @param {number} value The top margin. */
    set topMargin(value) {
      this.setInModel_('topMargin', value);
    },

    /**
     * @param {number} current The current value of top margin.
     */
    topMarginChanged_: function(current) {
      if (current !== undefined) {
        this.style.paddingTop = current + 'pt';
      } else {
        this.style.paddingTop = '';
      }
    },

    /**
     * @return {number} The right inset of the bounding rectangle in points.
     */
    get rightMargin() {
      return (this.model && this.model.formatting &&
          this.model.formatting.rightMargin);
    },

    /** @param {number} value The right margin. */
    set rightMargin(value) {
      this.setInModel_('rightMargin', value);
    },

    /**
     * @param {number} current The current value of right margin.
     */
    rightMarginChanged_: function(current) {
      if (current !== undefined) {
        this.style.paddingRight = current + 'pt';
      } else {
        this.style.paddingRight = '';
      }
    },

    /**
     * @return {number} The bottom inset of the bounding rectangle in points.
     */
    get bottomMargin() {
      return (this.model && this.model.formatting &&
          this.model.formatting.bottomMargin);
    },

    /** @param {number} value The bottom margin. */
    set bottomMargin(value) {
      this.setInModel_('bottomMargin', value);
    },

    /**
     * @param {number} current The current value of bottom margin.
     */
    bottomMarginChanged_: function(current) {
      if (current !== undefined) {
        this.style.paddingBottom = current + 'pt';
      } else {
        this.style.paddingBottom = '';
      }
    },

    /** @return {number} The margins for a given computed css style. */
    computedDecorations_: {
      leftMargin: function(/* computedStyles */) {
        return this.leftMargin;
      },
      topMargin: function(/* computedStyles */) {
        return this.topMargin;
      },
      rightMargin: function(/* computedStyles */) {
        return this.rightMargin;
      },
      bottomMargin: function(/* computedStyles */) {
        return this.bottomMargin;
      }
    }
  });

  return api_;

});
