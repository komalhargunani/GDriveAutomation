define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter',
  'third_party/lo-dash/lo-dash.min'], function(
    DecoratorBase,
    MixinUtils,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    topPos: '0pt',

    supports_: ['verticalPosOffset'],

    observers: [
      'verticalPosOffsetChanged_(model.verticalPosOffset)'
    ],

    get verticalPosOffset() {
      return (this.model && this.model.verticalPosOffset);
    },

    set verticalPosOffset(value) {
      this.setInModel_('verticalPosOffset', value);
    },

    verticalPosOffsetChanged_: function(current) {
      if (current) {
        this.topPos = Converter.twip2pt(current) + 'pt';
      } else {
        this.topPos = '0pt';
      }
    },

    computedDecorations_: {
      verticalPosOffset: function(/* computedStyles */) {
        return Converter.pt2twip(Converter.cssSize2pt(this.topPos));
      }
    }

  });

  return api_;

});
