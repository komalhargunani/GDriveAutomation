// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Tests twips to points converter.
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
  'qowtRoot/utils/converters/converter'
], function(
    Converter) {

  'use strict';

  describe('twip 2 point converter', function() {

    it('should correctly convert twips to points and back', function() {
      _roundTripTwip2Pt(20, 1);
      _roundTripTwip2Pt(1, 0.05);
      _roundTripTwip2Pt(0, 0);
      _roundTripTwip2Pt(110, 5.5);
      _roundTripTwip2Pt(500, 25);
      _roundTripTwip2Pt(240, 12);
      _roundTripTwip2Pt(201, 10.05);
      _roundTripTwip2Pt(217, 10.85);
      _roundTripTwip2Pt(1559, 77.95);
      _roundTripTwip2Pt(6869, 343.45);
    });

    it('should correctly convert points to twips and back', function() {
      _roundTripPt2Twip(1, 20);
      _roundTripPt2Twip(0.05, 1);
      _roundTripPt2Twip(0, 0);
      _roundTripPt2Twip(5.5, 110);
      _roundTripPt2Twip(25, 500);
      _roundTripPt2Twip(12, 240);
      _roundTripPt2Twip(10.05, 201);
      _roundTripPt2Twip(10.85, 217);
      _roundTripPt2Twip(77.95, 1559);
      _roundTripPt2Twip(343.45, 6869);
    });

    it ('should be able to get the same twip value after converting to points' +
        'and back', function() {
      var inputTwips = generateTwips();
      var outputTwips = runConversions(inputTwips);
      expect(inputTwips).toEqual(outputTwips);
    });

    it('should throw on non-numeric inputs', function() {
      _shouldThrow('3');
      _shouldThrow('hello');
      _shouldThrow({});
      _shouldThrow(true);
      _shouldThrow(function() {});
      _shouldThrow([]);
    });

    var _roundTripTwip2Pt = function(twip, pt) {
      expect(Converter.twip2pt(twip)).toBe(pt);
      expect(Converter.pt2twip(pt)).toBe(twip);
    };

    var _roundTripPt2Twip = function(pt, twip) {
      expect(Converter.pt2twip(pt)).toBe(twip);
      expect(Converter.twip2pt(twip)).toBe(pt);
    };

    var _shouldThrow = function(badInput) {
      expect(Converter.twip2pt.bind(this, badInput)).toThrow();
      expect(Converter.pt2twip.bind(this, badInput)).toThrow();
    };

    /**
     * For each cm value we create a corresponsing twip value.
     * These are twip values are the real values we expect to get
     * from Core as part of the OOXML file.
     *
     * @return {Array} twips array of input twip values.
     */
    var generateTwips = function() {
      var twips = [];
      var ranges = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
      for (var i = 0; i < 10; i++) {
        ranges.forEach(function(range) {
          twips.push(Math.round((i + range) * 567));
        });
      }
      return twips;
    };

    /**
     * Takes an array of input twips and first converts to point
     * and converts it back to twip, and stores it in output twips.
     *
     * @param {Array} inputTwips array of input twip values.
     * @return {Array} outputTwips array of output twip values.
     */
    var runConversions = function(inputTwips) {
      var outputTwips = [];
      inputTwips.forEach(function(twip) {
        var point = Converter.twip2pt(twip);
        outputTwips.push(Converter.pt2twip(point));
      });
      return outputTwips;
    };

  });
});
