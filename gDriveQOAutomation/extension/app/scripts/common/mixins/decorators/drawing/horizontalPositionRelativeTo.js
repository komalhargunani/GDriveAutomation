define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['horizontalPositionRel'],

    observers: [
      'horizontalPositionRelChanged_(model.horizontalPositionRel)'
    ],

    get horizontalPositionRel() {
      return (this.model && this.model.horizontalPositionRel);
    },

    set horizontalPositionRel(value) {
      this.setInModel_('horizontalPositionRel', value, ['character', 'column',
        'page', 'margin', 'leftMargin', 'rightMargin', 'insideMargin',
        'outsideMargin']);
    },

    horizontalPositionRelChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('hposref', current);
      } else {
        this.removeAttribute('hposref');
      }
    },

    computedDecorations_: {
      horizontalPositionRel: function(/* computedStyles */) {
        return this.getAttribute('hposref') || undefined;
      }
    }

  });

  return api_;

});
