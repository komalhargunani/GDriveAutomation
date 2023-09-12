// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Tests for Deferred.
 */

define([
    'qowtRoot/promise/deferred',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/promise/testing/promiseTester'
  ], function(
    Deferred,
    TypeUtils,
    PromiseTester) {

  'use strict';

  describe('promise/deferred.js', function() {
    var deferred;
    beforeEach(function() {
      deferred = new Deferred();
    });

    it('should have a promise', function() {
      expect(TypeUtils.isPromise(deferred.promise)).toBe(true);
    });

    it('should have a resolve method', function() {
      var expectedResult = {};

      deferred.resolve(expectedResult);
      return new PromiseTester(deferred.promise).expectThen(expectedResult);
    });

    it('should have a reject method', function() {
      var expectedReason = {};

      deferred.reject(expectedReason);
      return new PromiseTester(deferred.promise).expectCatch(expectedReason);
    });

    describe('runResolver function', function() {
      it('should pass through resolve and reject', function() {
        var callCount = 0;

        deferred.runResolver(function(resolve, reject) {
          callCount++;
          expect(resolve).toBe(deferred.resolve);
          expect(reject).toBe(deferred.reject);
        });

        expect(callCount).toBe(1);
      });

      it('should return the function\'s return value', function() {
        var actualValue = {};

        var expectedValue = deferred.runResolver(function() {
          return actualValue;
        });

        expect(expectedValue).toBe(actualValue);
      });

      it('should not swallow exceptions, and should reject the promise',
          function() {
        var error = new Error();

        expect(function() {
          deferred.runResolver(function() {
            throw error;
          });
        }).toThrow(error);

        return new PromiseTester(deferred.promise).expectCatch(error);
      });
    });
  });
});