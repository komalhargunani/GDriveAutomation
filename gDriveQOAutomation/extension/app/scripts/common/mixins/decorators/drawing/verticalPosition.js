define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['verticalPosition'],

    observers: [
      'verticalPositionChanged_(model.verticalPosition)'
    ],

    get verticalPosition() {
      return (this.model && this.model.verticalPosition);
    },

    set verticalPosition(value) {
      this.setInModel_('verticalPosition', value, ['alignmentTop',
        'alignmentCentered', 'alignmentBottom', 'alignmentInside',
        'alignmentOutside', 'absolute']);
    },

    verticalPositionChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('vpos', current);
      } else {
        this.removeAttribute('vpos');
      }
    },

    computedDecorations_: {
      verticalPosition: function(/* computedStyles */) {
        return this.getAttribute('vpos') || undefined;
      }
    }

  });

  return api_;

});
