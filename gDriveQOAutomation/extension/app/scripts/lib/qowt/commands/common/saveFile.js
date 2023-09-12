define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/errors/unique/outOfMemoryError',
    'qowtRoot/events/errors/savingFailed',
    'qowtRoot/models/env',
    'qowtRoot/pubsub/pubsub'
  ], function (
    CommandBase,
    OutOfMemoryError,
    SavingFailedError,
    EnvModel,
    PubSub
  ) {

  'use strict';

  var _factory = {

    /**
     * Factory function to create a new command object.
     *
     * @return {object} A saveFile command.
     */
    create: function() {

      var optimistic = false;
      var callsService = true;
      var _api = CommandBase.create('saveFile', optimistic, callsService);

      /**
       * Generate the correct opcode to effect a save of the current DOM to
       * the temporary file we have open. Note that this command does not
       * need to worry about file paths - the app will sniff it out and augment
       * it as needed
       *
       * @return {Object} The JSON Payload data to send to the dcp service.
       */
      _api.dcpData = function () {
        // publish the fact that we are saving the private file, with an
        // indication of whether or not this is the first phase of a two phase
        // save (i.e. save to the private file and then write to a user/Drive
        // file). Saving to the private file can take a while and so we want
        // the UI to react to this signal and update itself at the start of
        // the first phase (not the second phase)
        PubSub.publish('qowt:ss:saving',
          {twoPhaseSave: _api.childCount() > 0});

        // TODO(dskelton) We should have a single common opcode now, and it
        // should be 'saveChanges' or 'saveFile'.
        var opCodeMap = {
          'word': 'sDC',
          'sheet': 'saveWkbk',
          'point': 'sPT'
        };
        var opcode = opCodeMap[EnvModel.app];
        if (!opcode) {
          throw new Error('Could not invoke saveFile: unknown app');
        }

        return {
          name: opcode
        };
      };

      /**
       * @override
       * @see src/commands/qowtCommand.js
       * @param {Object} response The received failure response.
       * @param {object} errorPolicy A policy object used to determine what
       *                 behaviour to use in handling the response.
       */
      _api.onFailure = function (response, errorPolicy) {
        var error_name = response.error ? response.error.name : response.e;
        console.log('Saving to the private file failed with: ' + error_name);

        // publish the fact that saving to the private file has failed,
        // with an indication of whether or not this was the first phase
        // of a two phase save. If it's a two phase save then we want
        // the UI to react to this signal and update itself
        PubSub.publish('qowt:ss:savingFailed',
          {twoPhaseSave: _api.childCount() > 0});
        if (error_name === 'out_of_memory') {
          throw new OutOfMemoryError();
        } else {
          PubSub.publish('qowt:error', SavingFailedError.create());
        }
        if (errorPolicy) {
          // ensure the framework will not present an actual error dialog
          errorPolicy.eventDispatched = true;
        }
      };

      return _api;
    }
  };

  return _factory;
});
