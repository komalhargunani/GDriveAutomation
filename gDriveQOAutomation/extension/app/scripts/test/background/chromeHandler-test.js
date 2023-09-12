/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for chromeHandler
 * uses mocha-as-promised and sinon to test flow using promises
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'background/chromeHandler',
  'background/store/fileStore'
  ], function(
    ChromeHandler,
    FileStore) {

  'use strict';

  describe("ChromeHandler", function() {

    beforeEach(function() {
      mockChrome_();
      sinon.spy(chrome.tabs, 'update');
      createTabSpy_ = sinon.spy(chrome.tabs, 'create');
      sinon.spy(chrome.windows, 'create');
      return FileStore.init();
    });
    afterEach(function() {
      chrome.tabs.update.restore();
      chrome.tabs.create.restore();
      chrome.windows.create.restore();
    });


    describe("Handle connections", function() {
      it("should respond with qo version number", function() {
        var fakePort = {postMessage: function() {}};
        var fakeMsg = {msg: 'driveEnabled'};
        sinon.spy(fakePort, 'postMessage');
        ChromeHandler.handleIncomingMsg(fakePort, fakeMsg);
        sinon.assert.calledWith(fakePort.postMessage, {
          driveEnabled: true,
          supportsTeamDrives: true
        });
      });

      it("should ignore incoming msgs other than from drive", function() {
        var fakePort = {postMessage: function() {}};
        var fakeMsg = {foo: 'bar'};
        sinon.spy(fakePort, 'postMessage');
        ChromeHandler.handleIncomingMsg(fakePort, fakeMsg);
        sinon.assert.notCalled(fakePort.postMessage);
      });
    });


    describe("ChromeOS File Handling", function() {
      var focusTab = true;
      // run these test with different number of files
      for (var numberOfFiles = 1; numberOfFiles <= 3; numberOfFiles++) {
        (function (numberOfFiles) {

        it("should create " + numberOfFiles +
          " tab(s) in the current win if it is valid", function() {
          currentWin_ = mockWin_();
          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, currentWin_.id, numberOfFiles, false, focusTab));
        });


        it("should create " + numberOfFiles +
          " tab(s) in the last focussed win if current win is invalid (no id)",
          function() {
          currentWin_ = mockInvalidWin_();
          lastFocussedWin_ = mockWin_();

          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, lastFocussedWin_.id, numberOfFiles, false, focusTab));
        });


        it("should create " + numberOfFiles +
          " tab(s) in the last focussed win if there is no current win",
          function() {
          currentWin_ = undefined;
          lastFocussedWin_ = mockWin_();

          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, lastFocussedWin_.id, numberOfFiles, false, focusTab));
        });


        it("should create " + numberOfFiles +
          " tab(s) in the current win if current window is incognito",
          function() {
          currentWin_ = mockIncognitoWin_();
          lastFocussedWin_ = mockWin_();

          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, currentWin_.id, numberOfFiles, false, focusTab));
        });


        it("should CREATE new win, update tab and create " + (numberOfFiles-1) +
          " more tabs if there is no current win nor focussed win", function() {
          currentWin_ = undefined;
          lastFocussedWin_ = undefined;
          newWin_ = mockNewWin_();
          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, newWin_.id, numberOfFiles, true, focusTab));
        });


        it("should CREATE " + numberOfFiles +
          " tabs if there is no current win and focussed win is incognito",
          function() {
          currentWin_ = undefined;
          lastFocussedWin_ = mockIncognitoWin_();
          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, lastFocussedWin_.id, numberOfFiles, false, focusTab));
        });


       it("should create " + numberOfFiles +
          " tabs if current win AND focussed win are incognito",
          function() {
          currentWin_ = mockIncognitoWin_();
          lastFocussedWin_ = mockIncognitoWin_();
          return testChromeOSFile_(numberOfFiles)
            .then(expectedTabResults_.bind(
              null, currentWin_.id, numberOfFiles, false, focusTab));
        });

        }(numberOfFiles));

      }

    });

  });

  // ------------------- HELPER functions ----------------------

  var FAKE_VERSION = '1.2.3.4';
  var CREATE_TAB_CONF = {
    active: false,
    url: '../views/app.html?uuid='
  };
  var CREATE_CHROMEOS_TAB_CONF = {
    active: true,
    url: '../views/app.html?uuid='
  };
  var newWin_;
  var currentWin_;
  var lastFocussedWin_;
  var createTabSpy_;

  function testChromeOSFile_(numberOfFiles) {
    var mockFiles = [];
    for (var i = 0; i < numberOfFiles; i++) {
      mockFiles.push('foobar.docx');
    }
    return ChromeHandler.handleChromeOSFile(mockFiles);
  }

  function randomId_() {
    return Math.round(Math.random(100) * 100);
  }

  function mockChrome_() {
    chrome = chrome || {};
    chrome.app = chrome.app || {};
    chrome.app.getDetails = function() {
      return {
        version: FAKE_VERSION
      };
    };

    chrome.tabs = chrome.tabs || {};
    chrome.tabs.create = function(conf, resolve) {
      conf = conf || {};
      resolve({id: 999});
    };
    chrome.tabs.update = function(tabId, conf, resolve) {
      tabId = tabId || 0;
      conf = conf || {};
      resolve({id: 999});
    };

    chrome.windows = chrome.windows || {};
    chrome.windows.create = function(config, callback) {
      config = config || {};
      window.setTimeout(callback.bind(null, newWin_), 0);
    };

    chrome.windows.getCurrent = function(config, callback) {
      config = config || {};
      window.setTimeout(callback.bind(null, currentWin_), 0);
    };

    chrome.windows.getLastFocused = function(config, callback) {
      config = config || {};
      window.setTimeout(callback.bind(null, lastFocussedWin_), 0);
    };
    chrome.storage = chrome.storage || {};
    chrome.storage.local = chrome.storage.local || {};
    chrome.storage.local.get = function(params, resolve) {
      if (params[0] === 'chrome_store_ready') {
        resolve({'chrome_store_ready': true});
      } else {
        resolve({});
      }
    };
    chrome.storage.local.set = function(params, resolve) {
      if (params) {
        resolve();
      }
    };
  }

  function mockWin_() {
    return {
      id: randomId_(),
      incognito: false
    };
  }

  function mockNewWin_() {
    return {
      id: randomId_(),
      incognito: false,
      tabs: [{
        id: 9
      }]
    };
  }

  function mockIncognitoWin_() {
    return {
      id: randomId_(),
      incognito: true
    };
  }

  function mockInvalidWin_() {
    return {
      doesNotHaveId: 'foobar'
    };
  }

  function expectedTabResults_(winId, numberOfFiles, isNewWindow, focusTab) {
    var expectedConf = {};
    var tabConfig = focusTab ? CREATE_CHROMEOS_TAB_CONF : CREATE_TAB_CONF;
    _.extend(expectedConf, tabConfig);
    expectedConf.windowId = winId;

    var numCreatedTabs = isNewWindow ? numberOfFiles-1 : numberOfFiles;

    assert.equal(chrome.tabs.create.callCount, numCreatedTabs);

    if(numCreatedTabs > 0) {
      var args = createTabSpy_.args;
      focusTab ? assert.equal(args[0][0].active, true) :
        assert.equal(args[0][0].active, false);
      assert.equal(args[0][0].windowId, winId);
      assert.equal(args[0][0].url.startsWith("../views/app.html?uuid="), true);
    }

    assert.equal(chrome.windows.create.callCount, (isNewWindow ? 1 : 0));
  }

});

