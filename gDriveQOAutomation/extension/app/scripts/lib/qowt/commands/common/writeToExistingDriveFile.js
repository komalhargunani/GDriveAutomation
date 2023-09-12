/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Write To Existing Drive File command.
 * This command overwrites a Drive file with the contents
 * of our private file.
 *
 * This command is handled by the app, rather than core,
 * since it handles all file operations.
 *
 * TODO@lorrainemartin: This command is highjacked and processed by
 * the app (it is not sent to core). Significantly, the app sends
 * a fake core response as soon as it receives this command - it does
 * not wait until the over-the-air communication with Drive completes
 * (this can potentially take some time). This is to ensure that this
 * command does not block the command queue (and thus block subsequent
 * non-optimistic commands) whilst waiting for a response from Drive.
 * In a future CL this command will be refactored to be a 'fire and forget'
 * message on the MessageBus from QOWT to the app - see crbug 369568.
 *
 * For now, the general flow is that a WriteToExistingDriveFile
 * command is created whenever an auto-save to an existing
 * Drive file is required. This command is highjacked by the
 * app, which then:
 *
 * - sends a fake success response to QOWT immediately so
 *   that subsequent non-optimistic commands are unblocked
 *
 * - uploads to Drive
 *
 * - on getting a response from Drive, sends a message on
 *   the MessageBus to inform QOWT of the 'real' success
 *   or failure (so that QOWT can update the UI)
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager'],
  function(
    CommandBase,
    SaveStateManager) {

  'use strict';

  var factory_ = {

    /**
     * Factory function to create a new command object
     * @param {boolean} newRevision Flags creation of a new revision
     *
     * @return {object} A WriteToExistingDriveFile command
     */
    create: function(newRevision) {
      var optimistic = false;
      var callsService = true;
      var api_ = CommandBase.create('writeToExistingDriveFile',
        optimistic, callsService);

      /**
       * Generate the JSON payload to send to the DCP service
       *
       * @return {object} The JSON payload
       */
      api_.dcpData = function() {
        var saveToken = SaveStateManager.userFileSaveStarted();
        var data = {
          name: api_.name,
          newRevision: newRevision,
          token: saveToken
        };
        return data;
      };

      return api_;
    }
  };

  return factory_;
});
