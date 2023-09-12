// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @module commandQueueManager
 * @desc The command queue manager maintains an ordered queue of commands to be
 * executed.
 *
 * Commands are added to the queue using the addCommand() interface. They are
 * executed in FIFO ordering. If a command throws an exception,
 * CommandQueueManager dies. The layer above (CommandManager) should handle this
 * case and start a new CommandQueueManager.
 *
 * @author dskelton@google.com (Duncan Skelton)
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
  'qowtRoot/promise/worker',
  'qowtRoot/promise/deferred',
  'qowtRoot/utils/functionUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/commands/coreFailure',
  'qowtRoot/commands/coreFailureHandler'
  ], function(
    Worker,
    Deferred,
    FunctionUtils,
    PromiseUtils,
    TypeUtils,
    CoreFailure,
    CoreFailureHandler) {

  'use strict';

  /**
   * Creates a new unstarted, uncancelled CommandQueueManager. This is exposed
   * as a method on a factory object defined below.
   */
  var CommandQueueManager = function() {
    this.cancelDeferred_ = new Deferred();
    this.cancelReason_ = undefined;
    this.cancelled_ = false;
    this.started_ = false;

    this.optimisticWorker_ = Worker.create();
    this.dcpWorker_ = Worker.create();
    Object.seal(this); // for easier development
  };

  CommandQueueManager.prototype = {};
  CommandQueueManager.prototype.constructor = CommandQueueManager;

  /**
   * Starts a new CommandQueueManager. This returns immediately wihout running
   * any command work. No command work is performed until this method is called.
   *
   * Do not call this multiple times.
   * Do not call this after calling cancelAllCommands.
   *
   * @returns {Promise} a promise that settles when the CommandQueueManager
   *     dies. It will fulfill when CommandQueueManager died gracefully, and
   *     will reject if it died unexpectedly (due to an exception).
   */
  CommandQueueManager.prototype.start = function() {
    if (this.cancelled_) {
      throw new Error('Cannot call CommandQueueManager.start after it has ' +
          'been cancelled');
    }
    if (this.started_) {
      throw new Error('Cannot call CommandQueueManager.start multiple times');
    }
    this.started_ = true;
    var optPromise = this.optimisticWorker_.start();
    var dcpPromise = this.dcpWorker_.start();

    optPromise = optPromise.catch(
        this.cancelOnError_.bind(this, 'optimistic worker'));
    dcpPromise = dcpPromise.catch(
        this.cancelOnError_.bind(this, 'dcp worker'));

    dcpPromise = dcpPromise.catch(
        this.handleCoreFailure_.bind(this, optPromise));

    return Promise.all([optPromise, dcpPromise]);
  };

  /**
   * Whether start has been called already.
   *
   * @returns {boolean} whether start has been called or not.
   */
  CommandQueueManager.prototype.isStarted = function() {
    return this.started_;
  };

   /**
    * Cancels all commands in progress. Careful when using this, as it can
    * cancel writes that the user will expect to complete. For example, if a
    * user has queued edits in Sheet, and then switches tabs, an implementation
    * of tab switching might involve cancelling commands. If it does, it will
    * cancel the queued edits. Upon switch back, the user may notice his edits
    * are gone, or worse, the edits have been made but have not been properly
    * marshalled to Core, and will not be written to the spreadsheet file on
    * disk.
    *
    * It is safe to call this method if the user would not mind all pending
    * commands to be immediately interrupting, such as commands that just do
    * fetching and no mutating.
    *
    * In the long-term, we will not support this.
    *
    * This has an async component to this. You must wait for the returned
    * promise to settle before resuming command execution.
    *
    * This should cause the promise returned by start to fulfill.
    *
    * Do not call this multiple times.
    *
    * @returns {Promise} a promise that fulfills when cancellation finishes.
    */
  CommandQueueManager.prototype.cancelAllCommands = function() {
    // It is possible that cancelAllCommands is called after an error has
    // caused a prior call to cancel_. In that case, we just skip calling
    // cancel_, because the CommandQueueManager is already in the midst of
    // cleaning itself up.
    if (!this.cancelled_) {
      if (this.isEmpty()) {
        this.cancel_();
      } else {
        this.cancel_(new Error('CommandQueueManager.cancelAllCommands called'));
      }
    }
  };

  CommandQueueManager.prototype.cancel_ = function(reason) {
    if (this.cancelled_) {
      throw new Error('Cannot call CommandQueueManager.cancel_ multiple times');
    }
    this.cancelled_ = true;

    this.cancelReason_ = reason;
    this.cancelDeferred_.reject(reason);

    var cancelFn = FunctionUtils.makeConstantFunction(
        this.cancelDeferred_.promise);
    this.addItemsToWorkers_(cancelFn, cancelFn);
  };

  /**
   * Add a command to the manager. This schedules the optimistic phase and the
   * DCP phase to run.
   *
   * @param {Promise<QueueableCommand>|QueueableCommand} command The command
   *     being added.
   * @returns {Promise} a promise that settles when both the optimistic and DCP
   *     phases finish executing. On fulfillment, the result is an array with 2
   *     elements: [optResult, dcpResult]
   */
  CommandQueueManager.prototype.addCommand = function(command) {
    if (!TypeUtils.isPromiseLike(command)) {
      return this.addItemsToWorkers_(
          this.getOptimisticPhase_(command),
          this.getDcpPhase_(command));
    } else {
      // Make sure to preserve ordering. We cannot addItemsToQueues in a
      // promise block, because then we wouldn't order the items are added into
      // the queue.
      return this.addItemsToWorkers_(
          this.raceCancelPromise_(command)
              .then(this.getOptimisticPhase_.bind(this)),
          this.raceCancelPromise_(command)
              .then(this.getDcpPhase_.bind(this)));
    }
  };

  /**
   * This returns true when all the scheduled work has already completed, or no
   * work has ever been scheduled.
   *
   * @returns {boolean}
   */
  CommandQueueManager.prototype.isEmpty = function() {
    return this.dcpWorker_.isEmpty() && this.optimisticWorker_.isEmpty();
  };

  /**
   * Return the total number of pending work jobs.
   * @return {Integer}
   */
  CommandQueueManager.prototype.queueLength = function() {
    return this.dcpWorker_.pendingCount() +
           this.optimisticWorker_.pendingCount();
  };

  CommandQueueManager.prototype.cancelOnError_ = function(workerName, reason) {
    if (reason) {
      console.warn('CommandQueueManager ' + workerName + ' rejected', reason);
    }
    if (this.cancelled_) {
      if (reason === this.cancelReason_) {
        // This promise rejected because of abortion. This is not a problematic
        // case, so we swallow the exception here.
        return;
      }
    } else {
      // Commands have not been aborted, and we received an exception. We need
      // to abort now since we have two workers (optimistic and DCP), and one
      // worker might still be moving forward.
      this.cancel_(reason);
    }

    // Propagate the error.
    throw reason;
  };

  CommandQueueManager.prototype.handleCoreFailure_ = function(
      optimisticPromise, dcpRejectionReason) {
    if (!CoreFailure.isInstance(dcpRejectionReason)) {
      throw dcpRejectionReason;
    } else {
      // Wait for optimistic phases to terminate before initiating reverts.
      return PromiseUtils.cast(optimisticPromise).then(
          CoreFailureHandler.handle.bind(undefined, dcpRejectionReason));
    }
  };

  CommandQueueManager.prototype.getOptimisticPhase_ = function(command) {
    return this.callWithCancelGuard_.bind(this,
        this.assertCommand_(command).runOptimisticPhase);
  };

  CommandQueueManager.prototype.getDcpPhase_ = function(command) {
    return this.callWithCancelGuard_.bind(this,
        this.assertCommand_(command).runDcpPhase);
  };

  CommandQueueManager.prototype.callWithCancelGuard_ = function(fn) {
    return this.cancelReason_ ?
        Promise.reject(this.cancelReason_) :
        fn(this.cancelDeferred_.promise);
  };

  CommandQueueManager.prototype.raceCancelPromise_ = function(promise) {
    return Promise.race([
      this.cancelDeferred_.promise,
      promise
    ]);
  };

  CommandQueueManager.prototype.assertCommand_ = function(command) {
    TypeUtils.checkArgTypes('CommandQueueManager.addCommand', {
      command: [command, 'queueableCommand']
    });
    return command;
  };

  CommandQueueManager.prototype.addItemsToWorkers_ = function(optFn, dcpFn) {
    var optPromise = this.optimisticWorker_.addWork(optFn);
    var dcpPromise = this.dcpWorker_.addWork(dcpFn);
    return Promise.all([optPromise, dcpPromise]);
  };

  return {
    create: function() {
      return new CommandQueueManager();
    }
  };
});
