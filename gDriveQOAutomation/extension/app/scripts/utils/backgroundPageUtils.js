// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Utility functions for the
 * Quickoffice extension's background page
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/third_party/when/when'
  ],
  function(
    PromiseUtils) {

  'use strict';

  var api_ = {

    /**
     * Returns a promise that will be resolved with a handle
     * to the Quickoffice extension's background page.
     *
     * Chrome will unload the background page when there are no
     * Quickoffice tabs open (to save memory) and so the background
     * page may not always be immediately available.
     * To handle this this method uses the chrome.runtime.getBackgroundPage
     * API (rather than the chrome.extension.getBackgroundPage API) to
     * ensure that the background page is loaded if it is not already active.
     *
     * Since our background page uses requireJs, not all of
     * it's modules might be loaded when we get the object back from Chrome.
     * We thus wait for it 'to be ready', before resolving the promise.
     *
     * @return {object} The returned promise
     */
    getPage: function() {
      return getChromeBP_()
          .then(waitUntilReady_);
    }

  };
  // ------------------------ PRIVATE -----------------------------

  // ten seconds should be enough for chrome to return us the backgroundPage
  // (crbug382673 showed us that 2s was not long enough).
  var GET_TIMEOUT = 10000;

  // ten seconds should be enough for the background page to get ready
  var READY_TIMEOUT = 10000;

  /**
   * @return {Promise} the Chrome Background Page. Note: the
   *                   page itself might not be fully loaded yet...
   *                   Times out (promise will reject) in 2 seconds
   */
  function getChromeBP_() {
    var promise = new Promise(function(resolve, reject) {
        if (!chrome || !chrome.runtime || !chrome.runtime.getBackgroundPage) {
          reject(new Error('chrome.runtime.getBackgroundPage not available'));
        } else {
          chrome.runtime.getBackgroundPage(resolve);
        }
      });

    return wrapInTimeout_(
      promise, GET_TIMEOUT, 'chrome.runtime.getBackgroundPage timed out');
  }

  /**
   * Wait for the Background page to have all it's modules loaded
   *
   * @param {window} backgroundPage the background page window object
   * @return {Promise} resolves with the Chrome Background Page.
   *                   Times out (promise will reject) in 10 seconds
   */
  function waitUntilReady_(backgroundPage) {
    var promise = new Promise(function(resolve) {
      var checkBpIsReady = function(backgroundPage) {
        if(backgroundPage.isReady) {
          resolve(backgroundPage);
        }
        else {
          window.setTimeout(checkBpIsReady.bind(null, backgroundPage), 10);
        }
      };
      checkBpIsReady(backgroundPage);
    });

    return wrapInTimeout_(
        promise, READY_TIMEOUT, 'Background page timed out getting ready');
  }


  /**
   * @param {Promise} promise the promise to wrap in a race
   * @param {Number} ms the number of miliseconds to wait before rejecting
   * @param {String} msg the message to pass to new Error when rejecting
   * @return {Promise} will return a race promise of the given promise
   *                   or one that rejects at the given timeout with
   *                   a new Error(msg)
   */
  function wrapInTimeout_(promise, ms, msg) {
    return Promise.race([
      promise,
      PromiseUtils.delayThenReject(ms,
        new Error(msg))
    ]);
  }

  return api_;
});
