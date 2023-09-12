// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview This module adapts CommandBase into the QueueableCommand
 * interface. The QOWT codebase constructs instances of CommandBase, but
 * CommandManager now uses QueueableCommand. There is no intention for people
 * to start writing their own QueuableCommands. For the time being, QOWT
 * should continue to use CommandBase. QueueableCommand is package-private.
 */

define([
    'qowtRoot/utils/functionUtils',
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/commands/commandBase',
    'qowtRoot/commands/queueableCommand',
    'qowtRoot/commands/queueableCommandJoiner',
    'qowtRoot/commands/rootCommandBaseQueueableAdapter'
  ], function(
    FunctionUtils,
    PromiseUtils,
    TypeUtils,
    CommandBase,
    QueueableCommand,
    QueueableCommandJoiner,
    RootCommandBaseQueueableAdapter) {

  'use strict';

  var _factory = {
    /**
     * Creates a QueueableCommand from the passed-in CommandBase, which can be
     * either single or compound.
     */
    create: function(commandBase) {
      if (!CommandBase.isCommand(commandBase)) {
        throw new Error(
            'Passed non-commandBase to CommandBaseQueueableAdapter');
      }

      var queueableCommands = commandBase.getChildren().map(_factory.create);
      var currentChildCount = queueableCommands.length;
      queueableCommands.unshift(RootCommandBaseQueueableAdapter.create(
          commandBase, _factory.create));
      queueableCommands.push(_makeLateAddedCommand(
          commandBase, currentChildCount));

      var joinedQueueableCommand =
          QueueableCommandJoiner.join(queueableCommands);

      return joinedQueueableCommand;
    }
  };

  /**
   * Creates a QueueableCommand that adapts all late added children of
   * the root CommandBase of the command tree into the QueueableCommand
   * interface.
   */
  var _makeLateAddedCommand = function(commandBase, currentChildCount) {
    var lateAddedCommand = QueueableCommand.create();

    // We run the optimistic phase of the late-added children on the
    // DCP queue rather than on the optimistic queue. This is because
    // the command essentially "missed its turn" in running its
    // optimistic phase, considering that commands coming after it in
    // the sequence could already have executed their optimistic phases.
    // Instead, we run its optimistic phase right before we run its DCP
    // processing phase.
    lateAddedCommand.runOptimisticPhase = FunctionUtils.makeConstantFunction();
    lateAddedCommand.runDcpPhase = FunctionUtils.onceCallableFunction(
        function(cancelPromise) {
      var lateAddedChildren =
          commandBase.getChildren().slice(currentChildCount);
      var lateAddedChildCount = lateAddedChildren.length;
      if (lateAddedChildCount === 0) {
        commandBase.commandTreeDone();
      } else {
        // The revert manager asserts that commands are executed in order (to
        // assure that reverts, executed in reverse order, are correct). Since
        // late added commands have their optimistic phases executed out of
        // order, we need to assert these commands do not expect their work to
        // be revertible.
        if (lateAddedChildren.some(isRevertible_)) {
          throw new Error('Cannot late-add revertible children to command ' +
              commandBase.name);
        }
        var lateAddedQueueables =
            lateAddedChildren.map(_factory.create);
        // Recurse, in case the children's work adds more children to
        // commandBase.
        lateAddedQueueables.push(_makeLateAddedCommand(
            commandBase, currentChildCount + lateAddedChildCount));
        var joinedQueueable = QueueableCommandJoiner.join(
            lateAddedQueueables);
        if (joinedQueueable.hasInverse()) {
          throw new Error('Cannot late-add invertible children to ' +
              'command ' + commandBase.name);
        }
        return PromiseUtils.cast(
            joinedQueueable.runOptimisticPhase(cancelPromise)).then(function() {
              return joinedQueueable.runDcpPhase(cancelPromise);
            });
      }
    });
    lateAddedCommand.hasInverse =
        FunctionUtils.makeConstantFunction(false);
    lateAddedCommand.toString = FunctionUtils.makeConstantFunction(undefined);

    return lateAddedCommand;
  };

  function isRevertible_(commandBase) {
    return TypeUtils.isFunction(commandBase.doRevert) &&
        commandBase.getChildren().map(isRevertible_).some(isRevertible_);
  }

  return _factory;
});
