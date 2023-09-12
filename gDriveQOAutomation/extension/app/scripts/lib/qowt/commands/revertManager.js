// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Handles reversion. Any revertable action needs to take a revert
 * token, and schedule a revert function. When the revertable action completes
 * (no longer should be considered revertable), complete must be called on the
 * token.
 */

define([
    'qowtRoot/utils/promiseUtils'
    ], function(
     PromiseUtils) {

  'use strict';

  var _factory = {
    /**
     * Creates a token for an action that may be reverted.
     */
    createToken: function() {
      var _scheduled = false;
      var _completed = false;
      var _id = _counter;
      _counter++;

      var _api = {
        /**
         * After this call, before the call to complete (if it hasn't been
         * called already) the action may potentially be reverted. Calling
         * RevertManager.revertAll will revert it.
         * @param revertFn {Function} the function that performs the revert.
         */
        schedule: function(revertFn) {
          if (_scheduled) {
            throw new Error('schedule called multiple times on RevertToken ' +
                _id);
          }
          _scheduled = true;
          if (!_completed) {
            _revertList.push({
              fn: revertFn,
              token: _api,
              id: _id
            });
          }
        },

        /**
         * Once this is called, the action can never be reverted. Tokens must
         * have complete called on them in the same order as they had schedule
         * called on them.
         */
        complete: function() {
          if (_completed) {
            throw new Error('Revert token ' + _id + ' completed multiple ' +
                'times');
          }
          _completed = true;
          if (_scheduled) {
            var item = _revertList.shift();
            if (item === undefined) {
              throw new Error('Revert token ' + _id + ' completed, but list ' +
                  'is empty');
            }
            if (item.token !== _api) {
              _revertList.unshift(item);
              throw new Error('Revert token ' + _id + ' completed, but ' +
                  'item on top of list is ' + item.id);
            }
          }
        }
      };

      return _api;
    },

    /**
     * Once this is called, the action can never be reverted. Tokens must
     * have cancel called on them in reverse order as they had schedule
     * called on them.
     */
    cancelAll: function() {
      _revertList = [];
    },

    /**
     * Reverts all tokens that are currently scheduled but not completed.
     */
    revertAll: function() {
      var _oldRevertList = _revertList;
      _revertList = [];
      return PromiseUtils.pipeline(_oldRevertList.reverse().map(function(item) {
        return item.fn;
      }));
    },

    /**
     * Returns whether anything would be reverted if a revertAll were called
     * right now. For testing and debugging purposes only.
     */
    isEmpty: function() {
      return _revertList.length === 0;
    },

    /**
     * Clears the revert list, so that no currently pending commands will ever
     * be reverting from this point forward. Note that if a pending command
     * completes after it's been cleared from the revert list, then an exception
     * will be thrown.
     */
    reset: function() {
      _revertList = [];
    }
  };

  var _counter = 0;
  var _revertList = [];

  return _factory;
});
