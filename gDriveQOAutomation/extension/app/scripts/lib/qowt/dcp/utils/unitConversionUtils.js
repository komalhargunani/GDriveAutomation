// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Utility functions for converting units.
 */


define([
  'qowtRoot/utils/typeUtils'
], function(TypeUtils) {

  'use strict';

  /*
    TODO: Atul Note the points per inch might not be actually 72. Same is the
    case with emu per inch and pixels per inch. However, as long as we use the
    same value everywhere then we should be ok, because the physical size we are
    trying to render will be relatively ok throughout the content.
   */
  var _kPointsPerInch = 72,
      _kEmuPerInch = 914400,
      _kPixelsPerInch = 96;

  var _api = {
    /*
     * Converts from EMU (English Metric Units) to Point units
     */
    convertEmuToPoint: function(emu) {
      if (emu === undefined) {
        return undefined;
      }

      var points;
      points = emu * _kPointsPerInch / _kEmuPerInch;

      return points;
    },

    /*
     * Converts from Point units to EMU (English Metric Units)
     * @param point {string | number} point value
     * @return {number} point equivalent emu
     */
    convertPointToEmu: function(point) {
      if (point === undefined) {
        return undefined;
      }

      point = TypeUtils.isString(point) ? parseFloat(point) : point;
      var emu = point * _kEmuPerInch / _kPointsPerInch;
      //Rounded off the value since EMUs cannot be fractional
      //http://en.wikipedia.org/wiki/Office_Open_XML_file_formats
      return Math.round(emu);
    },

    /*
     * Converts from Pixel units to Point units
     * @param pixel the pixel value
     * @return pixel equivalent points
     */
    convertPixelToPoint: function(pixel) {
      return pixel ? (pixel * _kPointsPerInch / _kPixelsPerInch) : pixel;
    },

    /*
     * Converts from Point units to Pixel units
     * @param point {string | number} point value
     * @return {number} point equivalent pixels
     */
    convertPointToPixel: function(point) {
      point = TypeUtils.isString(point) ? parseFloat(point) : point;
      var pixels = point ? (point * _kPixelsPerInch / _kPointsPerInch) : point;
      return pixels;
    },

    /*
     * Converts from EMU (English Metric Units) to Pixel units
     * @param emu EMU (English Metric Units)
     * @return emu equivalent pixels
     */
    convertEmuToPixel: function(emu) {
      if (emu === undefined) {
        return undefined;
      }

      var pixels;
      pixels = emu * _kPixelsPerInch / _kEmuPerInch;

      return pixels;
    },

    /**
     * TODO: To remove after HP fixes the bug of in-appropriate co-ordinate
     * handling within canvas
     * Converts from Pixel to EMU (English Metric Units) units
     * @param {string|number} pixels to convert into emu (English Metric Units)
     * @return {number} pixel equivalent emu
     */
    convertPixelToEmu: function(pixels) {
      if (pixels === undefined) {
        return undefined;
      }
      pixels = TypeUtils.isString(pixels) ? parseFloat(pixels) : pixels;
      var emu = pixels * _kEmuPerInch / _kPixelsPerInch;
      //Rounded off the value since EMUs cannot be fractional
      //http://en.wikipedia.org/wiki/Office_Open_XML_file_formats
      return Math.round(emu);
    },

    /**
     * This function converts given ECMA specification based STPercent to CSS
     * percentage value.
     * @param stPercent ECMA specification type value for St Percentage.
     */
    convertSTPercentageToCSSPercent: function(stPercent) {
      var cssPercent;
      if (stPercent !== undefined) {
        if ((typeof(stPercent) === 'string') && stPercent.indexOf('%') !== -1) {
          // If the stPercent contains "%" it means its of simple percentage
          // type. ECMA (20.1.10.40)
          cssPercent = stPercent;
        } else if (stPercent !== 0) {
          // Else stPercent is of St percentage decimal type. ECMA (20.1.10.41).
          // In this type, a value of 100000 is equal to 100%
          cssPercent = stPercent / 1000;
          cssPercent = cssPercent + "%";
        }

      }
      return cssPercent;
    },

    /**
     * This function computes the spacing in points, which is calculated as the
     * given percentage of the font-size
     * @param fontSize font size
     * @param spacingPercent percent of font-size (without % sign, float/decimal
     * only)
     * @return value of the given percentage of the font-size
     *
     */
    computePercentSpacing: function(fontSize, spacingPercent) {
      return spacingPercent * fontSize / 100;
    }

  };

  return _api;
});
