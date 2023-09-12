// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Deferreds, a convenient wrapper for promises.
 */
define([
    'qowtRoot/utils/typeUtils'],
  function(TypeUtils) {

  'use strict';

  /**
   * Creates a Deferred, powered by JS Promises. Deferreds are a standard
   * concept, and information is available online. Promises are read-only
   * objects. The consumer of a promise can only define what to do once it
   * settles. They have no control of how it settles.
   *
   * A Deferred is a read-write object. It has a Promise, and has a resolve
   * and reject method for making the promise settle.
   *
   * Why would you want to use this?
   * Your creation of the promise and the execution of the resolver can now
   * be separated from each other. This gets you out of awkward code
   * situations:
   *
   * var promise = new Promise(function(resolve, reject) {
   *   var thingThatNeedsToBeReturned = fnWithACallback(resolve);
   *   // how am I going to get out thingThatNeedsToBeReturned?
   * });
   *
   * You can't get to thingThatNeedsToBeReturned. The return value of the
   * resolver function is dropped on the floor. Instead you can...
   *
   * var deferred = new Deferred();
   * var thingThatNeedsToBeReturned = fnWithACallback(deferred.resolve);
   * var promise = deferred.promise;
   */
  var Deferred = function() {

    /**
     * The Promise. On creation, this Promise is still pending, and can
     * only be resolved or rejected by using the resolve or reject method.
     */
    this.promise = new Promise(function(resolve, reject) {

      /**
       * Causes this Deferred's Promise to resolve to the given result.
       *
       * @param result {Object} the result of the resolved Promise.
       */
      this.resolve = resolve;

      /**
       * Causes this Deferred's Promise to reject with the given reason.
       *
       * @param reason {Object} the reason for the Promise's rejection.
       */
      this.reject = reject;
    }.bind(this));
  };

  Deferred.prototype = {};
  Deferred.prototype.constructor = Deferred;

  /**
   * Convenience method. Runs a resolver function, equivalent to the arg
   * of the Promise constructor. But passes through the return value.
   * This also propagates the exception, instead of swallowing. On
   * exception, the promise is rejected, as with new Promise(resolver).
   *
   * To reuse the same example as above, you would turn this:
   * var promise = new Promise(function(resolve, reject) {
   *   var thingThatNeedsToBeReturned = fnWithACallback(resolve);
   *   // how am I going to get out thingThatNeedsToBeReturned?
   * });
   *
   * Into this:
   * var deferred = new Deferred();
   * var thingThatINeeded = deferred.runResolver(
   *     function(resolve, reject) {
   *       var thingThatNeedsToBeReturned = fnWithACallback(resolve);
   *       return thingThatNeedsToBeReturned;
   *     });
   * var promise = deferred.promise;
   */
  Deferred.prototype.runResolver = function(fn) {
    TypeUtils.checkArgTypes('Deferred.runResolver', {
      fn: [fn, 'function']
    });

    try {
      return fn(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
      throw e;
    }
  };

  return Deferred;
});
