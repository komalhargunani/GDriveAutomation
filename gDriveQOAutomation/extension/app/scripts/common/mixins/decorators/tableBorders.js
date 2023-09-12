define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/tableBorderUtils',
  'common/mixins/mixinUtils'
], function(
  DecoratorBase,
  TableBorderUtils,
  MixinUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['borders'],

    observers: [
      'bordersChanged_(model.tableProperties.borders)'
    ],

    /**
     * @return {object} The borders of the table.
     */
    get borders() {
      return (this.model &&
              this.model.tableProperties &&
              this.model.tableProperties.borders);
    },


    /**
     * Set the table borders in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {object} value table borders.
     */
    set borders(value) {
      this.setInModel_('tableProperties.borders', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {object} current the current value of table borders.
     */
    bordersChanged_: function(current) {
      this.unsetBorders_();
      if (current !== undefined) {
        // Set the table borders.
        this.setBorders_(current);
      }
      this.updateStyles();
    },


    /**
     * @return {object|undefined} the table borders.
     * NOTE: Does not use the computedStyles object, as the table borders are
     * applied to the table cells.
     */
    computedDecorations_: {
      borders: function(/* computedStyles */) {
        return this.borders;
      }
    },


    /**
     * Sets the table border for a given borders object. This sets the
     * correct CSS styling rules in the elements shadow root's style element.
     * @param {object} borders The borders of the table.
     */
    setBorders_: function(borders) {
      var border, cssText;
      for (var side in borders) {
        if (TableBorderUtils.isValidSide(side)) {
          border = borders[side];
          cssText = TableBorderUtils.cssText(side, border);
          this.customStyle['--' + side + '-border-style'] = cssText;
        }
      }
    },

    unsetBorders_: function() {
      this.customStyle['--top-border-style'] = '';
      this.customStyle['--bottom-border-style'] = '';
      this.customStyle['--left-border-style'] = '';
      this.customStyle['--right-border-style'] = '';
      this.customStyle['--insideHorizontal-border-style'] = '';
      this.customStyle['--insideVertical-border-style'] = '';
    }
  });

  return api_;

});
