define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['otn'],

    observers: [
      'otnChanged_(model.otn)'
    ],

    get otn() {
      return (this.model && this.model.otn);
    },

    set otn(value) {
      this.setInModel_('otn', value);
    },

    otnChanged_: function(current) {
      if (current) {
        this.pageSize.orientation = (current === 'P' ? 'portrait' :
            'landscape');
        this.fire('page-size-changed');
      }
    },

    computedDecorations_: {
      otn: function() {
        return (this.model && this.model.otn);
      }
    }

  });

  return api_;

});
