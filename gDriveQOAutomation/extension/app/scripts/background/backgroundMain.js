/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview The main background page script.
 * It registers for various callbacks to ensure that
 * it gets notified of files and streams which are
 * requested to be opened using the Quickoffice app.
 *
 * It also initialises the Chrome handler, the File store and
 * the public page API.
 *
 * NOTE: we use native promises here because we must ensure
 * we register all the relevant event listeners ONLOAD... Since
 * we are an events page that is launched due to any event we
 * listen for, we also receive that event during the load. Thus
 * if we would register our event listeners when RequireJS is done,
 * it would be too late.
 *
 * NOTE: since this background page is retrieved by the app via
 * chrome.runtime.getBackgroundPage, we have to expose our API on
 * the global window object... not quite as modular as requireJs
 * but it'll do for now
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

(function() {

  'use strict';

  /**
   * A Promise which initialises the necessary background modules.
   *
   * Note that we use a Promise so that we can still (during the load of
   * this script) add chrome event handlers further down, which can then
   * easily use the initialised ChromeHandler on their callbacks.
   *
   * Specifically, this Promise does the following:
   *
   * 1. Requires our ChromeHandler module to deal with the various external
   * chrome requests we might get; e.g connections from Drive Web UI,
   * incoming HTTP Streams, or files received from the ChromeOS Files app
   *
   * 2. Requires our PageAPI module to define the 'background page'
   * functions that can be called from within the application
   *
   * 3. Requires our FileStore module and initialises it to read
   * in its content from localStorage (if it was previously persisted)
   *
   * @private
   */
  var requirePromise_ = new Promise(function(resolve) {
    require(['background/store/fileStore',
      'background/chromeHandler',
      'background/pageAPI'], function(FileStore, ChromeHandler) {
        FileStore.init().then(function() {
          /**
          * A flag indicating that the background page's API is ready to be
          * used. This flag becomes defined once the background page has loaded
          * all of its requireJS modules. This is needed since the app could
          * otherwise get an instance of the background page that had not
          * loaded all it's requireJs modules. See backgroundPageUtils.js
          */
          window.isReady = true;
          resolve(ChromeHandler);
        });
      });
  }).catch(logExceptions_);

  /**
   * Add a listener for long lived chrome connections;
   * Drive Web UI will use this to connect and thereby
   * deduce whether or not our extension is installed.
   *
   * NOTE: MUST be run during the onLoad of this script!!!
   */
  if (chromeConnectAvailable_()) {
    chrome.runtime.onConnectExternal.addListener(function(port) {
      // If the Drive Web UI connects to our extension, that causes
      // this background page to wake up. We then respond with the version
      // of our app, after which the Drive Web UI then disconnects the port.
      // That disconnection SHOULD mean there are no outstanding connections
      // and thus the background page should get unloaded after ~15 seconds.
      // It appears however that it remains loaded. If we have a listener
      // for this disconnect event (even if it doesn't do anything), then
      // the background page DOES shut down properly after 15 sec.
      port.onDisconnect.addListener(function() {});

      port.onMessage.addListener(function(msg) {
        // after our chromeHandler has loaded, THEN handle
        // incoming connection message
        requirePromise_.then(function(ChromeHandler) {
          ChromeHandler.handleIncomingMsg(port, msg);
        }).catch(logExceptions_);
      });
    });
  }

  /**
   * Add a listener for public ChromeOS files
   * (i.e. when the user opens a public file on ChromeOS using the Files app)
   *
   * NOTE: MUST be run during the onLoad of this script!!!
   */
  if (chromeRuntimeLauncherAvailable_()) {
    chrome.app.runtime.onLaunched.addListener(function(launchData) {
      if (launchData.id === 'qo_documents') {
        requirePromise_.then(function(ChromeHandler) {
          ChromeHandler.handleChromeOSFile(launchData.items);
        }).catch(logExceptions_);
      }
    });
  }

  // ----------------------- PRIVATE helpers --------------------------------

  function logExceptions_(err) {
    console.error(err.stack ? err.stack : err);
  }

  function chromeConnectAvailable_() {
    var apiAvailable =
      (chrome &&
      chrome.runtime &&
      chrome.runtime.onConnectExternal &&
      chrome.runtime.onConnectExternal.addListener);

    if (!apiAvailable) {
      console.warn('Missing Chrome Connect API... drive integration wont work');
    }
    return apiAvailable;
  }

  function chromeRuntimeLauncherAvailable_() {
    var apiAvailable =
      (chrome &&
      chrome.app &&
      chrome.app.runtime &&
      chrome.app.runtime.onLaunched &&
      chrome.app.runtime.onLaunched.addListener);

    if (!apiAvailable) {
      console.warn('Missing ChromeOS Runtime OnLaunched API... ' +
        'opening documents from file browser wont work');
    }
    return apiAvailable;
  }

  /* eslint-disable no-unused-vars */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
  /* eslint-enable no-unused-vars */
  {
    requirePromise_.then(function(ChromeHandler) {
      sendResponse( {newCreate:"Creating new document"} );
      ChromeHandler.handleNewCreate(request.newCreate, request.mimeType);
    }).catch(logExceptions_);
    return true;
  });

})();
