define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'], function(
  DecoratorBase,
  MixinUtils,
  Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    distFromText : {},
    supports_: ['distanceFromText'],

    observers: [
      'distanceFromTextChanged_(model.distanceFromText)'
    ],

    get distanceFromText() {
      return (this.model && this.model.distanceFromText);
    },

    set distanceFromText(value) {
      this.setInModel_('distanceFromText', value);
    },

    distanceFromTextChanged_: function(current) {
      if (current !== undefined) {
        this.distFromText = {
          b: Converter.twip2px(current.b) + 'px',
          l: Converter.twip2px(current.l) + 'px',
          r: Converter.twip2px(current.r) + 'px',
          t: Converter.twip2px(current.t) + 'px'

        };
      } else {
        this.distFromText = undefined;
      }
    },

    computedDecorations_: {
      distanceFromText: function(/* computedStyles */) {

        this.distFromText = {
          // parseFloat will ignore 'px' etc..
          b: Converter.px2twip(parseFloat(this.distFromText.b)),
          l: Converter.px2twip(parseFloat(this.distFromText.l)),
          r: Converter.px2twip(parseFloat(this.distFromText.r)),
          t: Converter.px2twip(parseFloat(this.distFromText.t))
        };
        return this.distFromText;
      }
    }

  });

  return api_;

});
