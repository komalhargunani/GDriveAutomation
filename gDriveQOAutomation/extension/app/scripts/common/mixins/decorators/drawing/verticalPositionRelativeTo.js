define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['verticalPositionRel'],

    observers: [
      'verticalPositionRelChanged_(model.verticalPositionRel)'
    ],

    get verticalPositionRel() {
      return (this.model && this.model.verticalPositionRel);
    },

    set verticalPositionRel(value) {
      this.setInModel_('verticalPositionRel', value, ['line', 'paragraph',
        'page', 'margin', 'insideMargin', 'outsideMargin', 'topMargin',
        'bottomMargin']);
    },

    verticalPositionRelChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('vposref', current);
      } else {
        this.removeAttribute('vposref');
      }
    },

    computedDecorations_: {
      verticalPositionRel: function(/* computedStyles */) {
        return this.getAttribute('vposref') || undefined;
      }
    }

  });

  return api_;

});
