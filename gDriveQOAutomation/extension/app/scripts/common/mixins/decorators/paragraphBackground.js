define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
  DecoratorBase,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['shading'],

    observers: [
      'shadingChanged_(model.ppr.shading)'
    ],

    /**
     * @return {string} The shading fill of the paragraph
     */
    get shading() {
      return (this.model && this.model.ppr &&
          this.model.ppr.shading);
    },

    /**
     * @param {string} value The shading fill of the paragraph
     */
    set shading(value) {
      this.setInModel_('ppr.shading', value);
    },

    /**
     * @param {string} current The current value of background color.
     */
    shadingChanged_: function(current) {
      if (current && current.backgroundColor !== undefined) {
        this.style.backgroundColor = current.backgroundColor;
      } else {
        this.style.backgroundColor = '';
      }
    },

    /**
     * @return {string} The background color for a given computed css style.
     */
    computedDecorations_: {
      shading: function(/* computedStyles */) {
        return this.shading || {backgroundColor: 'auto'};
      }
    }
  });

  return api_;

});
