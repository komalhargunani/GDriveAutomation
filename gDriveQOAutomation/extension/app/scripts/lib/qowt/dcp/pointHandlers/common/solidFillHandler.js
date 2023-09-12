/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Solid Fill handler.
 * Responsible for Solid fill
 *
 *
 * Solid fill JSON --
 * {
 "type":"solidFill",
 "clr":<hexadecimal color value>
 "scmClr":<hexadecimal color value or scheme color>
 "alpha":<opaque value between 0 and 1>
 "effects":<array of color effects>
 }
 *
 */

define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/drawing/color/colorUtility',

  'third_party/lo-dash/lo-dash.min'
], function(DeprecatedUtils, ColorUtility) {

  'use strict';

  /**
   * A constant for default color.
   * MS and GDoc fallback to 'black' if solidFill is specified without color
   *
   * @type {{type: string, clr: string}}
   * @const
   * @private
   */
  var _kDefaultColor = {
    type: 'srgbClr',
    clr: '000000'
  };

  /**
   * returns the style for the element
   * @param fill {Object} Fill JSON
   * @return style {String} css style of element
   */
  var _computeSolidFillStyle = function(fill) {
    var style = {};
    // MS and GDoc fallback to default if solidFill is specified without color
    var fillColor = fill.color || _getDefaultColor();
    var rgbaColor = ColorUtility.getColor(fillColor);
    if (rgbaColor) {
      style.background = rgbaColor;
    }
    return style;
  };

  /**
   * applies the styles to the text run element
   * @param elementStyle css style
   * @param element HTML element
   */
  var _applyStyleToElement = function(elementStyle, element) {
    for (var key in elementStyle) {
      element.style[key] = elementStyle[key];
    }
  };

  /**
   * Returns (cloned) default color to use when no color is available
   * @return {JSON} default color json
   */
  var _getDefaultColor = function() {
    return _.cloneDeep(_kDefaultColor);
  };

  var _api = {

    /**
     * sets the canvas context style for fill of solid-fill type
     * @param context canvas context
     * @param fillData shape color fill data
     * @param fillPathAttribute specifies the fill attribute given by path like
     * lighten, darken
     */
    fillCanvasContext: function(context, fillData, fillPathAttribute) {
      // MS and GDoc fallback to default if solidFill is specified without
      // color and styleFillRef is absent.
      var fillColor = fillData.color || _getDefaultColor();
      //handle theme color here
      var rgbaColor = ColorUtility.getColor(fillColor);
      if (rgbaColor) {
        var color = ColorUtility.handleLuminosity(rgbaColor, context,
            fillPathAttribute);

        context.fillStyle = color;
        context.fill();

      }
    },

    /**
     * returns the css style text for shape solid-fill property
     * @param fill {Object} The solid fill JSON
     * @return styleText The css style to be applied to placeHolder shape
     */
    getStyleString: function(fill) {
      return DeprecatedUtils.getElementStyleString(
        _computeSolidFillStyle(fill));
    },

    /**
     * Handle solid fill using HTML and CSS
     * @param fill The solid fill JSON
     * @param element The solid fill application target element
     */
    handleUsingHTML: function(fill, element) {
      var returnedStyle = _computeSolidFillStyle(fill);
      _applyStyleToElement(returnedStyle, element);
    }
  };

  return _api;
});
