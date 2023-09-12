// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview
 * Tester module which will load the required
 * test suite and execute it, the idea is that this module
 * is loaded in a page which receives the suite to load as
 * a url query argument (eg tester.html?suite=foobar)
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dtilley@google.com (Dan Tilley)
 */

require.config({
  waitSeconds: 30
});

define([
  'unitTestRoot/testPollution', // Must be loaded first
  'unitTestRoot/jasmineReporter',
  'unitTestRoot/jasmineMatchers',
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub'], function(
  Pollution,
  JasmineReporter,
  JasmineMatchers,
  Features,
  PubSub) {

  'use strict';

  var suite_;

  function getSuiteName_() {
    var results = window.location.href.match(/\?suite=(.*)/);
    if (results === null) {
      return '';
    } else {
      return results[1];
    }
  }

  function loadSuite_(suite) {
    requirejs.onError = function(err) {
      console.log('error with: ' + err.requireModules);
      var msg = {
        type: 'exception',
        details: err.requireModules ?
            'RequireJs error (' + err.requireType + '). Problems with' +
            ' modules: ' + err.requireModules + '\n' + err.stack :
            err.message
      };
      window.parent.postMessage(JSON.stringify(msg), '*');
    };
    require([suite], function() {
      setTimeout(executeTests_, 0);
    });
  }

  function executeTests_() {
    window.parent.postMessage(JSON.stringify({type:'QowtLoaded'}), '*');
    jasmine.VERBOSE = true;
    jasmine.getEnv().addReporter(JasmineReporter);
    jasmine.getEnv().execute();
  }

  function handleMessage_(msg) {
    if (msg.data === 'resume') {
      executeTests_();
    }
  }

  function globalBeforeEach_() {
    window.beforeEach(function() {
      this.addMatchers(JasmineMatchers);
      Features.enable('suppressPromoMessages');
      PubSub.publish('qowt:init');
      Pollution.cacheTestState();
    });
  }


  function globalAfterEach_() {
    window.afterEach(function() {
      Features.disable('suppressPromoMessages');
      PubSub.publish('qowt:disable');
      var retVal = PubSub.publish('qowt:destroy');
      this.pollution = Pollution.getPollutionDetails();
      Pollution.reset();
      return retVal;
    });
  }

  (function _onLoad() {
    window.addEventListener('message', handleMessage_, false);
    globalBeforeEach_();
    globalAfterEach_();
    suite_ = getSuiteName_('suite');
    if (suite_) {
      loadSuite_(suite_);
    }
  })();

  return {};

});
