define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
  MixinUtils,
  DecoratorBase) {

  "use strict";

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['level'],

    observers: [
      'levelChanged_(model.ppr.level)'
    ],

    /** @return {number} The level of the paragraph. */
    get level() {
      return (this.model && this.model.ppr && this.model.ppr.level);
    },

    /**
     * Set the level in the model.
     * @param {number} value The level of the paragraph.
     */
    set level(value) {
      this.setInModel_('ppr.level', value);
    },

    /**
     * Data observer for when the model changes.
     * @param {number} current The new value
     */
    levelChanged_: function(current) {
      if (current !== undefined) {
        this.setAttribute('qowt-level', current);
      } else {
        this.removeAttribute('qowt-level');
      }
    },

    /**
     * @return {!{level: function(CSSStyleDeclaration): number}} The level
     *     setting for a given element. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      level: function(/* computedStyles */) {
        // Level defaults to 0 if unspecified.
        return this.level || 0;
      }
    }
  });

  return api_;
});
