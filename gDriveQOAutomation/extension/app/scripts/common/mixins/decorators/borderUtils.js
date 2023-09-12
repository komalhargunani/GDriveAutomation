/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview small utility module to provide
 * common functions used by all border mixins
 *
 * @author ghyde@google.com (Greg Hyde)
 */
define([
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/stringUtils'
], function(
    Converter,
    StringUtils) {

  'use strict';

  var api_ = {
    /**
     * Sets the borders of the element.
     * @param {HTMLElement} element to be decorated with the borders object.
     * @param {object} borders object to be set to the element.
     */
    setBorders: function(element, borders) {
      for (var side in borders) {
        api_.setBorderSide(element, side, borders[side]);
      }
    },


    /**
     * Sets the border of the element for a particular side.
     * @param {HTMLElement} element to be decorated with the border.
     * @param {string} side border side.
     * @param {object} border to be set to the element.
     */
    setBorderSide: function(element, side, border) {
      if (border && isValidSide(side)) {
        if (border.style && border.style === 'nil') {
          element.style['border' + StringUtils.titleCase(side)] = 'none';
        } else {
          setBorderWidth_(element, side, border.width, border.style);
          setBorderStyle_(element, side, border.style);
          setBorderColor_(element, side, border.color);
        }
      }
    },


    /**
     * Unsets the borders of the element.
     * @param {HTMLElement} element to be undecorated with the borders.
     */
    unsetBorders: function(element) {
      element.style.border = '';
    },

    /**
     * Unsets the borders on one side of the element.
     * @param {HTMLElement} element to be undecorated.
     * @param {string} side to be undecorated
     */
    unsetBorderSide: function(element, side) {
      element.style['border' +  StringUtils.titleCase(side)] = '';
    },


    /**
     * List of border sides.
     */
    BORDER_SIDES: ['top', 'right', 'bottom', 'left']
  };

  // PRIVATE ===================================================================

  /**
   * @private
   * @return {boolean} true if the border side is valid, false otherwise.
   * @param {string} side border side.
   */
  var isValidSide = function(side) {
    return side && api_.BORDER_SIDES.indexOf(side) > -1;
  };


  var setBorderWidth_ = function(element, side, width, style) {
    if (width !== undefined && style !== undefined) {
      var widthUnit = 'pt';
      // double border will not render at standard resolution unless it is
      // at least 3 points: one for each border and one for the gap
      var minWidth = (style === 'double') ? 24 : 8;

      // Border Width as 1/8th point is converted to point.
      var appliedWidth = width === 0 ? 0 :
          Converter.eighthpt2pt(Math.max(minWidth, width));

      setBorderCSS_(element, side, 'Width', appliedWidth + widthUnit);
    }
  };


  var setBorderStyle_ = function(element, side, style) {
    if (style !== undefined) {
      setBorderCSS_(element, side, 'Style', style);
    }
  };


  var setBorderColor_ = function(element, side, color) {
    if (color !== undefined) {
      var appliedColor = (color === 'auto') ? '#000000' : color;
      setBorderCSS_(element, side, 'Color', appliedColor);
    }
  };


  /**
   * Actually sets border CSS for the given side
   * @param {HTMLNode} element The element we are applying borders to
   * @param {string} side The side to apply the css to
   * @param {string} property The border property to set (Width, Style, Color)
   * @param {string} value The desired value of the CSS property
   */
  var setBorderCSS_ = function(element, side, property, value) {
    element.style['border' + StringUtils.titleCase(side) + property] =
        value;
  };

  return api_;
});
