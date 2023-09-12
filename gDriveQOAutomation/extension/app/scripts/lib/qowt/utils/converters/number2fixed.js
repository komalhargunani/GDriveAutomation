/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Helper module for converter.
 *
 * @see src/utils/converters/converter for usage.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([], function() {

  'use strict';

  var _api = {
    from: 'number',
    to: 'fixed',
    bidi: false,

    /**
     * Formats a number using fixed-point notation,
     * keeping specified number of decimals.
     * This module gives the control on how the decimal points are rounded off.
     * Preferred over Number.toFixed
     *
     * @param {Number} number to format.
     * @param {Number} precision number of digits to appear after decimal point.
     * @return {Number} formatted number.
     */
    'number2fixed' : function(number, precision) {
      var multiplier = Math.pow(10, precision);
      return Math.round(number * multiplier) / multiplier;
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
