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

    leftPos: '0pt',

    supports_: ['horizontalPosOffset'],

    observers: [
      'horizontalPosOffsetChanged_(model.horizontalPosOffset)'
    ],

    get horizontalPosOffset() {
      return (this.model && this.model.horizontalPosOffset);
    },

    set horizontalPosOffset(value) {
      this.setInModel_('horizontalPosOffset', value);
    },


    horizontalPosOffsetChanged_: function(current) {
      if (current) {
        this.leftPos = Converter.twip2pt(current) + 'pt';
      } else {
        this.leftPos = '0pt';
      }
    },

    computedDecorations_: {
      horizontalPosOffset: function(/* computedStyles */) {
        return Converter.pt2twip(Converter.cssSize2pt(this.leftPos));
      }
    }

  });

  return api_;
});
