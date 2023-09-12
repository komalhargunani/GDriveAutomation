define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['width'],

    observers: [
      'widthChanged_(model.width)'
    ],

    get width() {
      return (this.model && this.model.width);
    },

    set width(value) {
      this.setInModel_('width', value);
    },

    widthChanged_: function(current) {
      if (current !== undefined) {
        this.pageSize.width = current;
        this.fire('page-size-changed');
      }
    },

    computedDecorations_: {
      width: function() {
        return (this.model && this.model.width);
      }
    }

  });

  return api_;

});
