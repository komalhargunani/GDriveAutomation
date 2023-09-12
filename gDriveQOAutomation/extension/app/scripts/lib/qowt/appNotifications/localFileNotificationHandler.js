// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Local File Notification Handler is responsible
 * for listening for messages from the app regarding the
 * local file associated with this QO session.
 *
 * Any operation regarding a local file is performed by the app
 * (it does not involve core) which then sends a message to
 * QOWT regarding the status of that operation. This module
 * is the component that is listening for those messages.
 *
 * For example, during a 'make a copy' operation on a local file
 * the app will let QOWT know the user-provided name for the file
 * copy so that QOWT can update the UI accordingly
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/models/fileInfo'
    ],
    function(
      MessageBus,
      PubSub,
      FileInfo)
    {

  'use strict';

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var token_;

  var init_ = function() {
    // listen for fire-and-forget messages from
    // the app regarding local file operations
    MessageBus.listen(handleLocalFileMsg_, msgFilter_);

    // subscribe for the signal that occurs when a fatal error occurs
    token_ = PubSub.subscribe('qowt:disable', disable_);
  };

  var msgFilter_ = function(message) {
    return !!(message && message.data &&
      (message.data.id === 'localFileNotification'));
  };

  var handleLocalFileMsg_ = function(message) {
    var context = message.data.context;
    if(context) {
      switch(context.type) {
        case 'copySuccess':
          processCopySuccess_(context);
          break;

        default:
          break;
      }
    }
  };

  var processCopySuccess_ = function(context) {
    // update the FileInfo to reflect the new file copy
    FileInfo.displayName = context.displayName;
    FileInfo.format = context.format;
    FileInfo.userFileType = context.userFileType;
    FileInfo.driveFileReadOnly = context.driveFileReadOnly;

    // we need to update the display name in the toolbar.
    // TODO(dskelton) Make the toolbar's file name a real custom element
    // and have it respond to changes in FileInfo.displayName directly.
    // For now this works.
    // TODO@lorrainemartin: This should not be directly poking HTML -
    // it should be calling a method on a widget to poke the HTML
    var el = document.getElementsByClassName('qowt-main-title-inner');
    if (el.length) {
      el.item(0).innerText = context.displayName;
    }
  };

  var disable_ = function() {
    MessageBus.stopListening(handleLocalFileMsg_);
    PubSub.unsubscribe(token_);
    token_ = undefined;
  };

  init_();
});
