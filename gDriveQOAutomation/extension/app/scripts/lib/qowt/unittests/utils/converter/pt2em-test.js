// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Tests points to em converter.
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */

define([
  'qowtRoot/utils/converters/converter',
  'qowtRoot/models/env'
], function(Converter, EnvModel) {

  'use strict';

  describe('tests point to em converter', function() {

    it('should correctly convert points to em and back', function() {
      _roundTrip(12, 1);
      _roundTrip('18', 1.5);
      _roundTrip(0, 0);
      _roundTrip('120pt', 10);
      _roundTrip(510, 42.5);
      _roundTrip(240, 20);
      _roundTrip('201', 16.75);
      _roundTrip(219, 18.25);
      _roundTrip('1557pt', 129.75);
      _roundTrip(6867, 572.25);
    });

    it('should throw error when input is not convertible to a number',
        function() {
          _validateErrorsThrown();
        });

    describe('In Point', function() {
      var previousPointsPerEm,
          previousFontUnit;

      beforeEach(function() {
        previousPointsPerEm = EnvModel.pointsPerEm;
        previousFontUnit = EnvModel.fontUnit;
        EnvModel.pointsPerEm = 1;
        EnvModel.fontUnit = 'em';
      });
      afterEach(function() {
        EnvModel.pointsPerEm = previousPointsPerEm;
        EnvModel.fontUnit = previousFontUnit;
      });

      it('should correctly convert points to em and back', function() {
        _roundTrip(1, 1);
        _roundTrip('1', 1);
        _roundTrip('1.5', 1.5);
        _roundTrip(0, 0);
        _roundTrip('120pt', 120);
        _roundTrip(5.1, 5.1);
        _roundTrip(5.85, 5.85);
        _roundTrip('1557pt', 1557);
      });

      it('should throw error when input is not convertible to a number',
          function() {
            _validateErrorsThrown();
          });
    });

    var _validateErrorsThrown = function() {
      _shouldThrow('hello');
      _shouldThrow({});
      _shouldThrow(function() {});
      _shouldThrow(true);
      _shouldThrow([]);
    };

    var _roundTrip = function(pt, em) {
      expect(Converter.pt2em(pt)).toBe(parseFloat(em));
      expect(Converter.em2pt(em)).toBe(parseFloat(pt));
    };

    var _shouldThrow = function(badInput) {
      expect(Converter.pt2em.bind(this, badInput)).toThrow();
      expect(Converter.em2pt.bind(this, badInput)).toThrow();
    };
  });
});
