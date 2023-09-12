/**
 * @fileoverview bi-directional converter
 * between twips and pixel.
 * Twip is equal to 1/15th of a pixel.
 *
 * @see src/utils/converters/converter for usage
 */

define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var kTwip2PXRatio_ = 15;

  var _api = {
    from: 'twip',
    to: 'px',
    bidi: true,

    /**
     * Twip to pixel.
     *
     * @param {Number} twip value (as integer).
     * @return {Number} Millimeters value (as float).
     */
    'twip2px': function(twip) {
      if (!TypeUtils.isInteger(twip)) {
        throw new Error('Invalid non Integer input to twip2px');
      }
      return this.number2fixed((twip / kTwip2PXRatio_), 2);
    },

    /**
     * Pixel to Twip.
     *
     * @param {Number} pixels value (as float).
     * @return {Number} twip value (as integer).
     */
    'px2twip': function(pixels) {
      if (!TypeUtils.isNumber(pixels)) {
        throw new Error('Invalid non Number input to px2twip');
      }
      return Math.ceil(pixels * 15);
    }
  };

  return _api;
});
