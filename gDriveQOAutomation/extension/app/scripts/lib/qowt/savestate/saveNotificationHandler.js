// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Save Notification Handler manages the various
 * UI notifications that are displayed to the user depending on the
 * current ‘save state’ of a document.
 *
 * For example, the message 'Unsaved changes' will be displayed in
 * the notification area if the user has made changes to the document
 * which have not yet been saved. This message will change to 'Saving...'
 * during a save operation and finally to 'All changes saved' when
 * the save operation completes.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/savestate/saveStateManager',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/utils/domListener',
    'qowtRoot/utils/i18n',
    'qowtRoot/utils/driveErrors',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/models/fileInfo',
    'qowtRoot/third_party/when/when'
    ],
    function(
      SaveStateManager,
      PubSub,
      DomListener,
      I18n,
      DriveErrors,
      MessageBus,
      FileInfo,
      when) {

  'use strict';

  var api_ = {

    /**
     * Used to suppress the dialog that appears if there are
     * unsaved changes when a page is about to be unloaded
     */
    suppressUnloadDialog: function() {
      suppress_ = kSuppressed_;
      updateBlockBeforeUnloadState_();
    },

    /**
     * Used to unsuppress the dialog that appears if there are
     * unsaved changes when a page is about to be unloaded
     */
    unsuppressUnloadDialog: function() {
      suppress_ = kUnsuppressed_;
      updateBlockBeforeUnloadState_();
    },

    /**
     * Used by the app to momentarily suppress the dialog
     * that appears if there are unsaved changes when
     * a page is about to be unloaded
     */
    suppressUnloadDialogOnce: function() {
      suppress_ = kSuppressed_Once_;
      updateBlockBeforeUnloadState_();
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var kSignal_Notification_ = 'qowt:notification',
      kListener_Namespace_ = 'save notification handler',
      kUnsuppressed_ = 'unsuppressed',
      kSuppressed_ = 'suppressed',
      kSuppressed_Once_ = 'suppressedOnce',
      suppress_ = kUnsuppressed_,
      pubSubTokens_ = [];

  var init_ = function() {
    // subscribe for changes to the document's state
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:dirty', onDirty_));
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:saving', onSaving_));
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:savingFailed',
      onSavingFailed_));
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:savingCancelled',
      onSavingCancelled_));
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:writingFailed',
      onWritingFailed_));
    pubSubTokens_.push(PubSub.subscribe('qowt:ss:saved', onSaved_));

    // subscribe for the signal that tells us to disable
    pubSubTokens_.push(PubSub.subscribe('qowt:disable', disable_));

    // listen for 'beforeunload' HTML events
    if(window.name === 'sandbox') { // to avoid CSP issue when loading for UTs
      // TODO@lorrainemartin: This will break once we remove allow-same-origin
      // on the iframe. May need to revisit and make use of the MessageBus
      DomListener.add(kListener_Namespace_, window.parent, 'beforeunload',
        onBeforeUnload_);
    }
  };

  var onDirty_ = function() {
    // if the file isn't a read only Drive file then
    // show the 'Unsaved changes' notification; otherwise
    // leave the existing 'Read only' notification untouched
    if(!FileInfo.driveFileReadOnly) {
      PubSub.publish(kSignal_Notification_, {
        msg: I18n.getMessage('unsaved_changes'),
        timeOut: -1
      });
    }
    updateBlockBeforeUnloadState_();
  };

  var onSaving_ = function(event, eventData) {
    event = event || {};
    if(eventData && eventData.twoPhaseSave) {
      PubSub.publish(kSignal_Notification_, {
        msg: I18n.getMessage('info_file_saving'),
        timeOut: -1
      });
    }
  };

  var onSavingFailed_ = function(event, eventData) {
    if(eventData && eventData.twoPhaseSave) {
      onWritingFailed_(event, eventData);
    }
  };

  var onSavingCancelled_ = function() {
    PubSub.publish(kSignal_Notification_, {
      msg: I18n.getMessage('info_file_save_cancelled')
    });
  };

  var onWritingFailed_ = function(event, eventData) {
    event = event || {};
    if((FileInfo.userFileType === 'drive') &&
      (eventData && eventData.errorCode === DriveErrors.OFFLINE)) {
      // a save to a Drive file has failed because we are offline -
      // rather than displaying this as a failure we display it as
      // a successful 'offline save' to the private file
      PubSub.publish(kSignal_Notification_, {
        msg: I18n.getMessage('info_file_saved_offline')
      });
    }
    else {
      // otherwise, a save to a Drive file or a local file has failed
      when.promise(function(resolve) {
        PubSub.publish(kSignal_Notification_, {
          msg: I18n.getMessage('info_file_save_failed'),
          timeOut: -1
        });
        // let this notification show for 5 seconds
        setTimeout(resolve, 5000);
      })
      .then(function() {
        if(!SaveStateManager.isSaved()) {
          onDirty_();
        }
      });
    }
  };

  var onSaved_ = function() {
    var msgForLocalFileSave = FileInfo.localFilePath ?
        I18n.getMessage(
            'info_file_saved_at_location', [FileInfo.localFilePath]) :
        I18n.getMessage('info_file_saved_locally');

    PubSub.publish(kSignal_Notification_, {
      msg: FileInfo.userFileType === 'drive' ?
        I18n.getMessage('info_file_saved_in_drive') :
        msgForLocalFileSave,
      fileSavedAtLoc: FileInfo.localFilePath ? true : false,
      location: FileInfo.localFilePath 
    });
    updateBlockBeforeUnloadState_();
  };

  var disable_ = function() {
    pubSubTokens_.forEach(function(token) {
      PubSub.unsubscribe(token);
    });
    pubSubTokens_ = [];
    DomListener.removeGroup(kListener_Namespace_);
  };

  var updateBlockBeforeUnloadState_ = function() {
    MessageBus.pushMessage({
      id: 'setBlockUnload',
      blockUnload:
          (suppress_ === kUnsuppressed_) && !SaveStateManager.isSaved() ?
          I18n.getMessage('unsaved_changes_warning') :
          null,
    });
  };

  var onBeforeUnload_ = function(evt) {
    if((suppress_ === kUnsuppressed_) && !SaveStateManager.isSaved()) {
      evt.returnValue = I18n.getMessage('unsaved_changes_warning');
    }
    if(suppress_ === kSuppressed_Once_) {
      suppress_ = kUnsuppressed_;
    }
  };

  init_();
  return api_;
});
