/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview module which keeps track of the total
 * application state. Meaning it tracks states initiated
 * by the app itself (such as downloading), as well as
 * states coming from QOWT.
 *
 * It works with Google Analytics to log these states
 * and also provides the entry point for anyone logging
 * crashes and exceptions (which too will be sent to GA)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/errorCatcher',
  'utils/analytics/googleAnalytics'
  ], function(
    ErrorCatcher,
    GA) {

  'use strict';

  var api_ = {

    /**
     * Registers this module as an error catcher "error observer"
     * and sets the initial state.
     */
    init: function() {
      ErrorCatcher.addObserver(handleError_);
      api_.updateState('Init');
    },

    /**
     * In order for us to track the states for the
     * correct app, clients must call setApp at the
     * start of the session
     *
     * @param {string} appName the name of the app, eg 'word', 'sheet', 'point'
     * @param {string} fileExt the extension of the file, eg 'csv', 'doc', 'ppt'
     */
    setApp: function(appName, fileExt) {
      GA.setFileExt(fileExt);
      GA.setTracker(appName);
    },

    /**
     * Change the state of the app. If the state is different from
     * the current one, we will update our internal state and
     * log the state to Google Analytics
     *
     * We also set a window.qowtState object for backwards
     * compatibility with other test tools
     *
     * @param {string} newState the name of the new state
     * @param {object} context any contextual information. Used mainly by
     *                         the error state and only kept in
     *                         window.qowtState (eg it's NOT sent to GA)
     */
    updateState: function(newState, context) {
      if (state_ !== newState) {
        state_ = newState;

        // store object in window for backward compatibility with
        // (soon to be old) stability test reporter
        window.qowtState = {
          state: state_,
          context: context
        };

        // record our state change
        GA.sendState(state_);
      }
    }

  };

  // ---------------------- PRIVATE

  var state_;

  /**
   * Error catcher observer to transition ourselves to the crash
   * state if a fatal error has occurred
   *
   * @param {Error} error the error that was thrown and caught by the catcher
   */
  function handleError_(error) {
    var newState = error.gaState ? error.gaState :
    error.fatal ? 'FatalCrash' : 'NonFatalError';

    api_.updateState(newState, {
      // TODO(jliebrand): remove these old backward compatible vars
      // once we no longer rely on window.qowtState to check our error
      // crashes in our internal crash test framework.
      // (we should transition to monitoring our error crash rate using
      // GA and kill our internal app crash test framework)
      data_reason: error.message,
      data_fatal: error.fatal
    });
  }

  return api_;
});
