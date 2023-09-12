// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview suite controller
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dtilley@google.com (Dan Tilley)
 */
define([
  'unitTestRoot/phantomLogger',
  'unitTestRoot/testCollection',
  'unitTestRoot/testHtml',
  'unitTestRoot/testTimer'], function(
  Phantom,
  SubSystems,
  TestHTML,
  Timer) {

  'use strict';

  var recentTests_ = [],
      pendingTests_ = [],
      currentSuite_ = '',
      totalCount_ = 0,
      passedCount_ = 0,
      failedCount_ = 0,
      unrunCount_ = 0,
      status_ = '',
      exceptionCaught_ = false;

  function handleMsgFromTester_(evt) {
    if (exceptionCaught_) {
      console.error('Received msg from tester AFTER exception');
    } else {
      // Only parse and act on string data, since parsing an object will
      // throw. The Qowt Message Bus does post objects which we should ignore.
      if (typeof evt.data === 'string') {
        var msg = JSON.parse(evt.data);
        switch(msg.type) {
          case 'specResult':
            handleSpecResult_(msg);
            break;
          case 'runnerResult':
            handleRunnerResult_(msg);
            break;
          case 'specStated':
            handleSpecStarted_(msg);
            break;
          case 'exception':
            handleException_(msg);
            break;
          case 'pauseExecution':
            handlePauseExecution_();
            break;
          case 'QowtLoaded':
            handleQowtLoaded_();
            break;
          default:
            break;
        }
      }
    }
  }

  function handlePauseExecution_() {
    TestHTML.summary.pause(resumeSuite_);
  }

  function resumeSuite_() {
    resetLogs_();
    TestHTML.tester.contentWindow.postMessage('resume', '*');
  }

  function handleException_(msg) {
    TestHTML.summary.exception(currentSuite_, msg.details);
    TestHTML.passrate.set('--%');
    exceptionCaught_ = true;
    Phantom.log(TestHTML.summary.textContent);
    Phantom.log('Tester done - failed', 'red');
  }

  function handleRunnerResult_(msg) {
    totalCount_ += msg.totalCount;
    passedCount_ += msg.passedCount;
    failedCount_ += msg.failedCount;
    // only update status if it isn't already failed
    if (status_ !== 'failed') {
      status_ = msg.status;
    }
    if (pendingTests_.length) {
      TestHTML.passrate.set(pendingTests_.length);
      runPendingSuite_();
    } else {
      Timer.finish('test_run');
      var totalDuration = Timer.runTotal('test_run');
      if (TestHTML['run-all']) {
        TestHTML['run-all'].makeReset();
      }
      currentSuite_ = '';
      TestHTML.summary.reportResults(
        status_,
        totalCount_,
        passedCount_,
        failedCount_,
        unrunCount_,
        totalDuration
      );
      var rate = parseInt(passedCount_/totalCount_*100, 10);
      TestHTML.passrate.set(rate + '%');
      Phantom.log('--------------');
      Phantom.log(totalCount_ + ' total assertions count');
      Phantom.log(passedCount_ + ' passed');
      Phantom.log(failedCount_ + ' failed');
      if (unrunCount_ > 0) {
        Phantom.log(unrunCount_ + ' unrun');
      }
      Phantom.log('Tests took ' + totalDuration);
      Phantom.log('Total passrate: ' + rate + '%');
      Phantom.log('Tester done - ' + status_, status_ ===
          'failed' ? 'red' : 'green');
      if (window.jscoverage_report) {
        window.jscoverage_report();
        Phantom.log('Coverage done');
      }
    }
  }

  // Variables used to count suites & specs.
  var suiteNum_ = 0,
      specNum_ = 0;

  function handleSpecStarted_(msg) {
    specNum_ += 1;
    TestHTML.summary.run(msg.suiteName, msg.specName);
  }

  function handleSpecResult_(msg) {
    Phantom.log(
      msg.status + ' :: ' +
      '(suite' + suiteNum_ + ') ' + msg.suiteName + ' [' +
      '(spec' + specNum_ + ') ' + msg.specName + ']',
      (msg.status === 'passed' ? 'green' : 'red')
    );
    if (msg.pollution) {
      for (var pollutant in msg.pollution) {
        var pltn = msg.pollution[pollutant],
            dif = pltn.after - pltn.before;
        Phantom.log(
          'Test spec ' + specNum_ + ' caused ' + pollutant + ' pollution!',
          'red'
        );
        Phantom.log(
          (
            dif === 0 ?
              'different ' :
              dif + (dif > 0 ? ' extra ' : ' missing ')
          ) + pollutant + (Math.abs(dif) !== 1 ? 's' : ''),
          'red'
        );
        if (pltn.detail) {
          Phantom.log(pltn.detail);
        }
      }
    }
    var msgs = [];
    if (msg.results) {
      if (msg.status === 'failed') {
        Phantom.log(currentSuite_, 'red');
        Phantom.log(suiteNum_ + ' ' + msg.suiteName, 'red');
        Phantom.log(specNum_ + ' ' + msg.specName, 'red');
      }
      msg.results.forEach(function(result) {
        if (msg.status === 'failed') {
          Phantom.log(result, 'red');
        }
        msgs.push(result);
      });
    }
    TestHTML.log.addSpecResult(
      currentSuite_,
      suiteNum_,
      msg.suiteName,
      msg.specName,
      specNum_,
      msg.status,
      runSuiteManually_,
      msgs.join('\n')
    );
  }

  function resetLogs_() {
    pendingTests_ = [];
    status_ = '';
    totalCount_ = 0;
    passedCount_ = 0;
    failedCount_ = 0;
    unrunCount_ = 0;
    suiteNum_ = 0;
    specNum_ = 0;
    TestHTML.summary.reset();
    TestHTML.passrate.reset();
    TestHTML.log.reset();
    Timer.reset();
    console.clear();
  }

  function runAll_() {
    Phantom.log('Running all suites');
    resetLogs_();
    Timer.start('test_run');
    for (var i = 0; i < SubSystems.length; i++) {
      var subSystem = SubSystems[i];
      subSystem.suites.forEach(function(suite) {
        pendingTests_.push(suite);
      });
    }
    if (TestHTML['run-all']) {
      TestHTML['run-all'].makeHalt(haltRun_);
    }
    runPendingSuite_();
  }

  function haltRun_() {
    Phantom.log('Test run halted!');
    unrunCount_ = pendingTests_.length;
    pendingTests_ = [];
  }

  function runPendingSuite_() {
    currentSuite_ = pendingTests_.pop();
    runSuite_(currentSuite_);
  }

  function runSuiteManually_(evt) {
    resetLogs_();
    Timer.start('test_run');
    currentSuite_ = evt.srcElement.getAttribute('data-test') || undefined;
    runSuite_(currentSuite_);
  }

  function runSuite_(suite) {
    console.clear();
    Phantom.log('=====================');
    suiteNum_ += 1;
    specNum_ = 0;
    recentTests_.push(suite);
    while (recentTests_.length > 5) {
      recentTests_.shift();
    }
    window.localStorage.setItem('recentTests', JSON.stringify(recentTests_));
    Timer.start('qowt_load_' + suiteNum_);
    TestHTML.tester.setSrc('tester.html?suite=' + suite);
  }

  function handleQowtLoaded_() {
    Timer.finish('qowt_load_' + suiteNum_);
    var loadTime = Timer.runTotal('qowt_load_' + suiteNum_);
    Phantom.log('Test suite ' + suiteNum_ + ' loaded in ' + loadTime);
    TestHTML.storeSuiteLoadTime(suiteNum_, loadTime);
  }

  function niceSuiteName_(suite) {
    return suite.replace('unitTestRoot/', '').split('/').join(' > ');
  }

  function listSuites_() {
    TestHTML.controller.appendChild(TestHTML.makeRunAllButton(runAll_));
    TestHTML.controller.appendChild(TestHTML.makeTestAreaToggle());
    TestHTML.controller.appendChild(TestHTML.makeDebugLabel());
    var recentTests = [];
    recentTests_.forEach(function(test, id) {
      recentTests.unshift({
        id: id,
        name: niceSuiteName_(test),
        test: test
      });
    });
    TestHTML.controller.addListGroup(
      'recent',
      '5 most recent Tests',
      recentTests,
      runSuiteManually_
    );
    SubSystems.forEach(function(subSys, id) {
      var subSuites = [];
      subSys.suites.sort(function(a, b) {
        var aDirCount = a.split('/').length;
        var bDirCount = b.split('/').length;
        if (aDirCount === bDirCount) {
          return a > b;
        } else {
          return aDirCount - bDirCount;
        }
      });
      subSys.suites.forEach(function(suite, id) {
        subSuites.push({
          id: id,
          name: niceSuiteName_(suite),
          test: suite
        });
      });
      TestHTML.controller.addListGroup(
        'subSystem-' + id,
        subSys.name,
        subSuites,
        runSuiteManually_
      );
    });
  }

  function getSuiteName_() {
    var results = window.location.href.match(/\?suite=(.*)\&?/);
    if (results === null) {
      return '';
    } else {
      return results[1];
    }
  }

  (function init() {
    try {
      recentTests_ =
          JSON.parse(window.localStorage.getItem('recentTests')) || [];
      if (!(recentTests_ instanceof Array)) {
        recentTests_ = [];
      }
    } catch(e) {
      console.error(e);
      recentTests_ = [];
    }
    window.addEventListener('message', handleMsgFromTester_, false);
    window.onerror = function(e) {
      Phantom.log('ERROR: ' + e.toString(), 'red');
      var msg = {
        type: 'exception',
        details: 'UNCAUGHT ERROR IN SCRIPT - check console'
      };
      var fakeMsgEvent = {
        data: JSON.stringify(msg)
      };
      handleMsgFromTester_(fakeMsgEvent, '*');
    };
    var requestedSuite = getSuiteName_();
    if (requestedSuite === 'all') {
      runAll_();
    } else if (requestedSuite.length > 0) {
      resetLogs_();
      runSuite_(requestedSuite);
    } else {
      listSuites_();
    }
  })();

  return {};

});
