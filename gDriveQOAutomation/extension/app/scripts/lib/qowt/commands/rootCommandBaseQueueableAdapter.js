// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview This module adapts CommandBase into the QueueableCommand
 * interface, but does so for the root of the command tree, and ignores
 * all of the children. This class should not be called by anything other
 * than CommandBaseQueueableAdapter.
 */


define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/commands/queueableCommand',
    'qowtRoot/utils/functionUtils',
    'qowtRoot/utils/promiseUtils'
  ], function(
    CommandBase,
    QueueableCommand,
    FunctionUtils,
    PromiseUtils) {

  'use strict';

  var _factory = {
    /**
     * Creates a QueueableCommand which adapts the root CommandBase of the
     * command tree into the QueueableCommand interface.
     */
    create: function(commandBase, compoundAdapter) {
      if (!CommandBase.isCommand(commandBase)) {
        throw new Error(
            'Passed non-commandBase to RootCommandBaseQueueableAdapter');
      }

      var rootQueueableCommand = QueueableCommand.create();
      rootQueueableCommand.runOptimisticPhase = commandBase.runOptimisticPhase;
      rootQueueableCommand.runDcpPhase = commandBase.runDcpPhase;
      rootQueueableCommand.hasInverse = function() {
        return commandBase.canInvert;
      };
      rootQueueableCommand.getInverse = FunctionUtils.memoize(
          _makeInverseCommand.bind(this, commandBase, compoundAdapter));
      rootQueueableCommand.toString = function() {
        return commandBase.name ||
            ('untitled CommandBase ' + commandBase.id());
      };

      return rootQueueableCommand;
    }
  };

  /**
   * Create a Future<QueueableCommand>|undefined which is either the inverse
   * of the root CommandBase of the command tree, or undefined if the command
   * is not invertible.
   */
  var _makeInverseCommand = function(commandBase, compoundAdapter) {
    if (!commandBase.canInvert) {
      throw new Error('Do not call getInverse if hasInverse = false');
    }

    return PromiseUtils.cast(commandBase.getInverse()).then(
        function(inverseCommand) {
      if (QueueableCommand.isInstance(inverseCommand)) {
        return inverseCommand;
      } else if (CommandBase.isCommand(inverseCommand)) {
        return compoundAdapter(inverseCommand);
      } else {
        throw new Error('Command ' + commandBase.name + ' returned an ' +
            'inverse of invalid type');
      }
    });
  };

  return _factory;
 });
