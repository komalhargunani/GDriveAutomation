/**
 * @fileoverview bi-directional converter
 * between twips and Millimeters.
 * Twip is equal to 1/56.7th of a Millimeter.
 *
 * @see src/utils/converters/converter for usage
 */

define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var kTwip2MMRatio_ = 56.7;

  var _api = {
    from: 'twip',
    to: 'mm',
    bidi: true,

    /**
     * Twip to Millimeters.
     *
     * @param {Number} twip value (as integer).
     * @return {Number} Millimeters value (as float).
     */
    'twip2mm': function(twip) {
      if (!TypeUtils.isInteger(twip)) {
        throw new Error('Invalid non Integer input to twip2mm');
      }
      return this.number2fixed((twip / kTwip2MMRatio_), 2);
    },

    /**
     * Millimeters to Twip.
     *
     * @param {Number} millimeters value (as float).
     * @return {Number} twip value (as integer).
     */
    'mm2twip': function(millimeters) {
      if (!TypeUtils.isNumber(millimeters)) {
        throw new Error('Invalid non Number input to mm2twip');
      }
      return Math.ceil(millimeters * kTwip2MMRatio_);
    }
  };

  return _api;
});
