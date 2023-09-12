// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview This is the abstract base class for the basic command unit that
 * CommandQueueManager and UndoManager deals with. It could represents either a
 * single or compound command. QueueableCommands can be constructed from
 * CommandBase through the use of CommandBaseQueueableAdapter. QueueableCommands
 * can be composed together using QueueableCommandJoiner.
 */
define([
    'qowtRoot/utils/typeUtils'
  ], function(
    TypeUtils) {

  'use strict';

  var _notImplemented = function() {
    throw new Error('Not implemented yet');
  };

  var _factory = {
    /**
     * Creates a new QueueableCommand.
     */
    create: function() {
      var _api = {
        /**
         * Runs the optimistic phase of the command.
         * @param cancelPromise {promise} reject this to cancel the optimistic
         *     phase. if the optimistic phase gets cancelled, the reason must
         *     be the same as that of the cancel promise.
         * @returns {promise} for when the optimstic phase completes.
         */
        runOptimisticPhase: _notImplemented,

        /**
         * Runs the optimistic phase of the command.
         * @param cancelPromise {promise} reject this to cancel the optimistic
         *     phase. if the optimistic phase gets cancelled, the reason must
         *     be the same as that of the cancel promise.
         * @returns {promise} for when the optimstic phase completes.
         */

        runDcpPhase: _notImplemented,

        /**
         * The inverse command of this command (used in undo).
         *
         * If hasInverse returns false, this is allowed to throw an exception.
         * @returns {QueueableCommand|Promise<QueueableCommand>}
         */
        getInverse: _notImplemented,

        /**
         * Returns whether the command has an inverse.
         * @returns {boolean} whether the command has an inverse.
         */
        hasInverse: _notImplemented,
        /**
         * For debugging.
         */
        toString: function() {
          return 'queueableCommand';
        }
      };

      _type.markAsType(_api);

      // Cause an exception to be thrown whenever someone misspells the name
      // of a property.
      Object.seal(_api);

      return _api;
    },

    isInstance: function(obj) {
      return _type.isOfType(obj);
    }
  };

  var _type = TypeUtils.createNewType('queueableCommand');
  return _factory;
});
