// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Utilities for working with promises.
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/third_party/when/when'], function(
  TypeUtils,
  when) {

  'use strict';

  var api_ = {

    /**
     * Promise.cast() is being removed from Chrome M35
     * in favor of using Promise.resolve() for any
     * non-promise object.
     * Instead of using cast to validate a promise-like
     * object we check if the constructor is Promise.
     * @param {Object} promiseLike The promise or promise-like
     *        object to validate.
     * @return {Promise}
     */
    cast: function(promiseLike) {
      if (promiseLike instanceof Promise) {
        return promiseLike;
      }
      return Promise.resolve(promiseLike);
    },

    /**
     * Creates a promise that fulfills after a specified delay.
     * Mirrors the when/delay API.
     *
     * @param opt_timeout {Number} the delay in milliseconds.
     *     Default is 0.
     * @param opt_value {Object} the value to resolve to.
     *     Default is undefined.
     */
    delay: function(opt_timeout, opt_value) {
      opt_timeout = opt_timeout || 0;

      return new Promise(function(resolve) {
        setTimeout(resolve.bind(undefined, opt_value), opt_timeout);
      });
    },

    /**
     * Creates a promise that rejects after a specified delay.
     *
     * @param opt_timeout {Number} the delay in milliseconds.
     *     Default is 0.
     * @param opt_error {Object} the error to reject with.
     *     Default is undefined.
     */
    delayThenReject: function(opt_timeout, opt_error) {
      opt_timeout = opt_timeout || 0;

      return new Promise(function(undefined, reject) {
        setTimeout(reject.bind(undefined, opt_error), opt_timeout);
      });
    },

    /**
     * Crashes the application with a passed-in exception despite possibly being
     * inside of a catch block. Promises swallow exceptions, so to bypass the
     * catch block, we have to rethrow the exception asynchronously. This
     * fucntion also rethrows the exception now.
     *
     * Basically does this, but with a microtask instead of a turn:
     * setTimeout(function() {
     *   throw e;
     * });
     * throw e;
     *
     * The typical mode of use for this function is the following:
     * var topPromise = almostTopPromise.catch(
     *     PromiseUtils.throwAndEscapeChain);
     *
     * If almostTopPromise rejects, topPromise rejects with the same reason,
     * but also an uncaught error will occur, leading the browser to report the
     * exception to the console, and also to generate an ErrorEvent which is
     * then handled by QOWT.
     *
     * @params e {Error} the exception to throw.
     * @throws {Error} rethrows e.
     */
    throwAndEscapeChain: function(e) {
      // The when library complains when e is not an error, so we wrap it in
      // Error here. This is not ideal, as we lose the original stack trace,
      // replacing it with the throwAndEscapeChain stacktrace. So, only throw
      // instaces of error!
      if (!(e instanceof Error)) {
        console.error('throwAndEscapeChain wrapping value in new Error: ', e);
        e = new Error(e);
      }
      when.reject(e).done();
      throw e;
    },

    /**
     * Same API as when's pipeline
     * https://github.com/cujojs/when/blob/master/docs/api.md#whenpipeline
     *
     * Pipeline-calls a series of functions. If we imagine a one-arg function to
     * look like this:
     *
     *         /-----\
     * Arg >---| Fun |---> Return value
     *         \-----/
     *
     * Then we take a list of functions [Fun1, Fun2, Fun3] pipeline them
     * together like this:
     *
     *         /------\   /------\   /------\
     * Arg >---| Fun1 |---| Fun2 |---| Fun3 |---> Return value
     *         \------/   \------/   \------/
     *
     * It's as if we combined the list of functions into a single function:
     *
     *        /-----------------------------\
     * Arg >--|           pipeline          |---> Return value
     *        \-----------------------------/
     *
     * In other words, the argument of each function is the return value of the
     * previous function in the list.
     *
     * The first function is allowed to take more than one argument.
     *
     * Promises are handled as one would expect. No function in the list is
     * called until all arguments that are promises are settled. Functions
     * promises can also be passed in the task list, which are also settled
     * before calling.
     *
     * The way you would use this is:
     * var retval3 = PromiseUtils.pipeline([fn1, fn2, fn3], fn1Arg1, fn1Arg2);
     *
     * In steps, resolving all promises along the way:
     * var retval1 = fn1(fn1Arg1, fn1Arg2);
     * var retval2 = fn2(retval1);
     * var retval3 = fn3(retval2);
     *
     * The key difference in behavior with when's pipeline is, while theirs does
     * all the work promise-later, this one does as much work as possible now.
     * https://goto.google.com/what-are-microtasks
     */
    pipeline: function(tasks) {
      var that = this;
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.some(TypeUtils.isPromiseLike)) {
        return Promise.all(args).then(function(resolvedArgs) {
          return api_.pipeline.apply(that, resolvedArgs);
        });
      }

      TypeUtils.checkArgTypes('PromiseUtils.pipeline', {
        'tasks': [tasks, 'list']
      });

      // copy list so we can mutate
      tasks = tasks.slice(0);

      function executeTasks_() {
        var taskArgs = Array.prototype.slice.call(arguments, 0);
        while (tasks.length > 0) {
          var firstTask = tasks.shift();

          if (TypeUtils.isPromiseLike(firstTask)) {
            return api_.cast(firstTask).then(function(resolvedFirstTask) {
              tasks.unshift(resolvedFirstTask);
              return executeTasks_.apply(that, taskArgs);
            });
          }

          TypeUtils.checkArgTypes('PromiseUtils.pipeline', {
            'task': [firstTask, 'function']
          });

          var result = firstTask.apply(that, taskArgs);

          if (!TypeUtils.isPromiseLike(result)) {
            taskArgs = [result];
          } else {
            return api_.cast(result).then(function(resolvedResult) {
              return executeTasks_(resolvedResult);
            });
          }
        }

        return taskArgs[0];
      }

      return executeTasks_.apply(that, args.slice(1));
    },

    /**
     * Performs a task regardless of whether a promise fulfills or rejects.
     * Inspired by when/finally
     * https://github.com/cujojs/when/blob/master/docs/api.md#finally
     *
     * The finally clause is run when the promise arg settles.
     * If the finally clause rejects or throws, then the returned promise
     * rejects with that reason. Else, the returned promise resolves to the
     * promise arg. In other words, the result from the finally clause is
     * swallowed.
     */
    finally: function(promise, finallyClause) {
      function executeFinallyClause() {
        return api_.cast(finallyClause()).then(function() {
          return promise;
        });
      }

      return api_.cast(promise)
          .then(executeFinallyClause, executeFinallyClause);
    },

    /**
     * Return a promise which will resolve on the next macro turn.
     * This can be useful when you want to do something after all
     * micro tasks within the current macro task are done.
     * NOTE: this uses a simple setTimeout(0), so it does not
     * guarantee to run at the very next turn; it could be a few turns
     * later...
     *
     * @return {Promise} Will resolve on the next macro turn and pass optional
     *     resolution on...
     */
    waitForNextMacroTurn: function(res) {
      return new Promise(function(resolve) {
        window.setTimeout(resolve.bind(null, res), 0);
      });
    }

  };

  return api_;

});
