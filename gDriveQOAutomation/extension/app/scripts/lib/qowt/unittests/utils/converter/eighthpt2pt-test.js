/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Tests 1/8 points to points converter.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('an eighth point 2 point converter', function() {

    it('should correctly convert eighth point to points and back', function() {
      _roundTrip(8, 1);
      _roundTrip(1, 0.125);
      _roundTrip(0, 0);
      // usual values that we expect from Core.
      // Border widths.
      _roundTrip(2, 0.25); // 1/4 point
      _roundTrip(4, 0.5); // 1/2 point
      _roundTrip(6, 0.75); // 3/4 point
      _roundTrip(8, 1); // 1 point
      _roundTrip(12, 1.5); // 1 1/2 point
      _roundTrip(18, 2.25); // 2 1/4 point
      _roundTrip(24, 3); // 3 point
      _roundTrip(36, 4.5); // 4 1/2 point
      _roundTrip(48, 6); // 6 point
      // Random values.
      _roundTrip(110, 13.75);
      _roundTrip(500, 62.5);
      _roundTrip(240, 30);
      _roundTrip(201, 25.125);
      _roundTrip(217, 27.125);
      _roundTrip(1559, 194.875);
      _roundTrip(6869, 858.625);
    });

    it('should throw on non-numeric inputs', function() {
      _shouldThrow('3');
      _shouldThrow('hello');
      _shouldThrow({});
      _shouldThrow(true);
      _shouldThrow(function() {});
      _shouldThrow([]);
    });

    var _roundTrip = function(eightpt, pt) {
      expect(Converter.eighthpt2pt(eightpt)).toBe(pt);
      expect(Converter.pt2eighthpt(pt)).toBe(eightpt);
    };

    var _shouldThrow = function(badInput) {
      expect(Converter.eighthpt2pt.bind(this, badInput)).toThrow();
      expect(Converter.pt2eighthpt.bind(this, badInput)).toThrow();
    };
  });
});
