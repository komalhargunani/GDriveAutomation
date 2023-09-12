define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['horizontalPosition'],

    observers: [
      'horizontalPositionChanged_(model.horizontalPosition)'
    ],

    get horizontalPosition() {
      return (this.model && this.model.horizontalPosition);
    },

    set horizontalPosition(value) {
      this.setInModel_('horizontalPosition', value, ['alignmentLeft',
        'alignmentCenter', 'alignmentRight', 'alignmentInside',
        'alignmentOutside', 'absolute']);
    },

    horizontalPositionChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('hpos', current);
      } else {
        this.removeAttribute('hpos');
      }
    },

    computedDecorations_: {
      horizontalPosition: function(/* computedStyles */) {
        return this.getAttribute('hpos') || undefined;
      }
    }

  });

  return api_;

});
