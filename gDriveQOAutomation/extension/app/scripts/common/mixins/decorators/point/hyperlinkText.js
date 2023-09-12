define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils'],
function(DecoratorBase,
         MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['hyperlink'],

    observers: [
      'linkChanged_(model.rpr.hyperlink)'
    ],

    get hyperlink() {
      return (this.model && this.model.rpr && this.model.rpr.hyperlink);
    },

    set hyperlink(value) {
      this.setInModel_('rpr.hyperlink', value);
    },

    /**
     * Data observer for when the model changes.
     * @param {object} current The new value
     */
    linkChanged_: function(current) {
      var targetLink;
      if (current) {
        targetLink = current.target || current.action;
      }
      if (targetLink !== undefined) {
        this.setAttribute('link', targetLink);
      } else {
        this.removeAttribute('link');
      }
    },

    getLink: function() {
      return this.getAttribute('link') || undefined;
    }
  });

  return api_;
});
