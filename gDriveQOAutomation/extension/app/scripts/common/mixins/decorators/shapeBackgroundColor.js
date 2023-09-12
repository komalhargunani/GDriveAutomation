define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
  DecoratorBase,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['backgroundColor'],

    observers: [
      'backgroundColorChanged_(model.formatting.backgroundColor)'
    ],

    /**
     * @return {string} The background color of the shape.
     */
    get backgroundColor() {
      return (this.model && this.model.formatting &&
          this.model.formatting.backgroundColor);
    },

    /**
     * @param {string} value The background color of the shape.
     */
    set backgroundColor(value) {
      this.setInModel_('backgroundColor', value);
    },

    /**
     * @param {string} current The current value of background color.
     */
    backgroundColorChanged_: function(current) {
      if (current !== undefined) {
        this.style.backgroundColor = current;
      } else {
        this.style.backgroundColor = '';
      }
    },

    /**
     * @return {string} The background color for a given computed css style.
     */
    computedDecorations_: {
      backgroundColor: function(/* computedStyles */) {
        return this.backgroundColor;
      }
    }
  });

  return api_;

});
