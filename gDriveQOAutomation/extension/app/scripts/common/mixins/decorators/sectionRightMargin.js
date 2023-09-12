define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['mgr'],

    observers: [
      'mgrChanged_(model.mgr)'
    ],

    get mgr() {
      return (this.model && this.model.mgr);
    },

    set mgr(value) {
      this.setInModel_('mgr', value);
    },

    mgrChanged_: function(current) {
      if (current !== undefined) {
        this.pageMargins.right = current;
        this.fire('page-margins-changed');
      }
    },

    computedDecorations_: {
      mgr: function() {
        return (this.model && this.model.mgr);
      }
    }

  });

  return api_;

});
