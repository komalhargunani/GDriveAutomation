// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Helper for tests with promises.
 * Read: https://goto.google.com/run-tests-with-promise
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */
define([
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/typeUtils'
  ], function(
    PromiseUtils,
    TypeUtils) {

  'use strict';

  var PromiseTester = function(promise) {
    this.promise_ = PromiseUtils.cast(promise);
    this.expectsRejection_ = false;
    this.makeTestWaitForPromise_();
  };

  PromiseTester.prototype = {};
  PromiseTester.prototype.constructor = PromiseTester;

  /**
   * You should prefer calling onlyThen or expectThen in your tests to this.
   *
   * Standard promise then method, except calling .then(undefined, fn) will fail
   * the current test, in addition to expected Promise then behavior. Also,
   * returns a PromiseTester, instead of a vanilla promise.
   *
   * By having a then method, PromiseTester is a thenable, and can be cast to
   * promise.
   * http://promises-aplus.github.io/promises-spec/#point-7
   */
  PromiseTester.prototype.then = function(onFulfill, onReject) {
    if (!TypeUtils.isFunction(onFulfill) && TypeUtils.isFunction(onReject)) {
      fail_(new Error('PromiseTester.then method cannot be called with ' +
          'undefined onFulfill, and a defined onReject. This is too ' +
          'error-prone for tests. Use .onlyCatch instead'));
    }
    // There are 2 benefits to wrapping the new promise in PromiseTester.
    // 1. The new promise then gets makeTestWaitForPromise_ called on it,
    //    guaranteeing that your test will run the assertions in the handler
    //    functions.
    // 2. You can continue to chain PromiseTester methods. So..
    //    new PromiseTester(promise).onlyThen(...).expectCatch(...); etc
    //
    // Note, the return value is still a thenable, so this is legal according
    // to Promises/A+.
    return new PromiseTester(this.promise_.then(onFulfill, onReject));
  };

  // Intentionally leave out catch. It's error-prone for tests.

  /**
   * Equivalent to .then(onFulfill, failTheTest). Use this to assert that your
   * promise is going to fulfill, and to perform tests on the fulfillment
   * result.
   */
  PromiseTester.prototype.onlyThen = function(onFulfill) {
    return this.then(onFulfill, function(reason) {
      fail_(reason);
      throw reason;
    });
  };

  /**
   * Equivalent to .then(failTheTest, onReject). Use this to assert that your
   * promise is going to reject, and to perform tests on the rejection reason.
   */
  PromiseTester.prototype.onlyCatch = function(onReject) {
    // Save for later that we expect this promise to reject, so that the after
    // block scheduled by makeTestWaitForPromise_ doesn't fail the test.
    this.expectsRejection_ = true;
    return this.then(function(result) {
      fail_(new Error('Expected rejection, but fulfilled with ' + result));
      return result;
    }, onReject);
  };

  /**
   * Calls expect(result).toBe(expectedResult) on the promise. Use this to
   * assert that a promise has a particular fulfillment result.
   */
  PromiseTester.prototype.expectThen = function(expectedResult) {
    return this.onlyThen(function(result) {
      expect(result).toBe(expectedResult);
      return result;
    });
  };

  /**
   * Calls expect(reason).toBe(expectedReason) on the promise. Use this to
   * assert that a promise has a particular rejection reason.
   */
  PromiseTester.prototype.expectCatch = function(expectedReason) {
    return this.onlyCatch(function(reason) {
      expect(reason).toBe(expectedReason);
      // Don't throw the reason, return it. Typically, in promise-y code, when
      // one sees a catch, the rejection is no longer propagated. This keeps up
      // with that convention. To chain further from this point, use onlyThen,
      // such as...
      //
      // new PromiseTester(promise).expectCatch(expectedReason).onlyThen(
      //     function(reason) {
      //       moreTests();
      //     });
      return reason;
    });
  };

  PromiseTester.prototype.makeTestWaitForPromise_ = function() {
    getSpec_().after(function() {
      // Force the test to wait for the promise to settle. If the promise
      // rejects, and you haven't called onlyCatch method or expectCatch, the
      // test will fail.
      return this.promise_.catch(
          function(reason) {
            if (this.expectsRejection_) {
              return;
            } else {
              console.error('makeTestWaitForPromise_ has detected an ' +
                  'unhandled rejection. Please call .onlyCatch on ' +
                  'PromiseTester in your test.');
              throw reason;
            }
          }.bind(this));
    }.bind(this));
  };

  function fail_(reason) {
    getSpec_().fail(reason);
  }

  function getSpec_() {
    return jasmine.getEnv().currentSpec;
  }

  return PromiseTester;
});