/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Write To User File command.
 * This is the second part to a two part "save"/"save as" solution:
 *
 * 1- save dom to the private file, and
 * 2- write the private file to the user file
 *
 * For this second phase we either construct a new user file and then copy
 * the private file contents into it, or we overwrite the existing user file.
 * This is effectively the difference between saveAs and save.
 *
 * This command is handled by the app, rather than core, since the app
 * handles all file operations and can thus optionally ask the user to
 * select a new file
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/savestate/saveNotificationHandler',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/errors/unique/localFileNotFoundError',
  'qowtRoot/models/fileInfo'],
  function(
    CommandBase,
    SaveStateManager,
    SaveNotificationHandler,
    PubSub,
    LocalFileNotFoundError,
    FileInfo) {

  'use strict';

  var factory_ = {

    /**
     * Factory function to create a new command object
     *
     * @param {string} mode A string with one of the following values:
     *
     *                      - 'writeToNew': to indicate that the OS's file
     *                         selector dialog should be shown to the user to
     *                         allow them to specify a new user file
     *
     *                      - 'writeToExisting': to indicate that the existing
     *                         user file should be used. If there isn't one
     *                         then the command will fail
     *
     * @param {object || undefined} opt_context An optional context object
     *
     * @return {object} A WriteToUserFile command
     */
    create: function(mode, opt_context) {
      var optimistic = false;
      var callsService = true;
      var api_ = CommandBase.create(mode, optimistic, callsService);
      var saveToken_;
      var fileNotFoundErrorString_ =
        'A requested file or directory could not be found at '+
        'the time an operation was processed.';

      /**
       * Generate the JSON payload to send to the DCP service
       *
       * @return {object} The JSON payload
       */
      api_.dcpData = function() {
        saveToken_ = SaveStateManager.userFileSaveStarted();

        // if this command is being used to save-as a Drive file
        // to another Drive file then the page will be refreshed
        // with the new file's URL - we want to avoid showing the
        // 'unload page' warning dialog in this case
        SaveNotificationHandler.suppressUnloadDialog();

        var data = {
          name: api_.name,
          context: opt_context
        };
        return data;
      };

      /**
       * Processes a success response from the DCP service
       *
       * @override
       * @see src/commands/qowtCommand.js
       * @param {object} response The received success response
       */
      api_.onSuccess = function(response) {
          // update the FileInfo (its values may have changed in the case
          // of a save-as operation) before calling userFileSaveSucceeded()
          // incase listeners for the 'qowt:ss:saved' signal that it
          // publishes access the FileInfo
          FileInfo.displayName = response.displayName;
          FileInfo.format = response.format;
          FileInfo.userFileType = response.userFileType;
          FileInfo.driveFileReadOnly = response.driveFileReadOnly;
          if(!response.userCancelled) {
            SaveStateManager.userFileSaveSucceeded(saveToken_);

            // We need to update the displayName in the toolbar.
            // TODO(dskelton) Make the toolbar's file name a real custom element
            // and have it respond to changes in FileInfo.displayName directly.
            // For now this works.

            PubSub.publish('qowt:updateFileName', FileInfo.displayName);
        } else {
          SaveStateManager.userFileSaveCanceled(saveToken_);
        }

        SaveNotificationHandler.unsuppressUnloadDialog();
      };

      /**
       * Processes a failure response from the DCP service
       *
       * @override
       * @see src/commands/qowtCommand.js
       * @param {object} response The received failure response
       */
      api_.onFailure = function(response, errorPolicy) {
        // don't put up any new UI for this error (Whoops), because the
        // userFileSaveFailed will notify the user.  ignoreError must be
        // false or the error text will be overwritten with a message
        // declaring success
        errorPolicy.ignoreError = false;
        errorPolicy.eventDispatched = true;

        console.error('%s failed: %s', api_.name, response.e);

        var opt_error = null;
        if(response.e === fileNotFoundErrorString_){
          opt_error = new LocalFileNotFoundError();
        }

        SaveStateManager.userFileSaveFailed(saveToken_, opt_error);
        SaveNotificationHandler.unsuppressUnloadDialog();

      };

      return api_;
    }
  };

  return factory_;
});
