define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['mgl'],

    observers: [
      'mglChanged_(model.mgl)'
    ],

    get mgl() {
      return (this.model && this.model.mgl);
    },

    set mgl(value) {
      this.setInModel_('mgl', value);
    },

    mglChanged_: function(current) {
      if (current !== undefined) {
        this.pageMargins.left = current;
        this.fire('page-margins-changed');
      }
    },

    computedDecorations_: {
      mgl: function() {
        return (this.model && this.model.mgl);
      }
    }

  });

  return api_;

});
