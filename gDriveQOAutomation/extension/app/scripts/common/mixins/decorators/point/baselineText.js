define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['baseline'],

    observers: [
      'baselineChanged_(model.rpr.baseline)'
    ],

    get baseline() {
      return (this.model &&
          this.model.rpr &&
          this.model.rpr.baseline);
    },

    set baseline(value) {
      this.setInModel_('rpr.baseline', value);
    },

    baselineChanged_: function(current) {
      if (current !== undefined) {
        this.style.zoom = '70%';
        this.style.verticalAlign = current + '% ';
      } else {
        this.style.removeProperty('zoom');
        this.style.removeProperty('vertical-align');
      }
    },

    computedDecorations_: {
      baseline: function(computedStyles) {
        var align = parseInt(computedStyles.verticalAlign),
            baseline;
        if (!isNaN(align)) {
          baseline = align;
        }
        return baseline;
      }
    }
  });


  return api_;

});
