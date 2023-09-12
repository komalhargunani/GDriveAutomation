/**
 * @fileoverview
 * Element decorator mixin for contextualSpacing.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['contextualSpacing'],

    observers: [
      'contextualSpacingChanged_(model.ppr.contextualSpacing)'
    ],

    get contextualSpacing() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.contextualSpacing);
    },

    set contextualSpacing(value) {
      this.setInModel_('ppr.contextualSpacing', value, [true, false]);
    },

    contextualSpacingChanged_: function(current) {
      if (current) {
        this.setAttribute(
          'data-contextual-spacing', current);
      } else {
        this.removeAttribute('data-contextual-spacing');
      }
    },

    computedDecorations_: {
      contextualSpacing: function() {
        return !!this.getAttribute('data-contextual-spacing');
      }
    }

  });

  return api_;

});
