define([
  'common/mixins/decorators/borderUtils',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
], function(
    BorderUtils,
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['borders'],

    observers: [
      'bordersChanged_(model.formatting.borders)'
    ],

    /**
     * @return {object} Borders of the shape.
     */
    get borders() {
      return (this.model && this.model.formatting &&
          this.model.formatting.borders);
    },


    /**
     * @param {object} value Shape borders.
     */
    set borders(value) {
      this.setInModel_('borders', value);
    },


    /**
     * @param {object} current The current value of borders.
     */
    bordersChanged_: function(current) {
      if (current !== undefined) {
        BorderUtils.setBorders(this, current);
      } else {
        BorderUtils.unsetBorders(this);
      }
    },


    /**
     * @return {object|undefined} Borders for a given computed css style.
     */
    computedDecorations_: {
      borders: function(/* computedStyles */) {
        return this.borders();
      }
    }
  });

  return api_;

});
