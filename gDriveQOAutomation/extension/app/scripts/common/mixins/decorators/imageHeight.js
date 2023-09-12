define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter'
], function(
    DecoratorBase,
    MixinUtils,
    Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['hgt'],

    observers: [
      'imageHeightChanged_(model.imageProperties.hgt)'
    ],

    get hgt() {
      return _.get(this, 'model.imageProperties.hgt');
    },

    set hgt(value) {
      this.setInModel_('imageProperties.hgt', value);
    },

    imageHeightChanged_: function(current) {
      if (current) {
        this.style.height = Converter.twip2mm(current) + 'mm';
      } else {
        this.style.height = '';
      }
    },

    computedDecorations_: {
      hgt: function(/* computedStyles */) {
        return (!_.isEmpty(this.style.height) ? parseFloat(this.style.height) :
            undefined);
      }
    }

  });

  return api_;
});
