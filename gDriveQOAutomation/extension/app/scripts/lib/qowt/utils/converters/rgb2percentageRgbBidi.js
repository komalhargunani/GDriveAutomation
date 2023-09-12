/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview bi-directional converter
 * between RGB values and Percentage RGB values.
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([], function() {

  'use strict';

  var _kPercentageColorMaxPercent = 100000;

  var _api = {
    from: 'rgb',
    to: 'percentageRgb',
    bidi: true,

    /**
     * Converts the rgb into percentage rgb.
     *
     * @param component A/R/G/B color component
     * @return component A/R/G/B in percentage color component
     */
    rgb2percentageRgb: function(component) {
      return (_kPercentageColorMaxPercent * component / 255);
    },

    /**
     * Converts the RGB component into percentageRGB.
     *
     * @param component R/G/B component
     * @return component percentageRGB
     */
    percentageRgb2rgb: function(component) {
      var rgbVal = component * 255 / _kPercentageColorMaxPercent;
      return ( rgbVal <= 255 ? rgbVal : 255 );
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});