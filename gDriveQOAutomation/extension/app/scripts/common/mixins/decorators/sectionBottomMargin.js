define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['mgb'],

    observers: [
      'mgbChanged_(model.mgb)'
    ],

    get mgb() {
      return (this.model && this.model.mgb);
    },

    set mgb(value) {
      this.setInModel_('mgb', value);
    },

    mgbChanged_: function(current) {
      if (current !== undefined) {
        this.pageMargins.bottom = current;
        this.fire('page-margins-changed');
      }
    },

    computedDecorations_: {
      mgb: function() {
        return (this.model && this.model.mgb);
      }
    }

  });

  return api_;

});
