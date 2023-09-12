/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview A command module that will make a copy of the
 * currently open file.
 *
 * If the current file is a Drive-hosted file then a new Drive-hosted file
 * will be created from the current content of the private file.
 * If the current file is a non-Drive-hosted file then a new local file
 * will be created from the current content of the private file.
 * Non-Drive hosted files include CrOS files opened from the Files
 * app and also all streams (blue web links, and files opened on
 * the desktop via the 'File -> Open' browser menu).
 *
 * This command is handled by the app, rather than core, since it
 * handles all file operations.
 *
 * TODO@lorrainemartin: This command is highjacked and processed by
 * the app (it is not sent to core). Significantly, the app sends
 * a fake core response as soon as it receives this command - so that if
 * the currently open file is a Drive-hosted file, it does not wait until
 * the over-the-air communication with Drive completes (this can potentially
 * take some time). This is to ensure that this command does not block the
 * command queue (and thus block subsequent non-optimistic commands) whilst
 * waiting for a response from Drive. In a future CL this command will be
 * refactored to be a 'fire and forget' message on the MessageBus from
 * QOWT to the app - see crbug 369568
 *
 * @author lorrainemartin@google.com(Lorraine Martin)
 */

define([
  'qowtRoot/commands/commandBase'
  ],
  function(
    CommandBase) {

  'use strict';

  var factory_ = {

    /**
     * Factory function to create a new command object.
     *
     * @return  {Object} A MakeACopy command.
     */
    create: function() {

      var cmdName = 'makeACopy',
          optimistic = false,
          callsService = true;
      var api_ = CommandBase.create(cmdName, optimistic, callsService);

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
