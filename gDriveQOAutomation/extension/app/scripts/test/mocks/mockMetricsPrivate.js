/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview module to mock out chrome UMA apis for testing
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  return {
    reset: function() {
      window.__mockCrashReporting = true;
      window.__mockCrashReportingTimeout = 0;

      // mock out google analytics calls, and fake that chrome crash reporting
      // is turned on
      window.chrome = window.chrome || {};
      window.chrome.metricsPrivate = window.chrome.metricsPrivate || {};

      // Mock out a UMA sink so we can test data sent to UMA.
      window.__umaMock = window.__umaMock || {
        // A sink for the recordValue() API.
        // The object keys are histograms, eg, FileFormat, PageCount etc.
        // Values are arrays (the buckets in each histogram).
        // An array element contains the value for that bucket.
        values: {}
      };

      // Mock out the Metrics API so UMA calls are executed when invoked through
      // the monkey interaction framework. This mock is not present in a regular
      // debug environment - it's only in the monkey test framework.
      window.chrome.metricsPrivate = {
        'getIsCrashReportingEnabled': function(callback) {
          // to make this as real as possible, use a timeout since the
          // original function is async
          window.setTimeout(function() {
            callback.call(this, window.__mockCrashReporting);
          }, window.__mockCrashReportingTimeout);
        },

        /**
         * Records a value against the specified histogram. Our implementation
         * always uses a linear histogram hence the value represents a
         * particular slot in the histogram.
         *
         * @param {Object} metricDescr Descriptor for the stored metric.
         *         See crx/app/script/utils/metrics.js
         * @param {Integer} index Index of the histogram bucket to record data
         *                        in.
         */
        'recordValue': function(metricDescr, index) {
          // Create the histogram array on it's first use and a reference
          // variable to the same thing for ease of use.
          var histogram = window.__umaMock.values[metricDescr.metricName] =
              window.__umaMock.values[metricDescr.metricName] || [];
          histogram[index] = (histogram[index]) ? histogram[index]++ : 1;
        }
      };
    }
  };

});