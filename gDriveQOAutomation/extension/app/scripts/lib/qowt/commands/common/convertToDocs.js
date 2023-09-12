/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview A command module that will save the currently open file
 * to a new Drive-hosted file whilst also converting the file to the
 * appropriate Google Docs related format.
 *
 * This command is handled by the app, rather than core, since it
 * handles all file operations.
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
 * For now, the general flow is that a ConvertToDocs command is
 * created whenever the 'Save as Google Docs' menu item is selected
 * by the user. This command is highjacked by the app, which then:
 *
 * - sends a fake success response to QOWT immediately so
 *   that subsequent non-optimistic commands are unblocked
 *
 * - sends a 'convert' request to Drive (and shows an dialog to the user)
 *
 * - on getting a response from Drive, either opens the converted
 *   document in a new tab (if the operation was successful) or
 *   sends a message on the MessageBus to inform QOWT that the
 *   operation failed (so that QOWT can update the UI)
 *
 * @author dskelton@google.com(Duncan Skelton)
 * @author lorrainemartin@google.com(Lorraine Martin)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/pubsub/pubsub'],
  function(
    CommandBase,
    PubSub) {

  'use strict';

  var factory_ = {

    /**
     * Factory function to create a new command object.
     *
     * @return  {Object} A convertToDocs command.
     */
    create: function() {

      var cmdName = 'convertToDocs',
          optimistic = true,
          callsService = true;
      var api_ = CommandBase.create(cmdName, optimistic, callsService);

      /**
       * Routine that performs the optimistic phase of the command. In this
       * case, it is publishing a notification to the rest of QOWT that a
       * conversion has started.
       */
      api_.doOptimistic = function() {
        PubSub.publish('qowt:driveFileNotification', {type: 'convertStart'});
      };

      /**
       * Return a payload object with the data to be used as the DCP request.
       * The name property is mandatory.
       *
       * @return {Object} The JSON Payload data to send to the dcp service
       */
      api_.dcpData = function() {
        return {
          name: api_.name
        };
      };

      return api_;
    }
  };

  return factory_;
});
