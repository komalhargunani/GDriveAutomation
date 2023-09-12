/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple module to decorate existing html elements
 * with border formatting such as color, style, width...
 *
 * @author jelte@google.com (Jelte Liebrand)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/stringUtils'
], function(
    Converter,
    TypeUtils,
    StringUtils) {

  'use strict';

  var _api = {

    /**
     * Decorates the DOM element with the specified border formatting.
     * Note that the border width unit is 1/8th of a point.
     * Usage:
     * BorderDecorator.decorate({
     *   domNode, // HTML node
     *   { { top: {color: 'red'}, left: {style: 'solid'} } } // border object
     * });
     *
     * See the following schema for borders object:
     * @see pronto/src/dcp/schemas/model/properties/common/borders.json
     *
     * @param {Element} element A valid HTML element node to be decorated.
     * @param {Object} borders Container of border objects
     *                         describing the border formatting to be
     *                         applied to each side of the element.
     * @return {Object} object containing the border widths applied in points.
     */
    decorate: function(element, borders) {
      if (!TypeUtils.isNode(element)) {
        throw new Error('borderDecorator: invalid html element passed.');
      }

      _borderSizes = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };

      if (borders !== undefined) {
        for (var side in borders) {
          if (side && _borderSides.indexOf(side) > -1) {
            _setBorderWidth(element, side, borders[side], borders.unit);
            _setBorderStyle(element, side, borders[side]);
            _setBorderColor(element, side, borders[side]);
          }
        }
      }

      // JELTE TODO: why are we returning the border size??
      return _borderSizes;
    },

    /**
     * Undecorates the DOM element of any previously specified border formatting
     *
     * @param {Element} element A valid element node to be undecorated.
     */
    undecorate: function(element) {
      if (!TypeUtils.isNode(element)) {
        throw new Error('borderDecorator: invalid html element passed.');
      }

      element.style.border = '';
    }
  };

  //
  // Private.
  //

  /**
   * @private
   * Contains the border width for each side.
   */
  var _borderSizes;

  /**
   * @private
   * List of supported border sides.
   */
  var _borderSides = ['top', 'right', 'bottom', 'left'];

  function _setBorderWidth(element, side, border, opt_unit) {
    if (border && border.width !== undefined) {
      var appliedWidth, minWidth = 8;
      // Default unit of width is 1/8th of a point.
      var widthUnit = opt_unit || 'pt';
      // Ensure border width is never below a certain value,
      // so that the borders can be displayed at standard resolution.
      if (widthUnit === 'pt') {
        // double border will not render at standard resolution unless it is
        // at least 3 points: one for each border and one for the gap
        if (border.style === 'double') {
          minWidth = 24;
        }
        // Border Width as 1/8th point is converted to point.
        appliedWidth = Converter.eighthpt2pt(Math.max(minWidth, border.width));
        element.style['border' + StringUtils.titleCase(side) + 'Width'] =
            appliedWidth + widthUnit;
        _borderSizes[side] = appliedWidth;
      }
    }
  }

  function _setBorderStyle(element, side, border) {
    if (border && border.style !== undefined) {
      element.style['border' + StringUtils.titleCase(side) + 'Style'] =
          border.style;
    }
  }

  function _setBorderColor(element, side, border) {
    if (border && border.color !== undefined) {
      var color = (border.color === 'auto') ? '#000000' : border.color;
      element.style['border' + StringUtils.titleCase(side) + 'Color'] = color;
    }
  }

  return _api;
});
