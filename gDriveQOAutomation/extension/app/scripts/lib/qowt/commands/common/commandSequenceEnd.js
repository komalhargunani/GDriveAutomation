// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Command factory for a Core-driven end transaction.
 *
 * Marks the end of a sequence of commands that imply changes in the model.
 * For example, when the Core send a series of updates in response to an
 * undo/redo action.
 *
 * Note that this sequence of commands differs from a normal transaction.
 * In this case, it is not atomic and we cannot roll back the changes.
 *
 * @see commandSequenceEnd.js
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/selection/selectionManager',
    'qowtRoot/utils/tryUtils'
  ], function(
    CommandBase,
    PubSub,
    SelectionManager,
    Try
  ) {

  'use strict';

  var _factory = {
    /**
     * Factory function for creating a new command.
     */
    create: function(context) {

      var module = function() {

        var _api = CommandBase.create(
            'commandSequenceEnd', true, false);

        _api.doOptimistic = function() {

          _updateUndoRedoState(context);

          // We do not verify the document for non-optimistic commands
          // because we cannot guarantee that the Core has not further
          // modified its own DOM since it processed this command.

          // TODO dtilley Ensure we do verify the document once
          // DOM signatures have been implemented.

          if (context.context) {
            var snapshot = Try.ignore(JSON.parse.bind(JSON, context.context));
            SelectionManager.restoreSnapshot(snapshot);
          }
          PubSub.publish('qowt:unlockScreen');

          // Signal idle as the last thing once all processing is completed.
          PubSub.publish('qowt:stateChange', {
              module: 'commandSequence',
              state: 'idle'});
        };

        // private

        /**
         * Updates the states of the undo-redo buttons and menu items.
         *
         * @param {Object} info
         * @param {Boolean} info.canUndo true if it is possible to
         *                  perform an undo action, false otherwise.
         * @param {Boolean} info.canRedo true if it is possible to
         *                  perform a redo action, false otherwise.
         */
        function _updateUndoRedoState(info) {
          // TODO(chehayeb) rename the event types once Core-driven
          // undo/redo becomes production code.
          var signal = (info.canUndo) ?
              'qowt:undoNonEmpty' : 'qowt:undoEmpty';
          PubSub.publish(signal);

          signal = (info.canRedo) ?
              'qowt:redoNonEmpty' : 'qowt:redoEmpty';
          PubSub.publish(signal);
        }

        return _api;
      };

      var instance = module();
      return instance;
    }
  };

  return _factory;
});
