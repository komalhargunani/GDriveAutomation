// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview A worker that progresses through a queue of zero-argument
 * functions, each in their own microtask. The worker guarantees work is done in
 * order, and doesn't overrlap. In other words, it waits for returned promises
 * to settle before making forward progress. It guarantees that the order of
 * work is done in the same order as calls to the addWork method.
 *
 * Worker also tries to run methods in the current microtask, synchronously,
 * when it can. If, for example, all the functions given to worker have
 * non-promise return values, and are added after the worker has been started,
 * then you can expect all the work to be done synchronously.
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/promise/queue',
  'qowtRoot/promise/deferred'
  ], function(
    TypeUtils,
    PromiseUtils,
    FunctionUtils,
    Queue,
    Deferred) {

  'use strict';

  /**
   * Constructs a worker with an empty queue.
   */
  var Worker = function() {
    this.started_ = false;
    this.pendingCount_ = 0;

    this.queue_ = new Queue();
    Object.seal(this);
  };

  Worker.prototype = {};
  Worker.prototype.constructor = Worker;

  /**
   * Starts the worker. This can only be called once. The worker doesn't do any
   * work until this is called. If one of the tasks excepts or rejects, then the
   * worker stops.
   *
   * @returns {Promise} a promise that rejects when the worker stops.
   */
  Worker.prototype.start = function() {
    if (this.started_) {
      throw new Error('Cannot start worker, already started');
    }
    this.started_ = true;

    return this.loop_();
  };

  /**
   * Adds a zero-argument function to the work queue. If no other work is
   * pending, then fn will be called synchronously.
   *
   * @param fn {Function} a zero-argument function for the worker to call. This
   *     can return a promise, in which case the worker will wait for the
   *     promise to settle before continuing work.
   * @returns {Object} the return value of the work function, or a promise if
   *     the work hasn't finished (or started) yet.
   */
  Worker.prototype.addWork = function(fn) {
    var deferred = new Deferred();
    if (this.incPendingCount_(fn)) {
      this.queue_.enQ(FunctionUtils.makeConstantFunction(deferred.promise));
      // Instead of returning deferred.promise, we return the value of
      // this.doWork_ itself, which is the return value of fn itself. Thus, with
      // work that is done immediately, we have immediate non-promise access to
      // the result.
      return this.doWorkAndDecPendingCount_(fn, deferred);
    } else {
      this.queue_.enQ(PromiseUtils.cast(fn).then(function(resolvedFn) {
        return this.doWorkAndDecPendingCount_.bind(this, resolvedFn, deferred);
      }.bind(this)));
      return deferred.promise;
    }
  };

  /**
   * Queries the worker for emptiness. A value of true would mean that all added
   * work has completed successfully.
   * @returns {boolean} If there is no work currently pending.
   */
  Worker.prototype.isEmpty = function() {
    return this.pendingCount_ === 0;
  };

  /**
   * Return the number of pending work jobs.
   * @return {Integer}
   */
  Worker.prototype.pendingCount = function() {
    return this.pendingCount_;
  };

  /**
   * Increments the pending count.
   *
   * @returns {boolean} Whether the work function can be done immediately.
   * @private
   */
  Worker.prototype.incPendingCount_ = function(fn) {
    var canWorkImmediately = this.isEmpty() &&
        !TypeUtils.isPromiseLike(fn) &&
        this.started_;

    this.pendingCount_++;
    return canWorkImmediately;
  };

  /**
   * The worker loop itself. This performs the non-immediate work. It loops
   * forever, dequeueing functions from the queue, calling them, and waiting for
   * returned promises to settle. This loop will go on forever, or until a
   * function excepts or rejects.
   *
   * @returns {Promise} the promise representing the end of the loop.
   * @private
   */
  Worker.prototype.loop_ = function() {
    return PromiseUtils.cast(this.queue_.deQ()).then(function(fn) {
      return fn();
    }.bind(this)).then(this.loop_.bind(this));
  };

  /**
   * This calls the work function, and decrements pending count when the
   * returned promise settles. It also resolves a deferred with the result.
   *
   * @param fn {Function} the zero-argument work function.
   * @param deferred {Deferred} the deferred that will be resolved to the result
   *     of the work function.
   * @returns {Object} the result of the work function.
   * @private
   */
  Worker.prototype.doWorkAndDecPendingCount_ = function(fn, deferred) {
    TypeUtils.checkArgTypes('Worker.addWork', {
      fn: [fn, 'function']
    });

    var result;
    try {
      result = fn();
    } catch (e) {
      deferred.reject(e);
      throw e;
    }

    if (!TypeUtils.isPromiseLike(result)) {
      this.pendingCount_--;
    } else {
      result = PromiseUtils.cast(result).then(function(reason) {
        this.pendingCount_--;
        return reason;
      }.bind(this));
    }

    deferred.resolve(result);
    return result;
  };

  return {
    create: function() {
      return new Worker();
    }
  };
});
