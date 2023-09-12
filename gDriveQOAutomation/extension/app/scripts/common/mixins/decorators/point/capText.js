define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'
], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['cap'],

    observers: [
      'capChanged_(model.rpr.cap)'
    ],

    get cap() {
      return (this.model &&
          this.model.rpr &&
          this.model.rpr.cap);
    },

    set cap(value) {
      this.setInModel_('rpr.cap', value, ['all', 'small', 'none']);
    },

    capChanged_: function(current) {
      this.style.removeProperty('text-transform');
      this.style.removeProperty('font-variant');

      switch (current) {
        case 'all' :
          this.style.textTransform = 'uppercase';
          this.style.fontVariant = 'normal';
          break;
        case 'small' :
          this.style.textTransform = 'none';
          this.style.fontVariant = 'small-caps';
          break;
        case 'none' :
          this.style.textTransform = 'none';
          this.style.fontVariant = 'normal';
          break;
        default :
          break;
      }
    },

    computedDecorations_: {
      cap: function(computedStyles) {
        var computedCap = 'none';
        if (computedStyles.textTransform === 'uppercase') {
          computedCap = 'all';
        } else if (computedStyles.fontVariant === 'small-caps') {
          computedCap = 'small';
        }
        return computedCap;
      }
    }

  });

  return api_;

});
