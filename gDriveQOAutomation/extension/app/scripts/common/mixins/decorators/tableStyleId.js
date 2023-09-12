define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'
], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['styleId'],

    observers: [
      'styleIdChanged_(model.tableProperties.styleId)'
    ],

    /**
     * @return {string|undefined} The style id of the table.
     */
    get styleId() {
      return this.model &&
          this.model.tableProperties &&
          this.model.tableProperties.styleId;
    },


    /**
     * Set the table style id in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {string} value the table style id.
     */
    set styleId(value) {
      this.setInModel_('tableProperties.styleId', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {string} current the current value of table style id.
     */
    styleIdChanged_: function(current) {
      var tableStyles = document.getElementById('qowtTableStyles');
      if (this.previousTableStyleId_) {
        var previousCss = tableStyles.getCssClassName(
            this.previousTableStyleId_);
        this.classList.remove(previousCss);
      }
      if (current) {
        var newCss = tableStyles.getCssClassName(current);
        this.classList.add(newCss);
      }
      this.previousTableStyleId_ = current;
    },


    /**
     * @return {string|undefined} return the table style id for a given computed
     *    css style. Called by the DecoratorBase module.
     * NOTE: does not use the computedStyles object because at the moment we
     * only support an element having one style; ie it doesn't inherit.
     */
    computedDecorations_: {
      styleId: function(/* computedStyles */) {
        return this.styleId;
      }
    }

  });

  return api_;

});
