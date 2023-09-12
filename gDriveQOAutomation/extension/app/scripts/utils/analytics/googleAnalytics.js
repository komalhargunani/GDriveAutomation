/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview wrapper module around the Google Analytics Bundle
 * JS library (https://github.com/GoogleChrome/chrome-platform-analytics/)
 *
 * Uses Promises to asynchronously determing if logging GA data is allowed
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/promiseUtils'
  ], function(
    Features,
    PromiseUtils) {

  'use strict';

  var api_ = {
    /**
     * Set the file extension parameter to be used with any successive GA calls.
     *
     * @param {string} fileExt file extension to be used with GA calls.
     */
    setFileExt: function(fileExt) {
      fileExt_ = fileExt;
    },

    /**
     * Set the session group parameter to be used with any successive GA calls.
     *
     * @param {string} sessionGroup Session identifier to be used with GA calls.
     */
    setSessionGroup: function(sessionGroup) {
      sessionGroup_ = sessionGroup;
    },

    /**
     * Set the Google Analytic tracker to use.
     * If any of the other APIs are called before setting the tracker,
     * we will default to the generic QO tracker.
     *
     * @param {string} appName either 'word', 'sheet' or 'point'
     */
    setTracker: function(appName) {
      return guard_(setTracker_, appName);
    },

    /**
     * Send a new "application state" to Google Analytics.
     * Will only truly send data to GA if the newState is
     * different from the previously sent state
     *
     * @param {string} newState can be any text we wish to send as a 'state'
     */
    sendState: function(newState) {
      return guard_(sendState_, newState);
    },

    /**
     * Send an 'exception' to Google Analytics.
     *
     * @param {Object} exception this is not a true JS ecxeption, but
     *                           merely a JSON object containing:
     * @param {string} exception.msg the exception string (eg title) to send
     * @param {boolean} exception.fatal a boolean indicating in the exception
     *                                  was fatal (shows up as 'crash' in GA)
     *                                  or if not (shows up as 'exception')
     */
    sendException: function(exception) {
      return guard_(sendException_, exception);
    },

    /**
     * Send an event to Google Analytics.
     *
     * @param {Object} eventData An event object.
     * @param {String} eventData.category A qowt:doAction contentType.
     *                 This is the analytics event 'category'.
     *                 Mandatory.
     * @param {String} eventData.action A qowt:doAction action specifier.
     *                 This is the analytics event 'action'.
     *                 Mandatory.
     * @param {Stirng} eventData.label An optional label.
     *                 This is the analytics event 'label'
     *                 Optional.
     * @param {String} eventData.value An optional value.
     *                 This is the analytics event 'value'
     *                 Optional.
     */
    sendEvent: function(eventData) {
      return guard_(sendEvent_, eventData);
    },

    /**
     * Reset internal cache. Used for unit tests
     */
    reset: function() {
      currentState_ = undefined;
      trackingPermitted_ = undefined;
      gaService_ = undefined;
      gaTracker_ = undefined;
    }
  };

  // -------------------- PRIVATE ----------------

  var TRACKERS = {
    'word': 'UA-44583639-1',
    'sheet': 'UA-44583639-2',
    'point': 'UA-44583639-3',
    'QO': 'UA-44583639-4'
  };
  var QO_SERVICE = 'Quickoffice';

  var currentState_;
  var trackingPermitted_;
  var gaService_;
  var gaTracker_;
  var sessionGroup_;
  var fileExt_;


  function guard_(privFunc, argument) {
    return ifGaSupported_()
        .then(initialise_)
        .then(privFunc.bind(null, argument))
        .catch(function(){
          // ignore errors like our "ga permission" error so that they don't
          // pollute the dev console in chrome 40 and onwards.
        });
  }

  function ifGaSupported_() {
    if (trackingPermitted_ !== undefined) {
      return trackingPermitted_ ?
          Promise.resolve() :
          Promise.reject(new Error('ga permission cached (not permitted)'));
    } else {
      return platformSupportsGA_()
          .then(isCrashReportingEnabled_)
          .catch(trackingNotPermitted_);
    }
  }

  function platformSupportsGA_() {
    if (window.analytics &&
          chrome &&
          chrome.metricsPrivate &&
          chrome.metricsPrivate.getIsCrashReportingEnabled &&
          (!Features.isDebug() || window.__gaMock !== undefined)) {
      return Promise.resolve();
    } else {
      var str = 'GA not supported on this platform';
      console.warn(str);
      return Promise.reject(new Error(str));
    }
  }

  function isCrashReportingEnabled_() {
    var timeoutError = new Error('Crash reporting setting timed out');

    return Promise.race([
        getCrashReportingSetting_(),
        PromiseUtils.delayThenReject(1000, timeoutError)
      ])
      .then(setGaTrackingPermission_);
  }

  function getCrashReportingSetting_() {
    return new Promise(function(resolve) {
      chrome.metricsPrivate.getIsCrashReportingEnabled(resolve);
    });
  }

  function setGaTrackingPermission_(crashReportingEnabled) {
    return new Promise(function(resolve, reject) {
      gaService_ = window.analytics.getService(QO_SERVICE);
      gaService_.getConfig().addCallback(function(config) {
        config.setTrackingPermitted(crashReportingEnabled);
        trackingPermitted_ = crashReportingEnabled;
        if (trackingPermitted_) {
          resolve();
        } else {
          console.warn('Crash reporting not allowed');
          reject();
        }
      });
    });
  }

  function trackingNotPermitted_() {
    trackingPermitted_ = false;
    return Promise.reject();
  }

  // make sure we initialise our tracker to the generic QO
  // tracker if it isn't already set...
  function initialise_() {
    if (gaTracker_ === undefined) {
      setTracker_('QO');
    }
    return Promise.resolve();
  }

  function setTracker_(appName) {
    if (gaTracker_) {
      // Tracker already exists so it must be the 'AppInit' tracker.
      // Log the new tracker name ('word'/'sheet'/'point') to it as a view.
      // This will enable us to do better segmentation in the AppInit tracker.
      gaTracker_.sendAppView(appName);
    }
    var trackerId = TRACKERS[appName];
    gaTracker_ = gaService_.getTracker(trackerId);
    // Since we use different trackers across the life time of the application
    // example AppInit -> Word/Sheet/Point, reset the sessionGroup parameter
    // if defined.
    if (sessionGroup_) {
      gaTracker_.set(
        window.analytics.Parameters.SESSION_GROUP, sessionGroup_);
    }
    if (appName !== 'QO' && fileExt_) {
      gaTracker_.set(window.analytics.Parameters.APP_ID, fileExt_);
    }
    gaTracker_.forceSessionStart();
    return Promise.resolve();
  }

  function sendState_(newState) {
    if (currentState_ !== newState) {
      currentState_ = newState;
      gaTracker_.sendAppView(newState);
    }
    return Promise.resolve();
  }

  function sendException_(exception) {
    gaTracker_.sendException(exception.msg, exception.fatal);
    return Promise.resolve();
  }

  function sendEvent_(eventData) {
    gaTracker_.sendEvent(
        eventData.category, eventData.action, eventData.label, eventData.value);
    return Promise.resolve();
  }


  return api_;
});


