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

    supports_: ['wdt'],

    observers: [
      'imageWidthChanged_(model.imageProperties.wdt)'
    ],

    get wdt() {
      return _.get(this, 'model.imageProperties.wdt');
    },

    set wdt(value) {
      this.setInModel_('imageProperties.wdt', value);
    },

    imageWidthChanged_: function(current) {
      if (current) {
        this.style.width = Converter.twip2mm(current) + 'mm';
      } else {
        this.style.width = '';
      }
    },

    computedDecorations_: {
      wdt: function(/* computedStyles */) {
        return (!_.isEmpty(this.style.width) ? parseFloat(this.style.width) :
            undefined);
      }
    }

  });

  return api_;
});
