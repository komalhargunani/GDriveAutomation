// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Utilities for working with functions.
 */
define([
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/promise/deferred'
  ], function(
    PromiseUtils,
    TypeUtils,
    Deferred) {

  'use strict';

  var _api = {
    /**
     * Wraps a function with a layer that asserts that the function is only
     * called once. Typical usage:
     *
     * fn = FunctionUtils.onceCallableFunction(fn);
     * fn(); // should work
     * fn(); // should throw a multiple calls exception
     *
     * This is useful both for asserting correct program behavior, and for
     * memory management.
     *
     * Note, this does not modify the underlying function. It returns a new
     * function. So this is observed:
     *
     * bar = FunctionUtils.onceCallableFunction(foo);
     * foo(); // should work
     * foo(); // also works
     * bar(); // should work
     * bar()  // throws a multiple calls exception
     *
     * Has a promise called "isCalled" which fulfills or rejects after
     * the function is called, with the return value or exception.
     *
     * @param fn the function to be wrapped.
     * @returns {Function} a new wrapped function that delegates to fn.
     */
    onceCallableFunction: function(fn) {
      if (_onceCallableType.isOfType(fn)) {
        return fn;
      }
      TypeUtils.checkArgTypes('FunctionUtils.onceCallableFunction', {
        fn: [fn, 'function']
      });
      var deferred = new Deferred();
      var called = false;
      var firstCallStack;
      var onceCallableWrapper = function() {
        if (called) {
          console.error('First call stack of multiple for once-callable fn',
              firstCallStack);
          throw new Error('Multiple calls to a once-callable function');
        }
        called = true;
        firstCallStack = new Error('Valid first call');
        var boundFn = fn.apply.bind(fn, this, arguments);
        try {
          return deferred.runResolver(function(resolve) {
            var result = boundFn();
            resolve(result);
            return result;
          });
        } finally {
          fn = undefined; // dispose the function for garbage collection
        }
      };
      onceCallableWrapper.isCalled = deferred.promise;
      return _onceCallableType.markAsType(onceCallableWrapper);
    },

    /**
     * Returns a function that always returns a constant.
     *
     * var fn = FunctionUtils.makeConstantFunction("foo");
     * fn(); // returns "foo"
     *
     * Has a promise called "isCalled" that fulfills to the constant.
     *
     * @param constant the constant to return.
     * @returns {Function} the function that retuns the constant.
     */
    makeConstantFunction: function(constant) {
      var constantFunction = function() {
        return constant;
      };
      constantFunction.isCalled = PromiseUtils.cast(constant);
      return constantFunction;
    },

    /**
     * Memoizes a function. Wraps a function in a layer such that the wrapped
     * function is only called once, but the outer layer can be called multiple
     * times. The result is remembered, and will be returned on every subsequent
     * call.
     *
     * Has a promise called "isCalled" which fulfills or rejects after
     * the function is called, with the return value or exception.
     *
     * @param fn
     * @returns {Function}
     */
    memoize: function(fn) {
      if (_memoizedType.isOfType(fn)) {
        return fn;
      }
      TypeUtils.checkArgTypes('FunctionUtils.memoize', {
        fn: [fn, 'function']
      });
      var result;
      var exception;
      var called = false;
      var done = false;
      var excepted = false;
      fn = _api.onceCallableFunction(fn);
      var memoizeWrapper = function() {
        if (called) {
          if (!done) {
            throw new Error('Cannot recursively call into memoized function');
          }
          if (excepted) {
            throw exception;
          }
          // Result is returned below.
        } else {
          called = true;
          try {
            result = fn();
          } catch (e) {
            exception = e;
            excepted = true;
            throw e;
          } finally {
            done = true;
          }
        }
        return result;
      };
      memoizeWrapper.isCalled = fn.isCalled;
      return _memoizedType.markAsType(memoizeWrapper);
    }
  };

  var _onceCallableType = TypeUtils.createNewType('onceCallableFn');
  var _memoizedType = TypeUtils.createNewType('memoizedFn');

  return _api;
});
