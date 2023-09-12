define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['height'],

    observers: [
      'heightChanged_(model.height)'
    ],

    get height() {
      return (this.model && this.model.height);
    },

    set height(value) {
      this.setInModel_('height', value);
    },

    heightChanged_: function(current) {
      this.pageSize.height = current;
      this.fire('page-size-changed');
    },

    computedDecorations_: {
      height: function() {
        return (this.model && this.model.height);
      }
    }

  });

  return api_;

});
