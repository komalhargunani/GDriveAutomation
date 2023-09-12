/**
 * @fileoverview bi-directional converter
 * between twips and points.
 * Twip is equal to 1/20th of a point.
 *
 * Note that because of floating point calculations we are not always
 * guaranteed to have the conversions accurate (use with caution).
 *
 * @see src/utils/converters/converter for usage
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var _api = {
    from: 'twip',
    to: 'pt',
    bidi: true,

    /**
     * Twip to Point.
     *
     * @param {Number} twip value (as integer).
     * @return {Number} point value (as float).
     */
    'twip2pt': function(twip) {
      if (!TypeUtils.isInteger(twip)) {
        throw new Error('Invalid non Integer input to twip2pt');
      }
      return this.number2fixed((twip / 20), 2);
    },

    /**
     * Point to Twip.
     *
     * @param {Number} point value (as float).
     * @return {Number} twip value (as integer).
     */
    'pt2twip': function(point) {
      if (!TypeUtils.isNumber(point)) {
        throw new Error('Invalid non Number input to pt2twip');
      }
      return Math.ceil(point * 20);
    }
  };

  return _api;
});
