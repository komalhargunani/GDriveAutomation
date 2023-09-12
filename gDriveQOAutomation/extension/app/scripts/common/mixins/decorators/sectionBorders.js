define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['borders'],

    observers: [
      'bordersChanged_(model.borders)'
    ],

    get borders() {
      return (this.model && this.model.borders);
    },

    set borders(value) {
      this.setInModel_('borders', value);
    },

    bordersChanged_: function(current) {
      if (current) {
        this.pageBorders = current;
        this.fire('page-borders-changed');
      }
    },

    computedDecorations_: {
      borders: function() {
        return (this.model && this.model.borders);
      }
    }

  });

  return api_;

});
