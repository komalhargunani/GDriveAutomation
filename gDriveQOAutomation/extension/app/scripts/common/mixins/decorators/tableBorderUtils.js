define([
  'common/mixins/decorators/borderUtils'
], function(
  BorderUtils) {

  'use strict';

  var api_ = {
    /**
     * @return {string} the cssText string for passed in table border object for
     *     a given table border side.
     * @param {string} side border side like 'top'.
     * @param {object} border Table border {color: 'red', style: 'solid'}
     */
    cssText: function(side, border) {
      if (side === 'insideHorizontal') {
        // Apply the bottom border for all cells
        // in all table rows except the last one.
        side = 'bottom';
      } else if (side === 'insideVertical') {
        // Apply the right border for all cells
        // except the last one in all table rows.
        side = 'right';
      }
      // Decorate a dummy element with the border
      // and then return the css text style.
      var dummyNode = window.document.createElement('div');
      BorderUtils.setBorderSide(dummyNode, side, border);
      return dummyNode.style.cssText;
    },


    /**
     * @return {string} the CSS selectors to select the appropriate set of table
     *     cells to which the table border would be applied.
     * @param {string} side table border side.
     */
    cssSelector: function(side) {
      return CSS_SELECTOR[side];
    },


    /**
     * @return {boolean} true if table border side is valid, false otherwise.
     * @param {string} side table border side.
     */
    isValidSide: function(side) {
      return side && (BORDER_SIDES.indexOf(side) > -1);
    }
  };

  // PRIVATE

  /**
   * @private
   * List of table border sides (inside and outside).
   */
  var BORDER_SIDES = ['top', 'right', 'bottom', 'left',
                      'insideHorizontal', 'insideVertical'];

  /**
   * @private
   * CSS selector to select appropriate table cells for table borders.
   */
  var CSS_SELECTOR = {
    // Top Border: First row -> All Cells.
    top: 'tr:first-child > td',
    // Right Border: All Table Rows -> Last Cell.
    right: 'tr > td:last-child',
    // Bottom Border: Last Row -> All Cells.
    bottom: 'tr:last-child > td',
    // Left Border: All Rows -> First Child.
    left: 'tr > td:first-child',
    // Inside Horizontal Border: All Rows (except the last row) -> All Cells.
    insideHorizontal: 'tr:not(:last-child) > td',
    // Inside Vertical Border: All Rows -> All Cells (except the last cell).
    insideVertical: 'tr > td:not(:last-child)'
  };

  return api_;
});
