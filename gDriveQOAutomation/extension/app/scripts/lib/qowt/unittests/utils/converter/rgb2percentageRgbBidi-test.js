/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Test suite for rgb2percentageRgb bi-directional converter
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('RGB 2 percentageRGB bi-directional converter', function() {

    it('should correctly convert RGB value to percentageRGB', function() {
      var RGBValue = 125;
      var percentageRgbVal = Converter.rgb2percentageRgb(RGBValue);
      expect(Math.round(percentageRgbVal)).toBe(49020);

      RGBValue = 255;
      percentageRgbVal = Converter.rgb2percentageRgb(RGBValue);
      expect(Math.round(percentageRgbVal)).toBe(100000);

      RGBValue = 128;
      percentageRgbVal = Converter.rgb2percentageRgb(RGBValue);
      expect(Math.round(percentageRgbVal)).toBe(50196);
    });

    it('should correctly convert percentageRGB to RGB value', function() {
      var percentageRgbVal = 49020;
      var RGBValue = Converter.percentageRgb2rgb(percentageRgbVal);
      expect(Math.round(RGBValue)).toBe(125);

      percentageRgbVal = 100000;
      RGBValue = Converter.percentageRgb2rgb(percentageRgbVal);
      expect(Math.round(RGBValue)).toBe(255);

      percentageRgbVal = 50196;
      RGBValue = Converter.percentageRgb2rgb(percentageRgbVal);
      expect(Math.round(RGBValue)).toBe(128);
    });
  });
});
