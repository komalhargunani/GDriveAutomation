/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview helper module to provide some useful
 * wrappers around standard JS try/catch. Makes client
 * code more DRY
 *
 * Usage:
 *
 *   Try.ignore(func);
 *
 * or
 *
 *   Try.rethrow(func);
 *
 * or
 *
 *   Try.withWarning('some warning').ignore(func, arg1, arg2);
 *
 * or
 *
 *   Try.withWarning(warningObject).rethrow(func, arg1, arg2);
 *
 *
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define(['qowtRoot/utils/typeUtils'], function(TypeUtils) {

  'use strict';

  var api_ = {

    /**
     * Chainable function to ensure a warning is logged when
     * an exception occurs. For usage see top of this file
     *
     * @param {string|object} msg pass in a string or an object. The former
     *                            will be logged via console.warn and the
     *                            latter via console.dir
     * @return {Ignorable Module} returns a chained version of this. Allowing
     *                            you to do Try.withWarning('x').ignore(func);
     */
    withWarning: function(msg) {
      var ei = new ExceptionIgnorer(msg);
      return ei;
    },

    /**
     * Ignore any excpetions that might be thrown
     *
     * @param {Function} func the function to run
     * @param {...anything} optionally pass in further arguments which will
     *                      be passed to the func
     */
    ignore: function(/* func */) {
      if (!TypeUtils.isFunction(arguments[0])) {
        throw new Error('ignore must be passed a function as first argument');
      }
      var ei = new ExceptionIgnorer();
      return ei.ignore.apply(ei, arguments);
    },

    /**
     * Rethrow any excpetions that might be thrown. Only really useful
     * in conjunction with 'withWarning'.
     *
     * @param {Function} func the function to run
     * @param {...anything} optionally pass in further arguments which will
     *                      be passed to the func
     */
    rethrow: function(/* func */) {
      var ei = new ExceptionIgnorer();
      return ei.rethrow.apply(ei, arguments);
    }
  };

  // ------------------------- PRIVATE --------------------------------

  var ExceptionIgnorer = function(optMsg) {
    this.rethrowOnException = false;
    this.optMsg = optMsg;
  };

  ExceptionIgnorer.prototype = {
    __proto__: Object.prototype,

    ignore: function() {
      return this.run.apply(this, arguments);
    },
    rethrow: function() {
      this.rethrowOnException = true;
      return this.run.apply(this, arguments);
    },


    /**
     * Run the function that is passed to this ExceptionIgnoner run call
     * and log warnings / rethrow as required.
     *
     * @param {Function} func the function to run
     * @param {...anything} optionally pass in further arguments which will
     *                      be passed to the func
     */
    run: function() {
      // first argument is the function to call
      var func = arguments[0];

      // the rest of the arguments should be passed to the function
      var args = [].splice.call(arguments,1);
      try {
        var x = func.apply(null, args);
        return x;
      } catch (e) {
        if (this.optMsg) {
          if (TypeUtils.isString(this.optMsg)) {
            console.warn(this.optMsg);
          } else {
            console.dir(this.optMsg);
          }
        }
        if (!this.rethrowOnException) {
          console.warn('Ignoring exception: ', e);
        } else {
          if (e instanceof Error) {
            throw e;
          } else {
            throw new Error(e);
          }
        }
      }
    }
  };


  return api_;
});