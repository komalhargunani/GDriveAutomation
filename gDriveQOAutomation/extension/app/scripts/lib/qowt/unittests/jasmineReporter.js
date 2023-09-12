// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview reporter for jasmine test execution
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  // PUBLIC
  //----------------------------------------------------------------------------
  var api_ = {

    'init': function init() {
      window.onerror = function(e) {
        var msg = {
          type: 'runnerResult',
          status: 'failed',
          totalCount: e,
          passedCount: 0,
          failedCount: 0,
          totalTime: 0
        };
        window.parent.postMessage(JSON.stringify(msg), '*');
      };


      jasmine.VERBOSE = true;
    },


    'reportRunnerStarting': function reportRunnerStarting() {
      this.startedAt = new Date();
    },


    'reportRunnerResults': function reportRunnerResults(runner) {
      var results = runner.results();
      var msg = {
        type: 'runnerResult',
        status: results.passed() ? 'passed' : 'failed',
        totalCount: results.totalCount,
        passedCount: results.passedCount,
        failedCount: results.failedCount,
        totalTime: ((new Date().getTime() - this.startedAt.getTime()) / 1000)
      };
      window.parent.postMessage(JSON.stringify(msg), '*');
    },


    'reportSuiteResults': function reportSuiteResults() {
    },


    'reportSpecStarting': function reportSpecStarting(spec) {
      var msg = {
        type: 'specStated',
        specName: spec.description,
        suiteName: spec.suite.description
      };
      window.parent.postMessage(JSON.stringify(msg), '*');
    },


    'reportSpecResults': function reportSpecResults(spec) {
      var results = spec.results();
      var msg = {
        type: 'specResult',
        suiteName: spec.suite.description,
        specName: spec.description,
        status: results.skipped ? 'skipped' : results.passed() ? 'passed' :
            'failed',
        results: []
      };

      if (spec.pollution) {
        msg.pollution = spec.pollution;
      }

      var resultItems = results.getItems();
      for (var i = 0, t = resultItems.length; i < t; i++) {
        var result = resultItems[i];
        result.message = result.message.replace(_bustParamRegex, '');
        if (!results.passed()) {
          msg.results = msg.results.concat(_getResultDescription(i + 1,
                result));
        }
      }

      window.parent.postMessage(JSON.stringify(msg), '*');
    },


    'log': function log() {
      // console.log(arguments);
    }

  };

  var _bustParamRegex = /\?bust\=\d*/;

  var _getResultDescription = function(resultIndex, result) {
    var lines = [];
    var assertionDescription = 'Assertion ' + resultIndex + ': ' +
        result.message;
    lines[0] = assertionDescription;
    if (result.trace && result.trace.stack) {
      lines = lines.concat(result.trace.stack.split('\n'));
    }
    return lines;
  };

  return api_;
});
