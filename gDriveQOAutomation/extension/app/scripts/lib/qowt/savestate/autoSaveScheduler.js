// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Autosave Scheduler determines
 * when an auto-save of the opened document should
 * occur and initiates one when deemed appropriate.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/models/env',
    'qowtRoot/models/fileInfo'],
    function(
      PubSub,
      EnvModel,
      FileInfo) {

  'use strict';

  var api_ = {

    DEBOUNCE_WAIT: 1000,
    REVISION_WAIT: 60 * 1000,

    /**
     * Initializes the scheduler
     */
    init: function() {
      init_();
    },

    /**
     * Used to disable auto-saves
     */
    disableAutoSave: function() {
      unsubscribeForEdits_();
    },

    /**
     * Used to enable auto-saves
     */
    enableAutoSave: function() {
      subscribeForEdits_();
    },

    /**
     * Forces an auto-save to occur now if
     * auto-saves are enabled for this document.
     *
     * Used to ensure that edits to a Drive document
     * made whilst offline are auto-saved to Drive
     * as soon as the user goes back online
     */
    forceAutoSave: function() {
      if(tokenEdit_) {
        doAutoSave_();
      }
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var debouncedAutosaveFunc_,
      revisionTimestamp_,
      tokenEdit_, tokenSaved_, tokenFails_, tokenDestroy_, timeoutId_;

  var init_ = function() {
    // Set the previous revision timestamp such that the first edit always
    // create a new revision.
    revisionTimestamp_ = -(api_.REVISION_WAIT + 1);

    if (!tokenDestroy_) {
      tokenDestroy_ = PubSub.subscribe('qowt:destroy', destroy_);
    }

    // create a debounced version of the doAutoSave_() function so that if a
    // flurry of edits occur in quick succession (e.g. rapid typing in QW) then
    // execution of doAutoSave_() will be postponed until after DEBOUNCE_WAIT
    // ms have elapsed since the last time it was invoked. This ensures that
    // an auto-save is only performed after the flurry of edits finishes.
    debouncedAutosaveFunc_ = function() {
      if (timeoutId_) {
        clearTimeout(timeoutId_);
      }
      timeoutId_ = setTimeout(doAutoSave_.bind(this), api_.DEBOUNCE_WAIT);
    }.bind(this);

    // if the document is a 2007 file and it isn't read-only,
    // then enable auto-saving, otherwise detect
    // if the document is ever upsaved to 2007
    if (docIs2007File_() && !FileInfo.driveFileReadOnly) {
      api_.enableAutoSave();

      // subscribe for the signal that occurs when there have
      // been successive auto-save failures to a Drive file
      subscribeForMultiFails_();
    }
    else {
      subscribeForSaves_();
    }
  };

  var destroy_ = function() {
    unsubscribeForEdits_();
    unsubscribeForSaves_();
    unsubscribeForMultiFails_();
    PubSub.unsubscribe(tokenDestroy_);
    tokenDestroy_ = undefined;
  };

  var doAutoSave_ = function() {
    // Create a new revision is more that REVISION_WAIT has elapsed
    var timestamp = Date.now();
    var createRevision = (timestamp - revisionTimestamp_) > api_.REVISION_WAIT;
    // publish a signal to ask the Common
    // Content Manager to initiate an auto-save
    PubSub.publish('qowt:doAction', {
      action: 'autoSave',
      context: {
        contentType: 'common',
        newRevision: createRevision
      }
    });

    // Update revision creation timestamp
    revisionTimestamp_ = createRevision ? timestamp : revisionTimestamp_;
    timeoutId_ = undefined;
  };

  var subscribeForEdits_ = function() {
    if(!tokenEdit_) {
      tokenEdit_ = PubSub.subscribe('qowt:ss:editApplied',
        debouncedAutosaveFunc_);
    }
  };

  var unsubscribeForEdits_ = function() {
    if(tokenEdit_) {
      PubSub.unsubscribe(tokenEdit_);
      tokenEdit_ = undefined;
    }
  };

  var subscribeForSaves_ = function() {
    if(!tokenSaved_) {
      tokenSaved_ = PubSub.subscribe('qowt:ss:saved', onSaved_);
    }
  };

  var unsubscribeForSaves_ = function() {
    if(tokenSaved_) {
      PubSub.unsubscribe(tokenSaved_);
      tokenSaved_ = undefined;
    }
  };

  var subscribeForMultiFails_ = function() {
    if(!tokenFails_) {
      tokenFails_ = PubSub.subscribe('qowt:multiDriveFailures', onFails_);
    }
  };

  var unsubscribeForMultiFails_ = function() {
    if(tokenFails_) {
      PubSub.unsubscribe(tokenFails_);
      tokenFails_ = undefined;
    }
  };

  var onSaved_ = function() {
    if (docIs2007File_()) {
      api_.enableAutoSave();
      unsubscribeForSaves_();
    }
  };

  var onFails_ = function() {
    api_.disableAutoSave();
    unsubscribeForMultiFails_();
    subscribeForSaves_();
  };


  var docIs2007File_ = function() {
    if (EnvModel.app === undefined || FileInfo.format === undefined) {
      throw new Error('Undefined document info for AutoSaveScheduler');
    }
    return FileInfo.format === 'OOXML';
  };

  return api_;
});
