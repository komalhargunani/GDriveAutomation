// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview one-way converter between numbers and
 * roman numeral expresion, eg:
 *
 *   1 - I
 *   2 - II
 *   ...
 *   4 - IV
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    from: 'num',
    to: 'roman',


    'num2roman': function(num) {
      var lookup = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100,
        XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1},
        roman = '',
        i;
      for (i in lookup) {
        while (num >= lookup[i]) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});