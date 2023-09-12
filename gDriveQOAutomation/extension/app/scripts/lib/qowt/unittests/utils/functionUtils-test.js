// Copyright 2013 Google Inc. All Rights Reserved.


/**
 * @author ganetsky@google.com (Jason Ganetsky)
 */
define([
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/promise/testing/promiseTester'
], function(
    FunctionUtils,
    TypeUtils,
    PromiseTester) {

  'use strict';
  describe('utils/functionUtils.js', function() {
    describe('onceCallableFunction', function() {
      it('should make sure something is once callable', function() {
        var expectedResult = 'foo';
        var callCount = 0;
        var testFunction = function() {
          callCount++;
          return expectedResult;
        };
        var wrapped = FunctionUtils.onceCallableFunction(testFunction);
        expect(wrapped()).toBe(expectedResult);
        expect(wrapped).toThrow();
        expect(wrapped).toThrow();
        expect(callCount).toBe(1);
      });

      it('should pass-through exceptions', function() {
        var e = new Error('test error');
        var testFunction = function() {
          throw e;
        };

        var wrapped = FunctionUtils.onceCallableFunction(testFunction);
        expect(wrapped).toThrow(e);
      });

      it('should pass through args', function() {
        var arg1Val = 'arg1val';
        var arg2Val = 'arg2val';
        var testFunction = function(arg1, arg2) {
          expect(arg1).toBe(arg1Val);
          expect(arg2).toBe(arg2Val);
        };

        var wrapped = FunctionUtils.onceCallableFunction(testFunction);
        wrapped(arg1Val, arg2Val);
      });

      it('should die on recursion', function() {
        var callCount = 0;

        var wrappedFunction = FunctionUtils.onceCallableFunction(function() {
          callCount++;
          wrappedFunction();
        });

        expect(wrappedFunction).toThrow();
        expect(callCount).toBe(1);
      });

      it('should not rewrap functions', function() {
        var testFunction = function() {
        };

        var wrapped = FunctionUtils.onceCallableFunction(testFunction);
        expect(FunctionUtils.onceCallableFunction(wrapped)).toBe(wrapped);
      });

      describe('promises', function() {
        it('should have a promise that fulfills on function call', function() {
          var returnValue = 'foo';
          var testFunction = function() {
            return returnValue;
          };

          var wrapped = FunctionUtils.onceCallableFunction(testFunction);

          return runsPromiseTest_(wrapped).expectThen(returnValue);
        });

        it('should have a promise that rejects on function exception',
            function() {
          var exception = 'foo';
          var testFunction = function() {
            throw exception;
          };

          var wrapped = FunctionUtils.onceCallableFunction(testFunction);

          return runsPromiseTest_(wrapped).expectCatch(exception);
         });
      });
    });

    describe('makeConstantFunction', function() {
      it('should make a function that returns a constant', function() {
        var constant = {};
        var constantFn = FunctionUtils.makeConstantFunction(constant);
        expect(constantFn()).toBe(constant);
        // should support multiple calls
        expect(constantFn()).toBe(constant);
        expect(constantFn()).toBe(constant);
      });

      describe('promises', function() {
        it('should have a promise that fulfills to the constant', function() {
          var returnValue = 'foo';

          var wrapped = FunctionUtils.makeConstantFunction(returnValue);

          return runsPromiseTest_(wrapped).expectThen(returnValue);
        });
      });
    });

    describe('memoize', function() {
      it('should remember a result', function() {
        var called = false;
        var expectedResult = {};
        var fn = function() {
          if (called) {
            throw 'Function called multiple times';
          }
          called = true;
          return expectedResult;
        };
        var memoizedFn = FunctionUtils.memoize(fn);
        expect(memoizedFn()).toBe(expectedResult);
        expect(memoizedFn()).toBe(expectedResult);
      });

      it('should remember an exception', function() {
        var called = false;
        var expectedException = 'foo';
        var fn = function() {
          if (called) {
            throw 'Function called multiple times';
          }
          called = true;
          throw expectedException;
        };
        var memoizedFn = FunctionUtils.memoize(fn);
        expect(memoizedFn).toThrow(expectedException);
        expect(memoizedFn).toThrow(expectedException);
      });

      it('should die on recursion', function() {
        var callCount = 0;
        var wrappedFunction = FunctionUtils.memoize(function() {
          callCount++;
          wrappedFunction();
        });

        expect(wrappedFunction).toThrow();
        expect(callCount).toBe(1);
      });

      it('should not rewrap functions', function() {
        var testFunction = function() {
        };

        var wrapped = FunctionUtils.memoize(testFunction);
        expect(FunctionUtils.memoize(wrapped)).toBe(wrapped);
      });

      describe('promises', function() {
        it('should have a promise that fulfills to the result', function() {
          var returnValue = 'foo';

          var wrapped = FunctionUtils.memoize(function() {
            return returnValue;
          });

          return runsPromiseTest_(wrapped).expectThen(returnValue);
        });

        it('should have a promise that rejects on exception', function() {
          var expectedException = 'foo';

          var wrapped = FunctionUtils.memoize(function() {
            throw expectedException;
          });

          return runsPromiseTest_(wrapped).expectCatch(expectedException);
        });
      });
    });

    function runsPromiseTest_(fnToTest) {
      expect(TypeUtils.isPromise(fnToTest.isCalled)).toBe(true);

      setTimeout(function() {
        try {
          fnToTest();
        } catch (e) {
          // Swallow exceptions, for some of these fns throw exceptions.
        }
      }, 10);

      return new PromiseTester(fnToTest.isCalled);
    }
  });
});
