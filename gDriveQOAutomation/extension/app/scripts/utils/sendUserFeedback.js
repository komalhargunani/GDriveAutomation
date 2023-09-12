/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview send user feedback (eg "report an issue") to
 * the Chrome User Feedback extension.
 * We include some mandatory app specific data, and also any
 * exceptions that may or may not have occurred.
 * See Quickoffice PDD (http://go/cheese-privacy) for more details
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/utils/errorUtils',
  'controllers/fileManager'],
  function(
    ErrorCatcher,
    ErrorUtils,
    FileManager) {

  'use strict';

  var api_ = {

    openFeedbackUI: function(description) {
      var message = {
        requestFeedback: true,
        feedbackInfo: {
          description: description,
          categoryTag: 'FromQuickoffice',
          pageUrl: FileManager.originalURL(),
          systemInformation: [
            {key: 'appID', value: chrome.runtime.id},
            {key: 'appVersion', value: chrome.runtime.getManifest().version},
            {key: 'mimeType', value: FileManager.mimeType()},
            {key: 'exceptions', value: _caughtExceptions.toString()}
          ]
        }
      };

      // Set the details (filename and blob) of the file
      // that is to be attached to the feedback report

      // TODO @lorrainemartin: Figure out how to access
      // and set the blob data here so that the feedback UI
      // will automatically attach the relevant file
      /*message.feedbackInfo.attachedFile = {};
      message.feedbackInfo.attachedFile.name = 'TestFile.txt';
      message.feedbackInfo.attachedFile.data = null;*/

      // Now send the message object to request that the feedback UI be invoked
      chrome.runtime.sendMessage(_FEEDBACK_EXTENSION_ID, message,
        function() {});
    }
  };

  // ------------------------ PRIVATE -------------------------------

  var _FEEDBACK_EXTENSION_ID = 'gfdkimpbcpahaombhbimeihdjnejgicl';

  var _caughtExceptions = [];

  ErrorCatcher.addObserver(function(error) {
    var msg = error.fatal ? 'FATAL: ' : 'NonFatal: ';
    msg += ErrorUtils.stripStack(error) || error.message ||
           error.name || 'unknown error';
    _caughtExceptions.push(msg);
  });

  return api_;
});

