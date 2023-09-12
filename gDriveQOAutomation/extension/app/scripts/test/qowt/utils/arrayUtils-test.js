/**
 * @fileoverview
 * Mocha based unit test for the array utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/arrayUtils'], function(
  ArrayUtils) {

  'use strict';

  describe('Array Utils.', function() {
    var testArray;
    describe('subset()', function() {
      it('Should return false if parameters are not arrays', function() {
        assert.isFalse(ArrayUtils.subset(), 'no params');
        assert.isFalse(ArrayUtils.subset(1), 'number, undef');
        assert.isFalse(ArrayUtils.subset('a'), 'string, undef');
        assert.isFalse(ArrayUtils.subset([]), 'array, undef');
        assert.isFalse(ArrayUtils.subset([], 1), 'array, number');
        assert.isFalse(ArrayUtils.subset([], 'a'), 'array, string');
        assert.isFalse(ArrayUtils.subset(undefined, []), 'undef, array');
        assert.isFalse(ArrayUtils.subset(1, []), 'number, array');
        assert.isFalse(ArrayUtils.subset('a', []), 'string, array');
        assert.isFalse(ArrayUtils.subset(1, 1), 'number, number');
        assert.isFalse(ArrayUtils.subset('a', 'a'), 'string, string');
        assert.isFalse(ArrayUtils.subset(true, false), 'bool, bool');
        assert.isFalse(ArrayUtils.subset(false, true), 'bool, bool');
      });
      it('Empty array should be a subset of empty arrray', function() {
        assert.isTrue(
          ArrayUtils.subset([], []),
          'empty array subset empty array');
      });
      it('Should match subsets', function() {
        assert.isTrue(
          ArrayUtils.subset([2], [1, 2, 3]),
          'match a number subset');
        assert.isTrue(
          ArrayUtils.subset([69, 99], [6, 9, 69, 99]),
          'match numbers subset');
        assert.isTrue(
          ArrayUtils.subset(['a'], ['c', 'b', 'a']),
          'match a string subset');
        assert.isTrue(
          ArrayUtils.subset(['red', 'blue'], ['red', 'green', 'blue']),
          'match strings subset');
        assert.isTrue(
          ArrayUtils.subset([true], [true, false]),
          'match a boolean subset');
        assert.isTrue(
          ArrayUtils.subset([true, false], [true, false]),
          'match booleans subset');
        assert.isTrue(
          ArrayUtils.subset(
            [1, 'a', true],
            [3, 2, 1, 'c', 'b', 'a', false, true]),
          'match mixed subset');
      });
      it('Should not match non-subsets', function() {
        assert.isFalse(
          ArrayUtils.subset([2], [4, 5, 6]),
          'match a number subset');
        assert.isFalse(
          ArrayUtils.subset([69, 99], [16, 19, 169, 99]),
          'match numbers subset');
        assert.isFalse(
          ArrayUtils.subset(['a'], ['f', 'e', 'd']),
          'match a string subset');
        assert.isFalse(
          ArrayUtils.subset(['red', 'blue'], ['blue', 'yellow', 'pink']),
          'match strings subset');
        assert.isFalse(
          ArrayUtils.subset([true], [!true, false]),
          'match a boolean subset');
        assert.isFalse(
          ArrayUtils.subset([true, false], [!true, false]),
          'match booleans subset');
        assert.isFalse(
          ArrayUtils.subset(
            [1, 'a', true],
            [6, 5, 4, 'f', 'e', 'd', false, !true]),
          'match mixed subset');
      });
      it('Should not deep match nested objects or arrays', function() {
        // Array.indexOf uses identity equality [] === [] is false
        //                                      {} === {} is false
        assert.isFalse(
          ArrayUtils.subset([{}], [{}]),
          'not match nested objects');
        assert.isFalse(
          ArrayUtils.subset([[]], [[]]),
          'not match nested objects');
      });
      it('Should not match number of elements', function() {
        assert.isTrue(
          ArrayUtils.subset([1, 1, 1], [1, 2, 3]),
          'subset non-unique');
        assert.isTrue(
          ArrayUtils.subset([1], [1, 1, 1]),
          'superset non-unique');
      });
    });

    describe('equal()', function() {
      it('Should compare simple arrays', function() {
        assert.isFalse(ArrayUtils.equal(), 'none');
        assert.isFalse(ArrayUtils.equal([]), 'array');
        assert.isFalse(ArrayUtils.equal([1], []), 'num, array');
        assert.isTrue(ArrayUtils.equal([], []), 'array, array');
        assert.isTrue(ArrayUtils.equal([1,2,3], [1,2,3]), 'num, num');
        assert.isFalse(ArrayUtils.equal([1,2,3], ['1','2','3']), 'num, str');
        assert.isTrue(ArrayUtils.equal(['abc'], ['abc']), 'str, str');
        assert.isFalse(ArrayUtils.equal(['abc'], ['def']), 'str, str2');
        assert.isTrue(ArrayUtils.equal([1,'a'], [1,'a']), 'mix, mix');
        assert.isFalse(ArrayUtils.equal([1,'a'], ['a',1]), 'mix, mix2');
      });
      it('Should compare nested arrays', function() {
        assert.isTrue(ArrayUtils.equal([[]], [[]]), 'array, array');
        assert.isTrue(ArrayUtils.equal([1,[2],3], [1,[2],3]), 'num, num');
        assert.isFalse(ArrayUtils.equal([1,[2],3], [3,[2],1]), 'num, num2');
        assert.isFalse(ArrayUtils.equal([1,[2],3], [1,['2'],3]), 'num, str');
      });
      it('Should compare arrays with object references', function() {
        var objA = {'a':'a'},
            objB = {'b':'b'};
        assert.isTrue(ArrayUtils.equal([objA], [objA]), 'a, a');
        assert.isFalse(ArrayUtils.equal([objA], [objB]), 'a, b');
        assert.isTrue(ArrayUtils.equal([objA, objA], [objA, objA]), 'aa, aa');
        assert.isFalse(ArrayUtils.equal([objA, objA], [objA, objB]), 'aa, ab');
        assert.isTrue(ArrayUtils.equal([1, objA, 'c'], [1, objA, 'c']), 'mix');
        assert.isTrue(ArrayUtils.equal([1, [objA], 3], [1, [objA], 3]), 'mix2');
        // Object literals are not equal.
        assert.isFalse(ArrayUtils.equal([{'a':'a'}], [{'a':'a'}]), 'obj');
      });
    });

    describe('moveItem()', function() {
      beforeEach(function() {
        testArray = [1, 'a', true];
      });
      afterEach(function() {
        testArray = undefined;
      });
      it('Should not modify the array for invalid index', function() {
        ArrayUtils.moveItem(testArray, undefined, 1);
        assert.deepEqual(
          testArray, [1, 'a', true],
          'oldIndex invalid');
        ArrayUtils.moveItem(testArray, 1, undefined);
        assert.deepEqual(
          testArray, [1, 'a', true],
          'newIndex invalid');
      });
      it('Should move item to new index in the array', function() {
        ArrayUtils.moveItem(testArray, 0, 2);
        assert.deepEqual(
          testArray, ['a', true, 1],
          'move item 0 to item 2');
      });
    });

    describe('unique()', function() {
      beforeEach(function() {
        testArray = [1, 1, 1, 2, 2, 2, 3, 3, 3];
      });
      afterEach(function() {
        testArray = undefined;
      });
      it('Should be able to make an array unique', function() {
        assert.deepEqual(
          ArrayUtils.unique(testArray), [1, 2, 3],
          'de-dupe array');
      });
    });

    describe('removeElement()', function() {
      beforeEach(function() {
        testArray = ['a', 'b', 'b', 'c'];
      });
      afterEach(function() {
        testArray = undefined;
      });
      it('Should be able to remove element from an array', function() {
        ArrayUtils.removeElement(testArray, 'a');
        assert.deepEqual(
          testArray, ['b', 'b', 'c'],
          'remove item from array');
      });
      it('Should remove only the first instance of item', function() {
        ArrayUtils.removeElement(testArray, 'b');
        assert.deepEqual(
          testArray, ['a', 'b', 'c'],
          'remove only first item');
      });
      it('Should not modify array if item not found', function() {
        ArrayUtils.removeElement(testArray, 'd');
        assert.deepEqual(
          testArray, ['a', 'b', 'b', 'c'],
          'do not remove');
      });
    });

    describe('sortCaseInsensitive()', function() {
      beforeEach(function() {
        testArray = ['c', 'A', 'b', 'B', 'a', 'C'];
      });
      afterEach(function() {
        testArray = undefined;
      });
      it('Should sort array ignoring case', function() {
        // TODO (dtilley) We should make this sort function prioritize
        // one case over the other to produce a consistent output.
        assert.deepEqual(
          ArrayUtils.sortCaseInsensitive(testArray),
          ['A', 'a', 'b', 'B', 'c', 'C'],
          'sort array');
      });
    });

    describe('difference()', function() {
      beforeEach(function() {
        testArray = [1, 2, 'a', 'b', true, false];
      });
      afterEach(function() {
        testArray = undefined;
      });
      it('Should return items from array1 not in array2', function() {
        assert.deepEqual(
          ArrayUtils.difference(testArray, [2, 'b', false]), [1, 'a', true],
          'get array difference');
      });
    });
  });
});
