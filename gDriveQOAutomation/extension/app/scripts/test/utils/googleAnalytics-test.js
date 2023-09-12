/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test module for our Google Analytics
 * utility
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/features/utils',
  'utils/analytics/googleAnalytics',
  'test/mocks/mockMetricsPrivate',
  'test/mocks/mockGA'
  ], function(
    Features,
    GA,
    MockMetrics,
    MockGA) {

  describe("Google Analytics", function() {

    // see googleAnalytics.js
    var TRACKER = {
      'word': 'UA-44583639-1',
      'QO': 'UA-44583639-4'
    };

    // all async functions should fulfill within 10 seconds....
    this.timeout(10000);

    beforeEach(function() {
      // mock release build
      Features.setDebugOverride(false);
    });

    afterEach(function() {
      // reset mocks that the tests might have changed
      MockMetrics.reset();
      MockGA.reset();

      Features.clearDebugOverride();
      GA.reset();
    });


    it("should not support GA for debug platforms", function() {
      // fouce debug to be true
      Features.setDebugOverride(true);

      // remove our mock for this particular test
      window.__gaMock = undefined;

      var promise = GA.setTracker('word');
      return assert.isFulfilled(promise, "ga should NOT be supported on debug")
          .then(function() {
            assert.equal(window.__gaMock, undefined);
          });
    });


    it("should support GA on release platforms", function() {
      var promise = GA.setTracker('word');
      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            assert.equal(window.__gaMock.appName, TRACKER.word);
          });
    });


    // note: the very nature of this test is to verify that we
    // timeout waiting for the crashReporting callback to fire.
    // That means that it will invariably take a little longer than
    // the other tests... but worth it to ensure we never hang the app
    it("should timeout and reject if getIsCrashReportingEnabled " +
       "does not callback", function() {
      // set the mock timeout for getCrashReporting to something ridiculous
      window.__mockCrashReportingTimeout = 100000;

      var optionalMsg =
        'ga should time out if crash reporting does not respond quickly enough';

      var promise = GA.setTracker('word');
      return assert.isFulfilled(promise, optionalMsg)
          .then(function() {
            assert.equal(window.__gaMock.appName, undefined);
          });

    });


    it("should not support GA if crash reporting is not enabled", function() {
      // set the mock getCrashReporting to false
      window.__mockCrashReporting = false;

      var promise = GA.setTracker('word');
      return assert.isFulfilled(promise, 'dont track if reporting not allowed')
          .then(function() {
            assert.equal(window.__gaMock.appName, undefined);
          });

    });


    it("should only check for crash reporting once", function() {
      sinon.spy(chrome.metricsPrivate, 'getIsCrashReportingEnabled');

      var promise =
          GA.setTracker('word')
          .then(GA.sendState.bind(null, 'fakeState'));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            sinon.assert.calledOnce(
              chrome.metricsPrivate.getIsCrashReportingEnabled);
          });
    });

    it("should default to using the QO tracker if none is set", function() {
      var promise = GA.sendState('fakeState');
      return assert.isFulfilled(promise, 'default to QO tracker')
          .then(function() {
            assert.equal(window.__gaMock.appName, TRACKER.QO);
          });

    });

    it("should store next tracker name in the current tracker as a view name " +
        "before changing trackers", function() {
      var promise = GA.setTracker('word');

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            assert.equal(window.__gaMock.appViews[0], 'word');
            assert.equal(window.__gaMock.appViews.length, 1);
          });
    });


    it("should allow us sending new app states", function() {
      var promise =
          GA.setTracker('word')
          .then(GA.sendState.bind(null, 'fakeState'));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            assert.equal(window.__gaMock.appName, TRACKER.word);
            assert.equal(window.__gaMock.appViews[0], 'word');
            assert.equal(window.__gaMock.appViews[1], 'fakeState');
          });
    });


    it("should not send app states if they dont change", function() {
      var promise =
          GA.setTracker('word')
          .then(GA.sendState.bind(null, 'fakeState'))
          .then(GA.sendState.bind(null, 'fakeState'));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            assert.equal(window.__gaMock.appName, TRACKER.word);
            assert.equal(window.__gaMock.appViews.length, 2);
            assert.equal(window.__gaMock.appViews[1], 'fakeState');
          });
    });


    it("should record different states", function() {
      var promise =
          GA.setTracker('word')
          .then(GA.sendState.bind(null, 'fakeState'))
          .then(GA.sendState.bind(null, 'differentState'));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            assert.equal(window.__gaMock.appName, TRACKER.word);
            assert.equal(window.__gaMock.appViews[0], 'word');
            assert.equal(window.__gaMock.appViews[1], 'fakeState');
            assert.equal(window.__gaMock.appViews[2], 'differentState');
            assert.equal(window.__gaMock.appViews.length, 3);
          });
    });


    it("should allow us to send exception objects", function() {
      var fakeException = {
        msg: 'foobar',
        fatal: false
      };
      var promise =
          GA.setTracker('word')
          .then(GA.sendException.bind(null, fakeException));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            var mock = window.__gaMock;
            assert.equal(mock.appName, TRACKER.word);
            assert.equal(mock.exceptions[0].msg, fakeException.msg);
            assert.equal(mock.exceptions[0].fatal, fakeException.fatal);
          });
    });


    it("should allow us to send event data", function() {
      var fakeEvent = {
        category: 'foobar',
        action: 'action'
      };
      var promise =
          GA.setTracker('word')
          .then(GA.sendEvent.bind(null, fakeEvent));

      return assert.isFulfilled(promise, 'ga should be supported on release')
          .then(function() {
            var mock = window.__gaMock;
            assert.equal(mock.appName, TRACKER.word);
            assert.equal(mock.events.foobar.action, 1);
          });
    });

  });

  return {};
});
