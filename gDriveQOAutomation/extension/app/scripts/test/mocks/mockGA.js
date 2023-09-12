/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview module to mock out google analytics for testing
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  return {
    reset: function() {
      window.__gaMock = {
        params: [],
        appViews: [],
        exceptions: [],
        events: {},
        forceSessionStart: 0
      };
      window.analytics = {
        'Parameters': { 'SESSION_GROUP': 'dummy value' },
        'getService': function() {
          return {
            getConfig: function() {
              return {
                addCallback: function(callback) {
                  window.setTimeout(function() {
                    callback.call(this, {
                      setTrackingPermitted: function() {}
                    });
                  });
                }
              };
            },
            getTracker: function(appName) {
              window.__gaMock.appName = appName;
              return {
                set: function(gaParameter, gaValue) {
                  window.__gaMock.params.push({
                    param: gaParameter,
                    value: gaValue
                  });
                },
                sendAppView: function(appView) {
                  window.__gaMock.appViews.push(appView);
                },
                sendException: function(msg, fatal) {
                  window.__gaMock.exceptions.push({
                    msg: msg,
                    fatal: fatal
                  });
                },
                forceSessionStart: function() {
                  window.__gaMock.forceSessionStart++;
                },
                /**
                 * Mocked sendEvent.
                 * @param {Object} eventData An event object.
                 * @param {String} eventData.category A qowt:doAction
                 *                 contentType. This is the analytics event
                 *                  'category'. Mandatory.
                 * @param {String} eventData.action qowt:doAction action.
                 *                 specifier This is the analytics event
                 *                 'action'. Mandatory.
                 */
                sendEvent: function(category, action) {
                  if (!window.__gaMock.events[category]) {
                    window.__gaMock.events[category] = {};
                  }

                  var catref = window.__gaMock.events[category];
                  if (!catref[action]) {
                    catref[action] = 0;
                  }
                  catref[action]++;
                }
              };
            }
          };
        }
      };
    }
  };

});
