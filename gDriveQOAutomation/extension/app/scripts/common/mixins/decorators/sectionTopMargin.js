define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['mgt'],

    observers: [
      'mgtChanged_(model.mgt)'
    ],

    get mgt() {
      return (this.model && this.model.mgt);
    },

    set mgt(value) {
      this.setInModel_('mgt', value);
    },

    mgtChanged_: function(current) {
      if (current !== undefined) {
        this.pageMargins.top = current;
        this.fire('page-margins-changed');
      }
    },

    computedDecorations_: {
      mgt: function() {
        return (this.model && this.model.mgt);
      }
    }

  });

  return api_;

});
