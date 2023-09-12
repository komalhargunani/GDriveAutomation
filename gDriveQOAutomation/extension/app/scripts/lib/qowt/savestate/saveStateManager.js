// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Save State Manager keeps track
 * of the saved/unsaved state of a document.
 * It publishes signals to notify other components
 * when a change in state occurs.
 *
 * For example, another component - the Save Notification Handler -
 * subscribes for the following signals from the Save State Manager
 * so that it knows which UI notifications to display to the user:
 *
 * 'qowt:ss:editApplied' - published when an edit occurs
 * 'qowt:ss:dirty' - published when the document becomes dirty
 * 'qowt:ss:saved' - published when the document becomes saved, i.e. all
 *                   unsaved changes have been saved to a user/Drive file
 * 'qowt:ss:writingFailed' - published if the last of 1 - N concurrent
 *                           save attempts to a user/Drive file fails
 *
 * @author Jason Ganetsky (ganetsky@google.com)
 * @author Lorraine Martin (lorrainemartin@google.com)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/errors/unique/localFileNotFoundError'
    ],
    function(
      PubSub,
      MessageBus,
      LocalFileNotFoundError) {

  'use strict';

  var api_ = {

    /**
     * Called when the user has made a change which has not yet been
     * saved to a user file, to mark the document as being dirty.
     *
     * This method should only be called after the change has been successfully
     * applied in the core - e.g. it should be called in the onSuccess() method
     * of the edit command. It should not be called earlier than this - for
     * example, in the doOptimistic() method of the edit command - because
     * the edit command could fail and it is important that the manager
     * has an accurate account of the runtime state of its document
     */
    markAsDirty: function() {
      PubSub.publish('qowt:ss:editApplied');
      var wasSaved = api_.isSaved();
      currentVersionDirty_ = true;
      if(wasSaved) {
        // publish a 'qowt:ss:dirty' signal to notify clients
        // that we've moved from a saved state to a dirty state
        // (rather than publishing this signal for every dirty edit)
        PubSub.publish('qowt:ss:dirty');
      }
    },

    /**
     * Called when a save to a user file starts.
     * At the point this is called, the current document is no longer
     * in a "dirty state", and isSaved will transition to true as soon
     * as the initiated save completes.
     *
     * @returns {object} A save token, to pass to userFileSaveSucceeded()
     *                   when the save successfully completes or to pass
     *                   to userFileSaveFailed() if the save fails
     */
    userFileSaveStarted: function() {
      var newDocVersion = ++currentDocVersion_;
      var retval = {
        startedSavingAt: newDocVersion
      };
      return retval;
    },

    /**
     * Called when a save to a user file has been successfully completed.
     * When this is called, if the document has not been "dirtied" since
     * the save to the user file was initiated, then isSaved transitions
     * to true.
     *
     * Note that this method handles the scenario where save attempt 1
     * succeeds but save attempt 2 is ongoing - in that case this method
     * does not publish any signal; it knows that it should wait for the
     * result of save attempt 2
     *
     * @param saveToken {object} The save token returned by a
     *                           call to userFileSaveStarted()
     */
    userFileSaveSucceeded: function(saveToken) {
      if(!saveToken || (saveToken.startedSavingAt === undefined)) {
        throw new Error('Argument to userFileSaveSucceeded() must ' +
            'be object returned by userFileSaveStarted()');
      }
      if(saveToken.startedSavingAt > savedDocVersion_) {
        savedDocVersion_ = saveToken.startedSavingAt;
      }
      currentVersionDirty_ = false;
      // publish that all changes have been saved if the most recent save
      // (there may be several saves in progress - e.g. auto-saves to Drive)
      // was successful and the document is not currently dirty
      if(api_.isSaved()) {
        PubSub.publish('qowt:ss:saved');
      }

      if(isRenamed_){
        MessageBus.pushMessage({
            id: 'fileSaveSuccess'
          });
        }
      isRenamed_ = undefined;
    },

    /**
     * Called when a save to a user file fails.
     * When this is called, if there is no other ongoing save since
     * this save to the user file was initiated, then we publish a
     * 'failed' signal
     *
     * Note that this method handles the scenario where save attempt 1
     * fails but save attempt 2 is ongoing - in that case this method does
     * not publish any signal; it knows that it should wait for the result
     * of save attempt 2
     *
     * @param {object} saveToken The save token returned by a
     *                           call to userFileSaveStarted()
     * @param {number} opt_errorCode Optional error code indicating
     *                               the reason that the save failed,
     *                               e.g. -1 indicates the user was offline
     *                               during an attempted save to Drive
     */
    userFileSaveFailed: function(saveToken, opt_errorCode) {
      if(!saveToken || (saveToken.startedSavingAt === undefined)) {
        throw new Error('Argument to userFileSaveFailed() must ' +
            'be object returned by userFileSaveStarted()');
      }

      // if this failed save is the most recent active save (there may be
      // several saves in progress  - e.g. auto-saves to Drive) then publish
      // a 'failed' signal
      if(saveToken.startedSavingAt === currentDocVersion_) {
        PubSub.publish('qowt:ss:writingFailed', {errorCode: opt_errorCode});
      }

      if(opt_errorCode  instanceof LocalFileNotFoundError){
        PubSub.publish('qowt:ss:localFileNotFound');
        currentDocVersion_ = 0;
        savedDocVersion_ = 0;
        MessageBus.pushMessage({
          id: 'fileNotFound'
        });
      }
    },

    /**
     * Called when user cancels upsave operation.
     * When this is called, count of currentDocVersion_ is decremented by one.
     * As it was incremented in userFileSaveStarted() operation 
     * and it is not succeeded.
     *
     * @param {object} saveToken The save token returned by a
     *                           call to userFileSaveStarted()
     */
    userFileSaveCanceled: function(saveToken) {
      if(!saveToken || (saveToken.startedSavingAt === undefined)) {
        throw new Error('Argument to userFileSaveCanceled() must ' +
            'be object returned by userFileSaveStarted()');
      }
      // decremented counter
      --currentDocVersion_;
    },

    /**
     * Checks whether the document has unsaved changes or not
     *
     * @returns {boolean} True if the document is saved,
     *                    otherwise false
     */
    isSaved: function() {
      return !currentVersionDirty_ && (currentDocVersion_ === savedDocVersion_);
    }
  };

  // VVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVV

  var currentDocVersion_;
  var savedDocVersion_;
  var currentVersionDirty_;
  var isRenamed_ = true;

  var init_ = function() {
    disable_();
    PubSub.subscribe('qowt:disable', disable_);
    PubSub.subscribe('qowt:ss:unsaved changes',handleNotification_);
  };

  var disable_ = function() {
    currentDocVersion_ = 0;
    savedDocVersion_ = 0;
    currentVersionDirty_ = false;
  };

  /**
  * unsaved changes notification handler
  */
  var handleNotification_ = function() {
    PubSub.publish('qowt:ss:dirty');
  };

  init_();
  return api_;
});
