// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Save Dialog Handler manages the UI dialogs
 * that provide the user with information about the save state
 * of their document. These dialogs include:
 *
 * - A bacon bar, which informs the user that their edits are
 *   not being automatically saved, and allows them to specify
 *   an appropriate user file to start auto-saving to.
 *   For example, the bacon bar will be shown if the file is
 *   read-only, a stream, or a Word or Point 2003 file
 *
 * and
 *
 * - A butter bar, which informs the user that their edits are
 *   now being automatically saved.
 *   The butter bar will be shown in place of the bacon bar after
 *   the user specifies an appropriate user file to auto-save to
 *
 * The handler determines when to show and hide the dialogs,
 * which message to display in them and how to process user
 * gestures on them
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/models/fileInfo',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/errors/qowtError',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/utils/platform'
  ],
  function(
    FileInfo,
    PubSub,
    MessageBus,
    QOWTError,
    I18n,
    ModalDialog,
    Platform) {

  'use strict';
  var api_ = {

    /**
     * Initializes the save dialog handler
     */
    // TODO(davidshimel) Passing in the bacon and butter bars seems hacky.
    init: function(baconBar, butterBar) {
      init_(baconBar, butterBar);
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var pubSubTokens_ = [], docDirtyToken_,
      baconBar_,
      butterBar_,
      isForced_ = false,
      upsaveDialogShownOnce = false;


  // Pass baconBar and butterBar in here because we can no longer grab them
  // from MainToolbar as it does not exist.
  var init_ = function(baconBar, butterBar) {
    baconBar_ = baconBar;
    if(!baconBar_) {
      throw new QOWTError('Failed to get bacon bar widget');
    }

    butterBar_ = butterBar;
    if(!butterBar_) {
      throw new QOWTError('Failed to get butter bar widget');
    }

    // listen for fire-and-forget messages from
    // the app regarding user file operations
    MessageBus.listen(handleUserFileMsg_, msgFilter_);

    // subscribe for the signal that occurs when there have
    // been successive auto-save failures to a Drive file
    pubSubTokens_.push(PubSub.subscribe('qowt:multiDriveFailures', onFails_));

    // subscribe for the signal that tells us to disable
    pubSubTokens_.push(PubSub.subscribe('qowt:disable', disable_));
    docDirtyToken_ = PubSub.subscribe('qowt:ss:editApplied', showBaconBar_);
    pubSubTokens_.push(docDirtyToken_);
    pubSubTokens_.push(
      PubSub.subscribe('qowt:ss:localFileNotFound', handleFileNotFoundError_));
    pubSubTokens_.push(
      PubSub.subscribe('qowt:ss:saveUsingCtrl-S', handleSaveUsingCtrlS_));
  };
  function handleSaveUsingCtrlS_() {
    if (requireBaconBar_()) {
      onBaconBarClick_();
    }
  }
  function showBaconBar_() {
    // show the bacon bar if required
    if (requireBaconBar_() && !baconBar_.isShown()) {
      baconBar_.show(
          I18n.getMessage('edits_not_being_saved'),
          I18n.getMessage('save_now'),
          onBaconBarClick_.bind(this));
    }
  }

  var onBaconBarClick_ = function() {
    if(FileInfo.format !== 'OOXML' && !upsaveDialogShownOnce) {
      showUpsaveWarning_(function() {
        upsaveDialogShownOnce = true;
        doSaveAs_();
      });
    }
    else {
      doSaveAs_();
    }
  };

  var onButterBarClick_ = function() {
    butterBar_.hide();
  };

  var showUpsaveWarning_ = function(callback) {
    var url = Platform.isCros ?
      'http://support.google.com/chromeos/bin/answer.py?hl=en&answer=2481498' :
      'https://support.google.com/docs/?p=ocm_upsave';

    var dialog = new QowtUpdateDialog();
    dialog.titleText = 'word_binary_upsave_shortmsg';
    dialog.messageText = 'word_binary_upsave_msg';
    dialog.linkUrl = url;
    dialog.linkText = 'word_binary_upsave_learnmore';
    dialog.callback = callback;
    dialog.show();
  };

  var doSaveAs_ = function() {
    PubSub.publish('qowt:doAction', {
      'action': 'saveAs',
      'context': {
        toLocal: isForced_,
        contentType: 'common'
      }
    });
  };

  var msgFilter_ = function(message) {
    var result = false;
    if(message && message.data &&
      (message.data.id === 'userFileNotification')) {
      result = true;
    }
    return result;
  };

  var handleUserFileMsg_ = function(message) {
    var context = message.data.context;
    if(context) {
      switch(context.type) {
        case 'saveSuccess':
          onSaveSuccess_(context);
          break;
        case 'saveCancel':
          onSaveCancel_();
          break;

        default:
          break;
      }
    }
  };

  var onSaveSuccess_ = function(context) {
    // TODO We shouldn't be making save decisions here based on the visibility
    // of the bacon bar!
    if(baconBar_.style.visibility !== 'hidden' || FileInfo.upsaveNeeded) {
      // the bacon bar is visible so until now we have not been auto-saving
      // edits to a user file. Update the FileInfo with the details of the
      // user file that we have just successfully saved to and then check
      // whether it is a valid user file that we can start auto-saving to
      FileInfo.format = context.format;
      FileInfo.userFileType = context.userFileType;
      FileInfo.driveFileReadOnly = context.driveFileReadOnly;
      FileInfo.isRenamed = context.isRenamed;
      var origURL = FileInfo.originalURL;
      FileInfo.localFilePath = context.localFilePath || origURL;
      FileInfo.upsaveNeeded = false;
      if(!requireBaconBar_()) {
        // the bacon bar is not required any more so
        // hide it and show the fading butter bar
        baconBar_.hide();
        butterBar_.show(
            I18n.getMessage('edits_now_being_auto_saved'),
            I18n.getMessage('dismiss'),
            onButterBarClick_);
        isForced_ = false;
        // We no longer need to show the bacon bar on edit performed so
        // unsubscribe event.
        PubSub.unsubscribe(docDirtyToken_);
        docDirtyToken_ = undefined;
      }
    }
  };

  var onSaveCancel_ = function() {
    PubSub.publish('qowt:ss:savingCancelled');
    baconBar_.blur();
  };

  var onFails_ = function() {
    isForced_ = true;
    baconBar_.show(
        I18n.getMessage('edits_not_being_saved'),
        I18n.getMessage('save_now'),
        onBaconBarClick_.bind(this));
  };

  var requireBaconBar_ = function() {
    // the bacon bar is required to be displayed if the opened document:
    // - is a 2003 or CSV file, or
    // - is a Drive file for which the user only has read permission, or
    // - doesn't have an associated user file (e.g. it's a stream)
    return FileInfo.format !== 'OOXML' || FileInfo.upsaveNeeded ||
      FileInfo.driveFileReadOnly || !FileInfo.userFileType ||
      FileInfo.isRenamed;
  };

  var handleFileNotFoundError_ = function(){
    ModalDialog.show(I18n.getMessage('file_not_found_title'),
      I18n.getMessage('file_not_found_exception') , [{
       text: I18n.getMessage('qowt_modal_info_dialog_affirmative_button'),
       affirmative: true,
       useSameCallbackForCancel: true,
       callback: function() {
        FileInfo.userFileType = undefined;
        showBaconBar_();
        PubSub.publish('qowt:ss:dirty');
        docDirtyToken_ = PubSub.subscribe('qowt:ss:editApplied', showBaconBar_);
       }
      }]);
  };

  var disable_ = function() {
    MessageBus.stopListening(handleUserFileMsg_);
    pubSubTokens_.forEach(function(token) {
      PubSub.unsubscribe(token);
    });
    pubSubTokens_ = [];
    docDirtyToken_ = undefined;
  };

  return api_;
});
