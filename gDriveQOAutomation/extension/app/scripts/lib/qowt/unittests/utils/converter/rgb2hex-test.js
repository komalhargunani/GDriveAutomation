/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Test suite for rgb2hex converter
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('RGB 2 Hex converter', function() {

    it('should correctly convert RGB value to hex value', function() {
      var RGBValue = {
        r: 255,
        g: 150,
        b: 128
      };
      var hexVal = Converter.rgb2hex(RGBValue.r, RGBValue.g, RGBValue.b);
      expect(hexVal).toBe('#ff9680');

      RGBValue.r = 196;
      hexVal = Converter.rgb2hex(RGBValue.r, RGBValue.g, RGBValue.b);
      expect(hexVal).toBe('#c49680');
    });
  });
});
