define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests point to mm converter', function() {

    it('should correctly convert points to mm and back', function() {
      roundTrip_(2.834645669, 1);
      roundTrip_(0, 0);
      roundTrip_('15pt', 5.291666667);
      roundTrip_('301', 106.186111111);
    });

    it('should throw error when input is not convertible to a number',
        function() {
      shouldThrow_('hello');
      shouldThrow_({});
      shouldThrow_(function() {});
      shouldThrow_(true);
      shouldThrow_([]);
    });

    it('should gracefully handle undefined as an input', function() {
      assert.isUndefined(Converter.pt2mm(undefined));
      assert.isUndefined(Converter.mm2pt(undefined));
    });

    // Acceptable amount of error, given that we are doing floating point math
    var epsilon = 0.001;

    var roundTrip_ = function(pt, mm) {
      assert.isTrue(Converter.pt2mm(pt) > parseFloat(mm) - epsilon);
      assert.isTrue(Converter.pt2mm(pt) < parseFloat(mm) + epsilon);
      assert.isTrue(Converter.mm2pt(mm) > parseFloat(pt) - epsilon);
      assert.isTrue(Converter.mm2pt(mm) < parseFloat(pt) + epsilon);
    };

    var shouldThrow_ = function(badInput) {
      assert.throws(Converter.pt2mm.bind(this, badInput));
      assert.throws(Converter.mm2pt.bind(this, badInput));
    };
  });
});
