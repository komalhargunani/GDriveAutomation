
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Module that exposes the undo/redo toolbar buttons and menu
 * shortcut keys.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/commands/contentCheckers/docChecker',
    'qowtRoot/pubsub/pubsub',
  ], function(
    DocChecker,
    PubSub
  ) {

  'use strict';

  var _api = {

    /**
     * Triggers undo in a runs clause
     */
    runUndo: function() {
      _run('undo');
    },

    /**
     * Triggers redo in a runs clause
     */
    runRedo: function() {
      _run('redo');
    },

    /**
     * Triggers undo in a runs clause and waits for it. This should only be
     * called by Word tests, and should be called outside of runs and wait
     * clauses.
     */
    runWordUndoAndWait: function() {
      _runAndWait('undo');
    },

    /**
     * Triggers redo in a runs clause and waits for it.This should only be
     * called by Word tests, and should be called outside of runs and wait
     * clauses.
     */
    runWordRedoAndWait: function() {
      _runAndWait('redo');
    },
  };

  /**
   * Publishes a common action
   */
  var _run = function(action) {
    runs(function() {
      _publishCommonAction(action);
    });
  };

  /**
   * Publish a common action and wait for its effect to complete.
   * This happens inside its own runs() and waitFor() block, so only call from
   * outside of these blocks.
   *
   * Note: This implementation is Word-specific since it waits for the
   * DocChecker. Sheet and Point do not use the DocChecker, so it will always
   * be idle and will complete immediately.
   */
  var _runAndWait = function(action) {
    var _commandEnd = false;
    var _commandEndToken;

    runs(function() {
      _commandEndToken = PubSub.subscribe(
          'qowt:doAction', function(event, eventData) {
        event = event || {};
        if (_isCommandSequenceEnd(eventData)) {
          PubSub.unsubscribe(_commandEndToken);
          _commandEnd = true;
        }
      });

      _publishCommonAction(action);
    });

    waitsFor(function() {
      return _commandEnd;
    }, 'command sequence end', 30000);

    waitsFor(function() {
      return DocChecker.isIdle();
    }, 'Doc Checker idle', 30000);
  };

  /**
   * Checks whether or not the specified event data corresponds to the end of
   * a DCP command sequence.
   *
   * @param {Object} eventData data associated to the event.
   * @return {Boolean} true if the event data corresponds to the end of a DCP
   *                   command sequence, false otherwise.
   */
  var _isCommandSequenceEnd = function(eventData) {
    return eventData.context &&
           eventData.context.contentType === 'common' &&
           eventData.action === 'commandSequenceEnd';
  };

  /**
   * Publishes a doAction event with contentType 'common' and specified action.
   * It just so happens that, currently, action='undo' triggers an undo, and
   * action='redo' triggers a redo.
   *
   * @param {String} action the value of the action field of the doAction event.
   */
  var _publishCommonAction = function(action) {
    PubSub.publish('qowt:doAction', {
      action: action,
      context: {
        contentType: 'common'
      }
    });
  };

  return _api;
});
