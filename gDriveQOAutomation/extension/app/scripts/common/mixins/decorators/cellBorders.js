define([
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/borderUtils',
  'common/mixins/mixinUtils',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/stringUtils'
], function(
    DecoratorBase,
    BorderUtils,
    MixinUtils,
    Converter,
    StringUtils) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['borders'],

    observers: [
      'bordersChanged_(model.cpr.borders)'
    ],

    /**
     * @return {object} The borders of the table cell.
     */
    get borders() {
      return (this.model &&
              this.model.cpr &&
              this.model.cpr.borders);
    },


    /**
     * Set the table cell borders in the model.
     * Note: we keep the true value in the model.
     * Note: these setters and getters match the property names of the dcp
     * schema which is our one and single definition of the model.
     *
     * @param {object} value table cell borders.
     */
    set borders(value) {
      this.setInModel_('cpr.borders', value);
    },


    /**
     * Data observer for when the model changes, at which point we style the
     * element according to the new value.
     *
     * @param {object} current the current value of table cell borders.
     */
    bordersChanged_: function(current) {
      if (current !== undefined) {
        // Set the table cell borders.
        BorderUtils.setBorders(this, current);
      } else {
        // Unset the table cell borders.
        BorderUtils.unsetBorders(this);
      }
    },


    /**
     * @return {object|undefined} the table cell borders for a given computed
     *    css style. Called by the DecoratorBase module.
     */
    computedDecorations_: {
      borders: function(computedStyles) {
        return this.borders || computedBorders_(computedStyles);
      }
    }
  });


  /**
   * @return {object} table cell borders object from the computedStyles object.
   * @param {object} computedStyles CSSStyleDeclaration object.
   */
  function computedBorders_(computedStyles) {
    var borders = {}, border;
    BorderUtils.BORDER_SIDES.forEach(function(side) {
      border = convertBorder_(computedStyles, side);
      if (!isEmpty_(border)) {
        borders[side] = border;
      }
    });
    return borders;
  }


  /**
   * @return {object} border object converted from the computed styles to the
   *    DCP border object.
   * @param {object} computedStyles CSSStyleDeclaration object.
   * @param {string} border side.
   */
  function convertBorder_(computedStyles, side) {
    var border = {};
    border.style = computedStyles[
      'border' + StringUtils.titleCase(side) + 'Style'];
    border.width = Converter.pt2twip(Converter.cssSize2pt(computedStyles[
      'border' + StringUtils.titleCase(side) + 'Width']));
    border.color = Converter.colorString2hex(computedStyles[
      'border' + StringUtils.titleCase(side) + 'Color']);
    return border;
  }


  /**
   * @return {bool} true if the border is empty, false otherwise.
   * @param {object} table cell border object.
   */
  function isEmpty_(border) {
    return (!border || (border.style === 'none' &&
        border.color === '#000000' && border.width === 0));
  }

  return api_;

});
