define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['wrappingStyle'],

    observers: [
      'wrappingStyleChanged_(model.wrappingStyle)'
    ],

    get wrappingStyle() {
      return (this.model && this.model.wrappingStyle);
    },

    set wrappingStyle(value) {
      this.setInModel_('wrappingStyle', value, ['square', 'tight', 'through',
        'topAndBottom', 'behindText', 'inFrontOfText', 'inlineWithText']);
    },

    wrappingStyleChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('wrappingstyle', current);
      } else {
        this.removeAttribute('wrappingstyle');
      }
    },

    computedDecorations_: {
      wrappingStyle: function(/* computedStyles */) {
        return this.getAttribute('wrappingstyle') || undefined;
      }
    }

  });

  return api_;

});
