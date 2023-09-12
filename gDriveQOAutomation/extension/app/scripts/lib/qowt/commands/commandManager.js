// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Use this module to dispatch newly created commands into the
 * CommandQueueManager (which dispatches them to QOWT and Core), and into the
 * UndoManager.
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandQueueManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandBaseQueueableAdapter',
  'qowtRoot/commands/revertManager',
  'qowtRoot/commands/undo/undoManager',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/promiseUtils'], function(
  PubSub,
  CommandQueueManager,
  CommandBase,
  CommandBaseQueueableAdapter,
  RevertManager,
  UndoManager,
  TypeUtils,
  PromiseUtils) {

  'use strict';

  var _api = {
    /**
     * Puts this command on the end of the queue to be executed.
     * @param command {QueueableCommand|CommandBase} the command to add to the
     *     queue.
     *
     * @returns {Promise} a promise that settles when both the optimistic and
     *     DCP phases finish executing. On fulfillment, the result is an array
     *     with 2 elements: [optResult, dcpResult]
     */
    addCommand: function(command) {
      TypeUtils.checkArgTypes('CommandManager.addCommand', {
        command: [command, 'queueableCommand', 'commandBase']
      });
      if (CommandBase.isCommand(command)) {
        command = CommandBaseQueueableAdapter.create(command);
      }
      if (command.hasInverse()) {
        UndoManager.pushUndo(command.getInverse());
      }
      _commandCount++;
      return _commandQueueManager.addCommand(command);
    },

    /**
     * Undo the last command that was added by addCommand, if there is one.
     *
     * @returns {Promise} fulfills with the undo finishes executing.
     */
    undoLastCommand: function() {
      var undo = UndoManager.popUndo();
      if (undo) {
        _commandCount++;
        // Redo stack is populated automatically by UndoManager.
        return _commandQueueManager.addCommand(undo);
      }
    },

    /**
     * Redo the last command that was undone by popUndo, if there is one.
     *
     * @returns {Promise} fulfills with the undo finishes executing.
     */
    redoLastCommand: function() {
      var redo = UndoManager.popRedo();
      if (redo) {
        _commandCount++;
        // Undo stack is populated automatically by UndoManager.
        return _commandQueueManager.addCommand(redo);
      }
    },

    /**
     * Cancels the currently executing commands, and unschedules all pending
     * commands.
     *
     * @returns {Promise} fulfills when all running commands have terminated and
     *     we are ready to start executing new commands.
     */
    cancelAllCommands: function() {
      UndoManager.reset();
      _commandQueueManager.cancelAllCommands();
      _commandQueueManager = CommandQueueManager.create();
      RevertManager.cancelAll();
      // Don't start the new CommandQueueManager. When the one currently running
      // finishes, it will call _onCommandQueueManagerDone, which will start
      // this new one.
      return _runningCommandQueueManagerDone;
    },

    /**
     * @return {boolean} Whether the command queue is empty.
     */
    isEmpty: function() {
      return _commandQueueManager.isEmpty() &&
          // If the current commandQueueManager is not started, there is still
          // some other instance of CommandQueueManager that hasn't finished its
          // cancellation. So that effectively means this CommandManager isn't
          // "empty".
          _commandQueueManager.isStarted();
    },

    /**
     * Returns the number of total commands processed.
     * @return {Integer}
     */
    commandsProcessed: function() {
      return _commandCount;
    },

    /**
     * E2E TEST API; This is intended solely to interface with
     * WaitFor.runsEdit() it should NOT be called in any production code.
     * Execute a function that adds commands to the queue,
     * then resolve once the queue is empty again.
     * @param {Function} func The function that adds commands.
     * @return {Promise}
     */
    __doResolveOnEmpty: function(func) {

      if (!TypeUtils.isFunction(func)) {
        throw new Error('doResolveOnEmpty must be passed a function');
      }

      var token, commandsSeen;

      return new Promise(function(resolve) {

        tryEdit();

        // only start our edit and wait if the queue is empty; if not
        // wait for it to be empty before trying
        function tryEdit() {
          if (_api.isEmpty()) {
            doEdit();
          }
          else {
            window.setTimeout(tryEdit, 0);
          }
        }

        // once the queue is empty, do our edit and wait
        function doEdit() {
          // Get the number of commands we have already processed.
          commandsSeen = _api.commandsProcessed();

          // subscribe for undo redo; these are core driven commands and we
          // might receive data in chunks from core, during this time command
          // manager can be idle/ empty. But we are not done yet! and we should
          // not resolve
          // TODO: Currently we only see failures for undo/redo, probably
          // because of CQO-1166. If we see failures for other core driven
          // commands then this check should be generalised for all core driven
          // commands.
          listenForUndoRedo();
          var isDcpIdle = true;

          function listenForUndoRedo() {
            var kUndoCmd = 'qowt:cmdundoStart';
            var kRedoCmd = 'qowt:cmdredoStart';
            var undoToken = subscribeAndGetToken(kUndoCmd);
            var redoToken = subscribeAndGetToken(kRedoCmd);

            function subscribeAndGetToken(signal) {
              return PubSub.subscribe(signal, toggleAndListenToStop);
            }

            function toggleAndListenToStop(signal) {
              isDcpIdle = false;
              var token = (signal === kRedoCmd) ? redoToken : undoToken;
              // we no longer need to listen to this signal; unsubscribe
              PubSub.unsubscribe(token);
              var stopToken =
                  PubSub.subscribe('qowt:cmdcommandSequenceEndStop',
                      function toggleAndUnsubscribe() {
                        isDcpIdle = true;
                        PubSub.unsubscribe(stopToken);
                      });
            }
          }

          // do the actual edit
          func();

          // wait for the command manager to have processed more
          // commands than before the edit AND for it to be empty AND dcp
          // commands to be done
          token = window.setInterval(function() {
            if ((_api.commandsProcessed() > commandsSeen) && _api.isEmpty() &&
                isDcpIdle) {
              window.clearInterval(token);
              resolve();
            }
          }, _pollingFrequency);
        }

      });
    }
  };

  function _startCommandQueueManager() {
    _runningCommandQueueManagerDone = _commandQueueManager.start()
        .catch(_handleCommandQueueManagerError)
        .then(_onCommandQueueManagerDone.bind(undefined, _commandQueueManager));
    // Don't return a promise here. We are not interested in waiting for the
    // newly started command queue manager to terminate. Saving the promise in
    // the _runningCommandQueueManagerDone variable is enough to be useful.
  }

  function _onCommandQueueManagerDone(finishedCommandQueueManager) {
    _runningCommandQueueManagerDone = undefined;
    if (finishedCommandQueueManager === _commandQueueManager) {
      _commandQueueManager = CommandQueueManager.create();
    }
    // If someone called CommandManager.cancelAllCommands,
    // _commandQueueManager !== finishedCommandQueueManager, because a new one
    // was already created. We start that one instead of instantiate a new one,
    // as it probably already has commands queued up.
    _startCommandQueueManager();
  }

  function _handleCommandQueueManagerError(reason) {
    try {
      PromiseUtils.throwAndEscapeChain(reason);
    } catch (e) {
      // We have now made the exception escape the chain. This will cause the
      // application to crash. We can forget about it and move on, by
      // swallowing. In production, we don't actually need to move on, since the
      // application will have crashed, but for testing, we need to be able to
      // continue from this point.
    }
  }

  var _runningCommandQueueManagerDone, _commandQueueManager,
      // How long in milliseconds between checking the command queue state.
      _pollingFrequency = 100,
      // Counts the number of commands processed.
      // Note: Does not get flushed upon qowt:disable
      _commandCount = 0;

  (function init() {
    _commandQueueManager = CommandQueueManager.create();
    _startCommandQueueManager();
    PubSub.subscribe('qowt:disable', _api.cancelAllCommands);
  })();

  return _api;

});
