define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'
], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['styleSettings'],

    observers: [
      'styleSettingsChanged_(model.tableProperties.styleSettings)'
    ],

    /**
     * @return {Array<string>|undefined} The style settings of the table.
     */
    get styleSettings() {
      return this.model &&
          this.model.tableProperties &&
          this.model.tableProperties.styleSettings;
    },


    /**
     * Set the table style settings in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {Array<string>} value the table style settings.
     */
    set styleSettings(value) {
      this.setInModel_('tableProperties.styleSettings', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {Array<string>} current the current value of table style settings.
     */
    styleSettingsChanged_: function(current) {
      STYLE_SETTINGS.forEach(function(setting) {
        this.removeAttribute(setting);
      }.bind(this));
      if (current && _.isArray(current)) {
        current.forEach(function(setting) {
          this.setAttribute(setting, true);
        }.bind(this));
      }
    },


    /**
     * @return {Array<string>|undefined} return the table style settings for a
     *     given computed css style. Called by the DecoratorBase module.
     * NOTE: does not use the computedStyles object.
     */
    computedDecorations_: {
      styleSettings: function(/* computedStyles */) {
        return this.styleSettings;
      }
    }

  });

  /**
   * @private Style Settings of a Table.
   */
  var STYLE_SETTINGS = ['firstrow', 'lastrow', 'firstcolumn', 'lastcolumn',
                        'horizontalbanding', 'verticalbanding'];

  return api_;

});
