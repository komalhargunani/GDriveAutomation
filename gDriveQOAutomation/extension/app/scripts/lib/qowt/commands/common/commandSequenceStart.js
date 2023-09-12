// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Command factory for a command sequence start.
 *
 * Marks the start of a sequence of commands that will imply changes in the
 * model. For example, when the Core send a series of updates in response
 * to an undo/redo action.
 *
 * Note that this sequence of commands differs from a normal transaction.
 * In this case, it is not atomic and we cannot roll back the changes.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/pubsub/pubsub',
  ], function(
    CommandBase,
    PubSub
  ) {

  'use strict';

  var _factory = {
    /**
     * Factory function for creating a new command.
     */
    create: function() {

      var module = function() {

        var _api = CommandBase.create(
            'commandSequenceStart', true, false);

        _api.doOptimistic = function() {
          // we need to ensure that no user-authored edits are made whilst
          // we are processing this sequence of commands.
          PubSub.publish('qowt:lockScreen');
          // the execution of this command is a text tool suppressor so we
          // publish a state-change to 'non-idle.
          PubSub.publish('qowt:stateChange', {
              module: 'commandSequence',
              state: 'executing'
          });
        };

        return _api;
      };

      var instance = module();
      return instance;
    }
  };

  return _factory;
});
