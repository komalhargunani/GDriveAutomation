define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/textDecorationBase',
  'common/mixins/mixinUtils'], function(
    DecoratorBase,
    TextDecorationBase,
    MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, TextDecorationBase, {

    supports_: ['strike'],

    observers: [
      'strikeChanged_(model.rpr.strike)'
    ],

    get strike() {
      return (this.model &&
          this.model.rpr &&
          this.model.rpr.strike);
    },

    set strike(value) {
      this.setInModel_('rpr.strike', value);
    },

    strikeChanged_: function(current) {
      if (current === 'sngStrike' || current === 'dblStrike') {
        this.addTextDecoration_('line-through');
      } else {
        this.removeTextDecoration_('line-through');
      }
    },

    computedDecorations_: {
      strike: function(computedStyles) {
        var strike = 'noStrike';
        if (computedStyles['text-decoration'].indexOf('line-through') !== -1) {
          strike = 'sngStrike';
        }
        return strike;
      }
    }

  });

  return api_;
});
