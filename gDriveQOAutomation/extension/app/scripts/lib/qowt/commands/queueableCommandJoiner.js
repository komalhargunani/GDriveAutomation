// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview This class takes a sequence of QueueableCommands and joins them
 * together into a compound QueueableCommand. The compound QueueableCommand
 * performs all the actions of the constituent commands in sequence. It is also
 * invertible, and composes the inverse together from the inversese of its
 * constituent commands.
 */
define([
    'qowtRoot/commands/queueableCommand',
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/functionUtils',
    'qowtRoot/utils/typeUtils'
  ], function(
    QueueableCommand,
    PromiseUtils,
    FunctionUtils,
    TypeUtils) {

  'use strict';

  var _factory = {
    /**
     * Takes a sequence of QueueableCommands and creates a single
     * QueueableCommand. Qowt and core futures are joined together into single
     * qowt and core futures. The inverse is computed by taking all invertible
     * commands, inverting them, and reversing the sequence, and joining them.
     * @param queueableCommandList {Array} the sequence of QueueableCommands.
     * @returns {QueueableCommand} a joined QueueableCommand.
     */
    join: function (queueableCommandList) {
      if (!TypeUtils.isList(queueableCommandList)) {
        throw new Error('Non-list passed to QueueableJoiner');
      }

      if (!queueableCommandList.every(QueueableCommand.isInstance)) {
        throw new Error('List passed with non-commands');
      }

      if (queueableCommandList.length === 1) {
        return queueableCommandList[0];
      }

      // Copy the list to protect from being mutated from under us.
      queueableCommandList = queueableCommandList.slice(0);

      var joined = QueueableCommand.create();

      var _makeJoinedRunner = function(runnerGetter) {
        var runners = queueableCommandList.map(runnerGetter);
        return FunctionUtils.onceCallableFunction(function(cancelPromise) {
          var boundRunners = runners.map(function(runner) {
            return runner.bind(undefined, cancelPromise);
          });
          return PromiseUtils.pipeline(boundRunners);
        });
      };

      joined.runOptimisticPhase = _makeJoinedRunner(function(command) {
        return command.runOptimisticPhase;
      });

      joined.runDcpPhase = _makeJoinedRunner(function(command) {
        return command.runDcpPhase;
      });

      joined.hasInverse = FunctionUtils.memoize(function() {
        return queueableCommandList.some(function(command) {
          return command.hasInverse();
        });
      });

      joined.getInverse = FunctionUtils.memoize(function() {
        var invertibles = queueableCommandList.filter(function(command) {
          return command.hasInverse();
        });

        if (invertibles.length === 0) {
          throw new Error('Do not call getInverse when hasInverse returns ' +
              'false');
        }

        var inversePromises = invertibles.map(function(command) {
          return command.getInverse();
        });

        return Promise.all(inversePromises).then(function(inverses) {
          return _factory.join(inverses.reverse());
        });
      });

      joined.toString = function() {
        return queueableCommandList.map(function(command) {
          return command.toString();
        }).filter(function (str) {
          return !!str;
        }).join(',');
      };

      return joined;
    }
  };

  return _factory;
});
