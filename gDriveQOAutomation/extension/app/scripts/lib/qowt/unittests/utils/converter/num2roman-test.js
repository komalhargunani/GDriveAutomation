
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview WRITE ME
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('num 2 roman converter', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    var testMap = {
      1: 'I',
      25: 'XXV',
      39: 'XXXIX',
      80: 'LXXX'
    };

    it('should correctly convert numeric to roman numeral', function() {
      for (var num in testMap) {
        expect(Converter.num2roman(num)).toBe(testMap[num]);
      }
    });

  });

  return {};
});

