// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview one-way converter between numbers and
 * alphanumeric representation
 * NOTE: this follows MS Word's algorith:
 *   1 - a
 *   2 - b
 *   ...
 *   27 - aa
 *   28 - bb
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    from: 'num',
    to: 'alpha',

    'num2alpha': function(num) {
      var baseFactor = 26;
      var alphaStart = 97;
      var orderOfMagnitude = Math.floor(num / baseFactor) + 1;
      var character = String.fromCharCode(((num-1) % baseFactor) + alphaStart);

      return new Array(orderOfMagnitude+1).join(character);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});