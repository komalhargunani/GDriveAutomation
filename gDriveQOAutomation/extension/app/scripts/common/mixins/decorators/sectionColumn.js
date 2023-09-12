define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['col'],

    observers: [
      'colChanged_(model.col)'
    ],

    get col() {
      return (this.model && this.model.col);
    },

    set col(value) {
      this.setInModel_('col', value);
    },

    colChanged_: function(current) {
      if (current !== undefined) {
        this.style['-webkit-column-count'] = current;
      }
    },

    computedDecorations_: {
      col: function(computedStyles) {
        var col;
        if (computedStyles) {
          col = computedStyles['-webkit-column-count'];
        }
        return col;
      }
    }

  });

  return api_;

});
