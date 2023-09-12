/**
 * @fileoverview
 * Utility module to tracking unit test execution times
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([], function() {

  'use strict';

  var api_ = {

    start: function start(tag) {
      perf_.mark(tag + '_started');
    },

    finish: function finish(tag) {
      markMeasureClear_(
        tag + '_finished',
        tag + '_started',
        tag + '_total'
      );
    },

    runTotal: function runTotal(tag) {
      return readable_(popMeasurement_(tag + '_total').duration);
    },

    reset: function reset() {
      perf_.clearMarks();
      perf_.clearMeasures();
    }

  };

  // PRIVATE ===================================================================

  var perf_ = window.performance;

  function markMeasureClear_(tag, from, total) {
    perf_.mark(tag);
    perf_.measure(total, from, tag);
    perf_.clearMarks(from);
    perf_.clearMarks(tag);
  }

  function popMeasurement_(tag) {
    var measurement = perf_.getEntriesByName(tag)[0];
    perf_.clearMeasures(tag);
    return measurement;
  }

  function readable_(ms) {
    var secs = 0, mins = 0, hours = 0;
    // under 1 second
    if (ms < 1000) {
      return Math.round(ms) + ' milliseconds';
    }
    // under 1 minute
    if (ms < (1000 * 60)) {
      return parseFloat(ms / 1000).toFixed(3) + ' seconds';
    }
    // under 1 hour
    if (ms < (1000 * 60 * 60)) {
      mins = Math.floor(ms / (1000 * 60));
      secs = parseFloat((ms - (mins * 60 * 1000)) / (1000)).toFixed(3);
      return mins + ' minutes ' + secs + ' seconds';
    }
    // over an hour?!
    hours = Math.floor(ms / (1000 * 60 * 60));
    mins = Math.floor((ms - (hours * 60 * 60 * 1000)) / (1000 * 60));
    secs = parseFloat(
      (ms - (hours * 60 * 60 * 1000) - (mins * 60 * 1000)) / (1000)).toFixed(3);
    return hours + ' hours ' + mins + ' minutes ' + secs + ' seconds';
  }

  return api_;

});
