
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

  describe('num 2 alpha converter', function() {

    beforeEach(function() {
    });
    afterEach(function() {
    });

    var testMap = {
      1: 'a',
      25: 'y',
      39: 'mm',
      80: 'bbbb'
    };

    it('should follow MS Word alpha numbering when converting', function() {
      for (var num in testMap) {
        expect(Converter.num2alpha(num)).toBe(testMap[num]);
      }
    });

  });

  return {};
});

