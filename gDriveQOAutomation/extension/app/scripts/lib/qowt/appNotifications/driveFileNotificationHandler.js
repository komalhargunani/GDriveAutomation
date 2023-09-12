// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Drive File Notification Handler is responsible
 * for listening for messages from the app regarding the
 * Drive file associated with this QO session.
 *
 * Any operation regarding a Drive file is performed by the app
 * (it does not involve core) which then sends a message to
 * QOWT regarding the status of that operation. This module
 * is the component that is listening for those messages.
 *
 * For example, during an auto-save to a Drive file the app
 * will communicate with Drive to upload the contents of the
 * private file to Drive. The app will then let QOWT know
 * whether the Drive operation was successful or not so that
 * QOWT can update the UI accordingly
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/utils/driveErrors',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/savestate/autoSaveScheduler',
    'qowtRoot/savestate/saveStateManager',
    'qowtRoot/utils/domListener',
    'qowtRoot/models/fileInfo',
    'qowtRoot/models/env',
    'qowtRoot/utils/userFeedback'
    ],
    function(
      DriveErrors,
      MessageBus,
      PubSub,
      AutoSaveScheduler,
      SaveStateManager,
      DomListener,
      FileInfo,
      EnvModel,
      UserFeedback)
    {

  'use strict';

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var kId_ = 'drive-notif',
      kDriveFileNotification = 'driveFileNotification',
      kSaveFailureThreshold_ = 5,
      tokens_,
      accumulatedSaveFails_ = 0,
      conversionDialog_,
      dialogClosed_ = 'dialog-closed';


  var init_ = function() {
    // listen for fire-and-forget messages from
    // the app regarding Drive file operations
    MessageBus.listen(handleAppMsg_, msgFilter_);

    // listen for the event that indicates that
    // we are back online (after being offline)
    DomListener.add(kId_, window, 'online', handleBackOnline_);

    tokens_ = [
      PubSub.subscribe('qowt:' + kDriveFileNotification, handleQowtMsg_),
      PubSub.subscribe('qowt:disable', disable_)
    ];
  };

  var msgFilter_ = function(message) {
    var result = false;
    if(message && message.data &&
      (message.data.id === kDriveFileNotification)) {
      result = true;
    }
    return result;
  };

  var handleAppMsg_ = function(message) {
    var context = message.data.context;
    if(context) {
      switch(context.type) {
        case 'saveSuccess':
          processSaveSuccess_(context);
          break;

        case 'saveFailure':
          processSaveFailure_(context);
          break;

        case 'convertSuccess':
          closeConversionDialog_();
          break;

        case 'convertFailure':
          processConvertFailure_(context);
          break;

        case 'copyFailure':
          processCopyFailure_(context);
          break;

        default:
          break;
      }
    }
  };

  /**
   * React to a message from QOWT regarding drive files.
   * @param {string} event The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  var handleQowtMsg_ = function(event, eventData) {
    event = event || '';
    if (eventData && eventData.type) {
      switch(eventData.type) {
        case 'convertStart':
          openConversionDialog_();
          break;

        default:
          break;
      }
    }
  };

  /**
   * Shows the dialog that is displayed to the user during a document
   * conversion operation.
   * @private
   */
  var openConversionDialog_ = function() {
    conversionDialog_ = new QowtConversionDialog();
    conversionDialog_.addEventListener(dialogClosed_,
        onConversionDialogClose_);
    conversionDialog_.app = EnvModel.app;
    // Polymer is not invoking attributeChangedCallback on dialog close in case
    // of shady. To fix this issue we need to override the callback function of
    // modal dialog.
    conversionDialog_.callback = function() {
      onConversionDialogClose_();
    };
    conversionDialog_.show();
  };

  /**
   * Closes the dialog that is displayed to the user during a document
   * conversion operation.
   * @private
   */
  var closeConversionDialog_ = function() {
    if (conversionDialog_) {
      conversionDialog_.removeEventListener(dialogClosed_,
          onConversionDialogClose_);
      if (conversionDialog_.open) {
        conversionDialog_.close();
      }
      conversionDialog_ = undefined;
    }
  };

  /**
   * React to the dialog being closed by reporting it outside the iframe.
   * @private
   */
  var onConversionDialogClose_ = function() {
    MessageBus.pushMessage({id: 'conversionCancelled'});
    conversionDialog_ = undefined;
  };


  var processSaveSuccess_ = function(context) {
    accumulatedSaveFails_ = 0;
    if(context.saveToken) {
      SaveStateManager.userFileSaveSucceeded(context.saveToken);
    }
  };

  var processSaveFailure_ = function(context) {
    if(context.saveToken) {
      switch(context.errorCode) {
        case DriveErrors.OFFLINE:
          saveFailureOffline_(context.saveToken);
          break;

        default:
          saveFailureGeneric_(context.saveToken);
          accumulatedSaveFails_++;
          if(accumulatedSaveFails_ === kSaveFailureThreshold_) {
            // we have had multiple successive auto-save failures for this
            // Drive file - let's disable auto-saves for now and display the
            // bacon bar to allow the user to save it to a local file instead
            PubSub.publish('qowt:multiDriveFailures', {});
          }
          break;
      }
    }
  };

  var saveFailureOffline_ = function(token) {
    // a save has failed because the user is offline
    SaveStateManager.userFileSaveFailed(token, DriveErrors.OFFLINE);
  };

  var saveFailureGeneric_ = function(token) {
    SaveStateManager.userFileSaveFailed(token);
  };

  var processConvertFailure_ = function(context) {
    closeConversionDialog_();
    switch(context.errorCode) {
      case DriveErrors.OFFLINE:
        fileCreateFailureOffline_('convert_attempt_when_offline');
        break;

      case DriveErrors.INVALID_CREDENTIALS:
        fileCreateFailureInvalidCreds_('convert_attempt_with_invalid_creds');
        break;

      default:
        fileCreateFailureGeneric_('converting_to_google_' +
          EnvModel.app + '_fail_msg', 'convertToDocs');
        break;
    }
  };

  var processCopyFailure_ = function(context) {
    switch(context.errorCode) {
      case DriveErrors.OFFLINE:
        fileCreateFailureOffline_('copy_attempt_when_offline');
        break;

      case DriveErrors.INVALID_CREDENTIALS:
        fileCreateFailureInvalidCreds_('copy_attempt_with_invalid_creds');
        break;

      default:
        fileCreateFailureGeneric_('make_a_copy_fail_msg', 'makeCopy');
        break;
    }
  };

  var fileCreateFailureOffline_ = function(message) {
    var dialog = createGenericErrorDialog_(message);
    dialog.affirmativeButton = 'qowt_modal_confirm_dialog_affirmative_button';
    dialog.show();
  };

  var fileCreateFailureInvalidCreds_ = function(message) {
    var dialog = createGenericErrorDialog_(message);
    dialog.affirmativeButton = 'sign_in';
    dialog.negativeButton ='qowt_modal_confirm_dialog_negative_button';
    dialog.callback = function(type) {
      if (type === 'affirmative') {
        MessageBus.pushMessage({
          id: 'signIntoDrive',
          link: 'http://www.drive.google.com'
        });
      }
    };
    dialog.show();
  };

  var fileCreateFailureGeneric_ = function(message, repeatAction) {
    var dialog = createConversionErrorDialog_(message);
    dialog.affirmativeButton = 'try_again';
    dialog.negativeButton ='qowt_modal_confirm_dialog_negative_button';
    dialog.callback = function(type) {
      if (type === 'affirmative') {
        PubSub.publish('qowt:doAction', {
          action: repeatAction,
          context: {
            contentType: 'common'
          }
        });
      }
      else if (type === 'reportFeedback') {
        UserFeedback.reportAnIssue();
      }
    };
    dialog.show();
  };

  /**
   * @return {QowtGenericDialog} A generic error dialog setup.
   * @private
   */
  var createGenericErrorDialog_ = function(message) {
    var dialog = new QowtGenericDialog();
    dialog.titleText = 'something_not_right';
    dialog.messageText = message;
    return dialog;
  };

  /**
   * @return {QowtModalDialog} A conversionError dialog setup.
   * @private
   */
  var createConversionErrorDialog_ = function(message) {
    var dialog = new QowtConversionErrorDialog();
    dialog.titleText = 'something_not_right';
    dialog.messageText = message;
    return dialog;
  };

  var handleBackOnline_ = function() {
    // we have come back online after being offline -
    // if the document is a Drive document and has unsaved
    // changes then let's immediately auto-save to Drive
    // (if auto-saves are enabled for this document)
    if((FileInfo.userFileType === 'drive') && !SaveStateManager.isSaved()) {
      AutoSaveScheduler.forceAutoSave();
    }
  };

  var disable_ = function() {
    MessageBus.stopListening(handleAppMsg_);
    DomListener.removeGroup(kId_);
    if (tokens_) {
      tokens_.forEach(function(token) {
        PubSub.unsubscribe(token);
      });
    }
    tokens_ = undefined;
  };

  init_();
});
