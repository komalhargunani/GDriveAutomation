define([
  'qowtRoot/utils/sheet-lo-dash'
], function() {

  'use strict';

  describe('Test sheet-lo-dash', function() {

    describe('Test _.isValidIdx()', function() {

      it('should return true if index is positive integer', function() {
        assert.isTrue(_.isValidIdx(1));
        assert.isTrue(_.isValidIdx(10));
        assert.isTrue(_.isValidIdx(1000));
      });


      it('should return true if index is zero', function() {
        assert.isTrue(_.isValidIdx(0));
      });


      it('should return false if index is negative integer', function() {
        assert.isFalse(_.isValidIdx(-1));
        assert.isFalse(_.isValidIdx(-10));
        assert.isFalse(_.isValidIdx(-1000));
      });


      it('should return false if index is undefined', function() {
        assert.isFalse(_.isValidIdx(undefined));
      });


      it('should return false if index is false', function() {
        assert.isFalse(_.isValidIdx(false));
      });


      it('should return false if index is null', function() {
        assert.isFalse(_.isValidIdx(null));
      });


      it('should return false if index is NaN', function() {
        assert.isFalse(_.isValidIdx(NaN));
      });


      it('should return false if index is a fraction', function() {
        assert.isFalse(_.isValidIdx(3 / 2));
      });
    });


    describe('Test _.areValidIdx()', function() {

      it('should return true if all indices are positive integer', function() {
        assert.isTrue(_.areValidIdx(1, 10, 50, 100));
        assert.isTrue(_.areValidIdx(1, 1000));
        assert.isTrue(_.areValidIdx(1000, 80, 500, 1600, 1, 1, 4, 5));
      });


      it('should return true if all indices are zero', function() {
        assert.isTrue(_.areValidIdx(0, 0, 0));
        assert.isTrue(_.areValidIdx(0, 0, 0, 0, 0, 0));
      });


      it('should return false if any or all of the indices are negative' +
          ' integer', function() {
            assert.isFalse(_.areValidIdx(-1, -10, -5, -667));
            assert.isFalse(_.areValidIdx(-10, 10, 8, -9, 1));
            assert.isFalse(_.areValidIdx(-1000, -9, 90));
          });


      it('should return false if any or all indices are undefined', function() {
        assert.isFalse(_.areValidIdx(1, 2, undefined));
        assert.isFalse(_.areValidIdx(undefined, undefined, undefined));
      });


      it('should return false if any or all indices are false', function() {
        assert.isFalse(_.areValidIdx(false, 22));
        assert.isFalse(_.areValidIdx(false, false, false));
      });


      it('should return false if any or all indices are null', function() {
        assert.isFalse(_.areValidIdx(null, 5));
        assert.isFalse(_.areValidIdx(null, null, null));
      });


      it('should return false if any or all indices are NaN', function() {
        assert.isFalse(_.areValidIdx(45, 6, NaN));
        assert.isFalse(_.areValidIdx(NaN, NaN, NaN));
      });


      it('should return false if any or all indices are fraction', function() {
        assert.isFalse(_.areValidIdx(2, 3, 5, 3 / 2));
        assert.isFalse(_.areValidIdx(3 / 2, 6 / 7, 8 / 9));
      });


      it('should return false if the argument list is empty', function() {
        assert.isFalse(_.areValidIdx());
      });


      it('should throw an error if a single argument is passed', function() {
        var errMsg = 'Prefer using _.isValidIdx() to verify single idx, ' +
            'that\'ll be more readability';
        assert.throws(function() {
          _.areValidIdx(1);
        }, errMsg);
      });
    });


    describe('Test _.isValidCell()', function() {

      it('should return true if rowIdx and colIdx are positive ' +
          'integers', function() {
            var cellXY = {rowIdx: 1, colIdx: 200};
            var cellPQ = {rowIdx: 700, colIdx: 600};
            assert.isTrue(_.isValidCell(cellXY));
            assert.isTrue(_.isValidCell(cellPQ));
          });


      it('should return true if rowIdx/ colIdx or both is/ are zero',
          function() {
            var cellA7 = {rowIdx: 8, colIdx: 0};
            var cellH1 = {rowIdx: 0, colIdx: 7};
            var cellA1 = {rowIdx: 0, colIdx: 0};
            assert.isTrue(_.isValidCell(cellA7));
            assert.isTrue(_.isValidCell(cellH1));
            assert.isTrue(_.isValidCell(cellA1));
          });


      it('should return false if rowIdx/ colIdx or both is/ are negative ' +
          'integer(s)', function() {
            var cellXY = {rowIdx: -1, colIdx: 200};
            var cellPQ = {rowIdx: 70, colIdx: -60};
            var cellMN = {rowIdx: -70, colIdx: -60};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });


      it('should return false if rowIdx/ colIdx or both is/ are undefined',
          function() {
            var cellXY = {rowIdx: 1, colIdx: undefined};
            var cellPQ = {rowIdx: undefined, colIdx: 60};
            var cellMN = {rowIdx: undefined, colIdx: undefined};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });


      it('should return false if rowIdx/ colIdx or both is/ are NaN',
          function() {
            var cellXY = {rowIdx: 1, colIdx: NaN};
            var cellPQ = {rowIdx: NaN, colIdx: 60};
            var cellMN = {rowIdx: NaN, colIdx: NaN};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });


      // The following scenarios are rare in our app. It is safer though to
      // test these scenario's just so that even accidentally we would not end
      // up returning true if such a scenario ever occurs.
      it('should return false if rowIdx/ colIdx or both is/ are false',
          function() {
            var cellXY = {rowIdx: 1, colIdx: false};
            var cellPQ = {rowIdx: false, colIdx: 60};
            var cellMN = {rowIdx: false, colIdx: false};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });


      it('should return false if rowIdx/ colIdx or both is/ are null',
          function() {
            var cellXY = {rowIdx: 1, colIdx: null};
            var cellPQ = {rowIdx: null, colIdx: 60};
            var cellMN = {rowIdx: null, colIdx: null};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });


      it('should return false if rowIdx/ colIdx or both is/ are fractions',
          function() {
            var cellXY = {rowIdx: 1, colIdx: (3 / 5)};
            var cellPQ = {rowIdx: (5 / 3), colIdx: 60};
            var cellMN = {rowIdx: (7 / 6), colIdx: (11 / 5)};
            assert.isFalse(_.isValidCell(cellXY));
            assert.isFalse(_.isValidCell(cellPQ));
            assert.isFalse(_.isValidCell(cellMN));
          });
    });


    describe('Test _.areUndefined()', function() {
      it('should return true if all the args are undefined', function() {
        assert.isTrue(_.areUndefined(undefined, undefined));
        assert.isTrue(_.areUndefined(undefined, undefined, undefined));
      });


      it('should return false if some/ all args are defined', function() {
        assert.isFalse(_.areUndefined(false, undefined));
        assert.isFalse(_.areUndefined(undefined, 1, false, true, undefined));
        assert.isFalse(_.areUndefined({}, '', undefined));
        assert.isFalse(_.areUndefined(1, '', 3));
      });


      it('should throw error if a single argument is passed', function() {
        var errMsg = 'Prefer using _.isUndefined() to verify single ' +
            'value, that\'ll be more readability';
        assert.throws(function() {
          _.areUndefined('someArg');
        }, errMsg);
      });
    });
  });
});
