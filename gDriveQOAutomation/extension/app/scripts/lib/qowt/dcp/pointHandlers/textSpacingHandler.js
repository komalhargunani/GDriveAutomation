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
 * Text spacing handler.
 *
 * JSON structure for text spacing from DCP is
 *{
 *  "format": <percentage> / <points>,
 *  "value": <text spacing value>
 *}
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(PointModel, UnitConversionUtils) {

  'use strict';


  var _properties, // Holds text paragraph properties
    _lineSpacing, // Holds line spacing JSON
    _lineSpacingValue, // Holds line spacing cached value
    _spacingBefore, // Holds spacing before JSON
    _spacingBeforeValue, // Holds spacing before cached value
    _spacingAfter, // Holds spacing after JSON
    _spacingAfterValue; // Holds spacing after cached value


  /*
   * Microsoft office renders single line spacing as 120% of font size.
   * line spacing needs to be corrected so that it is 120% of font size, as
   * normal HTML renderer uses 100% of font size as line spacing. Hence below is
   * the correction code which gets the line spacing, checks if its in percent
   * format, if in percent format then makes it 120%.
   * If line spacing is not in percent format then we don't do anythings as it
   * represented in font point size.
   */
  // FOR NOW DISABLING the 120% correction as that makes text go out of slide.
  var LINE_SPACE_CONSTANT = 1.2;

  /**
   * Initialize reused components
   */
  var _initialize = function() {
    _lineSpacing = _properties.lnSpc;
    _lineSpacingValue = undefined;
    _spacingBefore = _properties.spcBef;
    _spacingBeforeValue = undefined;
    _spacingAfter = _properties.spcAft;
    _spacingAfterValue = undefined;
  };

  /**
   * Applies the line space reduction on given line spacing.
   * @param originalLnSp original line spacing.
   */
  var _computeLnSpaceReduction = function(originalLnSp) {
    var lineSpaceRed = PointModel.textBodyProperties.lnSpcReduction;
    lineSpaceRed = lineSpaceRed !== undefined ? parseFloat(lineSpaceRed) : 0;
    return (originalLnSp - (originalLnSp * (lineSpaceRed / 100)));
  };

  /**
   * Calculate percentage value for line spacing
   * @param value to be calculated in percentage for line spacing
   * @return Calculated value in percentage for line spacing
   */
  var _lineSpacingPercentageCalculation = function(value) {
    if (value !== undefined && value.indexOf('%') !== -1) {
      var perLocation = value.indexOf('%');
      value = value.substring(0, perLocation);

      value = value * LINE_SPACE_CONSTANT;

      value = _computeLnSpaceReduction(value) / 100;
    }
    return value;
  };

  /**
   * Calculate percentage value for spacing before / spacing after
   * @param value to be calculated in in percentage for spacing before / spacing
   *              after
   * @return Calculated value in points for spacing before / spacing after
   */
  var _spacingBeforeAfterPercentageCalculation = function(value) {
    if (value !== undefined && value.indexOf('%') !== -1) {
      var perLocation = value.indexOf('%');
      value = value.substring(0, perLocation);
    }

    value = UnitConversionUtils.
      computePercentSpacing(PointModel.maxParaFontSize, value);
    return value += "pt";
  };

  /**
   * Compute spacing value for line spacing, spacing after, and spacing before
   * @param spacing either spacing after JSON or spacing before JSON
   * @param percentageCalculatorFunction the function to be used when format is
   *                                     in percentage
   * @param defaultValue the default value to be returned when calculated value
   *                     is undefined one
   * @return computed spacing value after caching it.
   */
  var _computeSpacingValue =
    function(spacing, percentageCalculatorFunction, defaultValue) {

    var value = defaultValue;
    if (spacing && spacing.format !== undefined &&
      spacing.value !== undefined) {
      var format = spacing.format;
      value = spacing.value;

      switch (format) {
        case "percentage":
          /*
           * This is Spacing Percent. Can be integer or suffixed by % sign.
           * Delegate it to UnitConversionUtils.
           * convertSTPercentageToCSSPercent() method to get value in percent
           * only
           */
          value = UnitConversionUtils.convertSTPercentageToCSSPercent(value);
          value = percentageCalculatorFunction(value);
          break;

        case "points":
          /*
           * This is Spacing Points. Always integer, unit is in font size
           * The size is specified using points where 100 is equal to 1 point
           * font
           */
          value = (value / 100);
          value = _computeLnSpaceReduction(value) + "pt";
          break;

        default:
          break;
      }
    }

    return value;
  };


  var _api = {
    /**
     * Set paragraph properties
     * @param properties the paragraph properties
     */
    setProperties: function(properties) {
      _properties = properties;
      _initialize();
    },

    /**
     * Get line spacing
     * @return line spacing for paragraph
     */
    getLineSpacing: function() {
      if (!_lineSpacingValue) {
        _lineSpacingValue =
          _computeSpacingValue(_lineSpacing, _lineSpacingPercentageCalculation,
            _computeLnSpaceReduction(LINE_SPACE_CONSTANT));
      }
      return _lineSpacingValue;
    },

    /**
     * Get spacing before
     * @return spacing before for paragraph
     */
    getSpacingBefore: function() {
      if (!_spacingBeforeValue) {
        _spacingBeforeValue = _computeSpacingValue(_spacingBefore,
          _spacingBeforeAfterPercentageCalculation);
      }
      return _spacingBeforeValue;
    },

    /**
     * Get spacing after
     * @return spacing after for paragraph
     */
    getSpacingAfter: function() {
      if (!_spacingAfterValue) {
        _spacingAfterValue = _computeSpacingValue(_spacingAfter,
          _spacingBeforeAfterPercentageCalculation);
      }
      return _spacingAfterValue;
    },

    /**
     * Check if spacingBefore is in points
     * @return {boolean} True if spacingBefore is in points false otherwise
     */
    isSpacingBeforeInPoints: function() {
      return _spacingBefore && _spacingBefore.format === 'points';
    },

    /**
     * Check if spacingAfter is in points
     * @return {boolean} True if spacingAfter is in points false otherwise
     */
    isSpacingAfterInPoints: function() {
      return _spacingAfter && _spacingAfter.format === 'points';
    }
  };

  return _api;
});
