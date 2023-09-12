// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Tests for Worker.
 */

define([
    'qowtRoot/promise/worker',
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/promise/testing/promiseTester'
  ], function(
    Worker,
    PromiseUtils,
    PromiseTester) {

  'use strict';

  describe('promise/worker.js', function() {
    describe('finishes all work', function() {
      afterEach(function() {
        expect(worker.isEmpty()).toBe(true);
      });
      describe('functions added before start called', function() {
        var promises;

        beforeEach(function() {
          promises = [addReturnFn_(), addPromiseFn_(), addReturnFn_()];

          expect(events).toEqual([]);
          expect(worker.isEmpty()).toBe(false);
          worker.start();
          expect(worker.isEmpty()).toBe(false);
        });

        it('should run work in order, added before start', function() {
          return new PromiseTester(Promise.all(promises));
        });

        it('should run work added before and after start', function() {
          promises = promises.concat([addReturnFn_(), addPromiseFn_()]);
          return new PromiseTester(Promise.all(promises));
        });
      });

      it('should run work queued after start', function() {
        worker.start();
        expect(worker.isEmpty()).toBe(true);

        var promises = [addReturnFn_(), addPromiseFn_(), addPromiseFn_()];
        expect(worker.isEmpty()).toBe(false);

        return new PromiseTester(Promise.all(promises));
      });

      it('should run functions immediately when possible', function() {
        worker.start();

        var promises = [addReturnFn_(), addReturnFn_(), addReturnFn_()];
        expect(worker.isEmpty()).toBe(true);

        // This should already be true, before waiting for any promises.
        expect(events).toEqual(expectedEvents);

        return new PromiseTester(Promise.all(promises));
      });

      it('returns non-promise result when function executed immediately',
          function() {
        worker.start();

        expectedEvents = ['foo', 'foo'];
        var result = {};
        function immFunction() {
          events.push('foo');
          return result;
        }

        expect(worker.addWork(immFunction)).toBe(result);
        expect(worker.addWork(immFunction)).toBe(result);

        expect(worker.isEmpty()).toBe(true);
      });

      it('deals with functions that are wrapped in promises', function() {
        worker.start();

        var promises = [addPromisedReturnFn_(), addReturnFn_(),
            addPromisedReturnFn_()];

        expect(worker.isEmpty()).toBe(false);

        // No events occured, since first function is promised, and cannot be
        // executed immediately.
        expect(events).toEqual([]);

        return new PromiseTester(Promise.all(promises));
      });
    });

    describe('does not finish all work', function() {
      afterEach(function() {
        expect(worker.isEmpty()).toBe(false);
      });
      describe('async failures', function() {
        var startPromise;
        var rejectPromiseTester;
        beforeEach(function() {
          startPromise = worker.start();
        });

        afterEach(function() {
          addNotToBeCalledFn_();

          // It has to be onlyThen, because we've already caught the rejection
          // and set up PromiseTester expectations in addRejectFn_.
          return rejectPromiseTester.onlyThen(function(reason) {
            // startPromise should reject with the reason
            console.log('second work rejected, waiting for start to reject');
            return new PromiseTester(startPromise).expectCatch(reason);
          });
        });
        it('should reject promise returned by start when work rejects',
            function() {
          addReturnFn_();
          rejectPromiseTester = addRejectFn_();
        });
        it('should reject promise returned by start when work throws',
            function() {
          addPromiseFn_();
          rejectPromiseTester = addThrowFn_();
        });
      });

      it('addWork should throw when added work throws', function() {
        var startPromise = worker.start();

        var exception = new Error('');
        expect(worker.addWork.bind(worker, function() {
          throw exception;
        })).toThrow(exception);
        expect(worker.isEmpty()).toBe(false);
        addNotToBeCalledFn_();
        expect(worker.isEmpty()).toBe(false);

        return new PromiseTester(startPromise).expectCatch(exception);
      });
    });

    var events;
    var expectedEvents;
    var counter;
    var worker;
    beforeEach(function() {
      events = [];
      expectedEvents = [];
      worker = Worker.create();
      counter = 0;
    });
    afterEach(function() {
      expect(events).toEqual(expectedEvents);
    });

    function returnFn_(eventsSoFar, newEvent, retval) {
      expect(events).toEqual(eventsSoFar);
      events.push(newEvent);
      return retval;
    }

    function throwFn_(eventsSoFar, newEvent, exception) {
      expect(events).toEqual(eventsSoFar);
      events.push(newEvent);
      throw exception;
    }

    function promiseFn_(eventsSoFar, newEvent, retval) {
      expect(events).toEqual(eventsSoFar);
      return Promise.resolve().then(function() {
        events.push(newEvent);
        return retval;
      });
    }

    function makeReturnFn_(retval) {
      return makeFn_(returnFn_, retval);
    }

    function makeThrowFn_(exception) {
      return makeFn_(throwFn_, exception);
    }

    function makePromiseFn_(retval) {
      return makeFn_(promiseFn_, retval);
    }

    function makeFn_(fn, param) {
      var bound = fn.bind(undefined, expectedEvents.slice(0), counter, param);
      expectedEvents.push(counter++);
      return bound;
    }

    function addReturnFn_() {
      var result = {};
      return addFn_(makeReturnFn_(result)).expectThen(result);
    }

    function addThrowFn_() {
      var reason = new Error();
      return addFn_(makeThrowFn_(reason)).expectCatch(reason);
    }

    function addRejectFn_() {
      var reason = new Error();
      return addFn_(makeReturnFn_(Promise.reject(reason))).expectCatch(reason);
    }

    function addPromiseFn_() {
      var result = {};
      return addFnAssertNotEmpty_(makePromiseFn_(result)).expectThen(result);
    }

    function addPromisedReturnFn_() {
      var result = {};
      return addFnAssertNotEmpty_(PromiseUtils.cast(makeReturnFn_(result)))
          .expectThen(result);
    }

    function addFnAssertNotEmpty_(fn) {
      var promiseTester = addFn_(fn);
      // This will always be false here, because we added a function that does
      // not complete immediately.
      expect(worker.isEmpty()).toBe(false);
      return promiseTester;
    }

    function addFn_(fn) {
      return new PromiseTester(worker.addWork(fn));
    }

    function addNotToBeCalledFn_() {
      worker.addWork(function() {
        jasmine.getEnv().currentSpec.fail(
            new Error('This function should not be called'));
      });
    }
  });
});