/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview bi-directional converter
 * between 1/8th points and points.
 *
 * Note that because of floating point calculations we are not always
 * guaranteed to have the conversions accurate (use with caution).
 *
 * @see src/utils/converters/converter for usage.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var _api = {
    from: 'eighthpt',
    to: 'pt',
    bidi: true,

    /**
     * 1/8th point to Point.
     *
     * @param {Number} eighthpt 1/8 point (as integer).
     * @return {Number} point (as float).
     */
    'eighthpt2pt': function(eighthpt) {
      if (!TypeUtils.isInteger(eighthpt)) {
        throw new Error(
            'Invalid non Integer input to eighthpt2pt');
      }
      return this.number2fixed((eighthpt / 8), 3);
    },

    /**
     * Point to 1/8th point.
     *
     * @param {Number} point value (as float).
     * @return {Number} 1/8th point (as integer).
     */
    'pt2eighthpt': function(point) {
      if (!TypeUtils.isNumber(point)) {
        throw new Error('Invalid non Number input to eighthpt2pt');
      }
      return Math.ceil(point * 8);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
