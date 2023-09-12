// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Tests for Promise utils.
 */
define([
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/promise/testing/promiseTester',
    'qowtRoot/utils/domListener'
  ], function(
    PromiseUtils,
    TypeUtils,
    PromiseTester,
    DomListener) {

  'use strict';

  describe('promiseUtils.js', function() {

    describe('cast', function() {
      it('should return Promise objects unchanged', function() {
        var aPromise = new Promise(function(){}),
            result = PromiseUtils.cast(aPromise);
        expect(result instanceof Promise).toBe(true);
        expect(TypeUtils.isFunction(result.then)).toBe(true);
        expect(aPromise === result).toBe(true);
      });
      it('should cast Promise-like objects into true ' +
         'Promise objects', function() {
        var aPromiseLike = {then:function(){}},
            result = PromiseUtils.cast(aPromiseLike);
        expect(result instanceof Promise).toBe(true);
        expect(TypeUtils.isFunction(result.then)).toBe(true);
        expect(aPromiseLike === result).toBe(false);
      });
      it('should create a Promise object that resolves to ' +
         'a non-Promise-like parameter', function() {
        var notPromiseLike = 'hello',
            result = PromiseUtils.cast(notPromiseLike);
        expect(result instanceof Promise).toBe(true);
        expect(TypeUtils.isFunction(result.then)).toBe(true);
        expect(notPromiseLike === result).toBe(false);
        result.then(function(resolveValue) {
          expect(resolveValue).toBe('hello');
        });
      });
    });

    describe('delay', function() {
      it('should fulfill the promise on timeout', function() {
        var value = {};
        var timeout = 100;
        return new PromiseTester(PromiseUtils.delay(timeout, value))
            .expectThen(value);
      });

      it('should work with no args', function() {
        return new PromiseTester(PromiseUtils.delay()).expectThen(undefined);
      });
    });

    describe('microtasks', function() {
      var domListenerGroup = 'uncaughtErrorsPromiseUtilsTest';
      var error = new Error('This error is part of the test, and is ' +
              'expected.');

      var uncaughtErrors;
      beforeEach(function() {
        uncaughtErrors = [];
        DomListener.add(domListenerGroup, window, 'error', function(evt) {
          uncaughtErrors.push(evt);
        });
      });
      afterEach(function() {
        DomListener.removeGroup(domListenerGroup);
      });

      describe('throwAndEscapeChain', function() {
        it('should throw an exception', function() {
          var done = false;
          runs(function() {
            setTimeout(function() {
              done = true;
            }, 0);

            expect(PromiseUtils.throwAndEscapeChain.bind(this, error))
                .toThrow(error);

            expect(uncaughtErrors.length).toEqual(0);
          });

          waitsFor(function() {
            return done;
          }, 'waiting for timeout', 1000);

          waitsFor(function() {
            return uncaughtErrors.length === 1;
          }, 'waiting for error to be caught', 3000);
        });
      });
    });

    describe('pipeline', function() {
      var lastResult = 'fn3Result';
      it('should work in the trivial case of no tasks', function() {
        var arg1 = 'foo';
        var arg2 = 'bar';
        expect(PromiseUtils.pipeline([], arg1, arg2)).toBe(arg1);
      });
      describe('three function pipeline', function() {
        it('should return non-promise if no promises are in the code',
            function() {
          testPromiseLevel = -1;
          var result = runPipeline_();
          expect(TypeUtils.isPromiseLike(result)).toBe(false);
          expect(result).toEqual('fn3Result');
        });

        describe('promisy tasks', function() {
          afterEach(function() {
            var result = runPipeline_();
            expect(TypeUtils.isPromise(result)).toEqual(true);
            return new PromiseTester(result).expectThen(lastResult);
          });
          it('should deal with promises returned by the tasks', function() {
            testPromiseLevel = 0;
          });
          it('should deal with promises in the task list', function() {
            testPromiseLevel = 1;
          });
          it('should deal with a task list promise', function() {
            testPromiseLevel = 2;
          });
          it('should deal with promises in the fn args', function() {
            testPromiseLevel = 3;
          });
        });

        function fn1_(arg1, arg2, arg3) {
          expect(arg1).toEqual('arg1');
          expect(arg2).toEqual('arg2');
          expect(arg3).toEqual('arg3');
          events.push('fn1');
          return 'fn1Result';
        }
        function fn2_(arg) {
          expect(arg).toEqual('fn1Result');
          events.push('fn2');
          return maybePromise_(0, 'fn2Result');
        }
        function fn3_(arg) {
          expect(arg).toEqual('fn2Result');
          events.push('fn3');
          return maybePromise_(0, lastResult);
        }

        afterEach(function() {
          expect(events).toEqual(['fn1', 'fn2', 'fn3']);
        });

        function runPipeline_() {
          return PromiseUtils.pipeline(
              maybePromise_(2, [fn1_, maybePromise_(1, fn2_), fn3_]),
              'arg1', maybePromise_(3, 'arg2'), maybePromise_(3, 'arg3'));
        }
      });

      describe('three-function, second throws', function() {
        it('should throw exception with non-promise code', function() {
          testPromiseLevel = -1;
          expect(runPipeline_).toThrow(exception);
        });

        it('should return rejected promise on exception throw', function() {
          testPromiseLevel = 0;
          return new PromiseTester(runPipeline_()).expectCatch(exception);
        });

        function fn1_(arg) {
          expect(arg).toEqual('arg');
          events.push('fn1');
          return 'fn1Result';
        }
        function fn2_(arg) {
          expect(arg).toEqual('fn1Result');
          events.push('fn2');
          throw exception;
        }
        function fn3_() {
          events.push('fn3');
        }

        afterEach(function() {
          expect(events).toEqual(['fn1', 'fn2']);
        });

        function runPipeline_() {
          return PromiseUtils.pipeline(
              maybePromise_(0, [fn1_, fn2_, fn3_]), 'arg');
        }

        var exception = new Error('expected exception');
      });
      var testPromiseLevel;
      function maybePromise_(level, value) {
        return (level <= testPromiseLevel) ? Promise.resolve(value) : value;
      }
      var events;
      beforeEach(function() {
        events = [];
      });
    });

    describe('finally', function() {
      var finallyClause;
      beforeEach(function() {
        finallyClause = undefined;
      });

      function makePromiseTester_(promise) {
        return new PromiseTester(
            PromiseUtils.finally(promise, finallyClause));
      }

      describe('successful finally clause', function() {
        var finallyClauseCount;
        beforeEach(function() {
          finallyClauseCount = 0;
        });
        afterEach(function() {
          expect(finallyClauseCount).toBe(1);
        });

        beforeEach(function() {
          finallyClause = function() {
            return Promise.resolve().then(function() {
              finallyClauseCount++;
            });
          };
        });

        it('should call finally clause on fulfillment', function() {
          var result = {};
          return makePromiseTester_(Promise.resolve(result)).expectThen(result);
        });

        it('should call finally clause on rejection', function() {
          var reason = {};
          return makePromiseTester_(Promise.reject(reason)).expectCatch(reason);
        });
      });

      describe('overriding for errors', function() {
        var exception = new Error();
        var promiseValue;
        beforeEach(function() {
          promiseValue = undefined;
        });
        afterEach(function() {
          return makePromiseTester_(promiseValue).expectCatch(exception);
        });

        function itShouldOverride() {
          it('should override fulfilled promise with reason', function() {
            promiseValue = Promise.resolve();
          });

          it('should override rejected promise with reason', function() {
            promiseValue = Promise.reject('foo');
          });
        }

        describe('throwing finally clause', function() {
          beforeEach(function() {
            finallyClause = function() {
              throw exception;
            };
          });

          itShouldOverride();
        });

        describe('rejecting finally clause', function() {
          beforeEach(function() {
            finallyClause = function() {
              return Promise.reject(exception);
            };
          });

          itShouldOverride();
        });
      });
    });
  });
});
