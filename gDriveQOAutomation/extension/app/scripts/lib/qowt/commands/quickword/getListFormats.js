/**
 * GetListFormats.
 *
 * Defines a QW getListFormats command including response behaviours.
 *
 * @author Dan Tilley (dtilley@google.com)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/coreError',
  'qowtRoot/models/dcp'], function(
  PubSub,
  CommandBase,
  CorruptFileError,
  CoreError,
  DcpModel) {

  'use strict';

  var _factory = {

    create: function() {

      var module = function() {

        // TODO: Remove once DCP backwards compatibility is no longer required
        var _commandName = 'getListStyles';
        var _api = CommandBase.create(_commandName, false, true);

        /**
         * @return {Object} The JSON Payload for the command.
         */
        _api.dcpData = function() {
          // TODO: Remove once DCP backwards compatibility is no
          // longer required
          if (DcpModel.version === 2) {
            _commandName = 'getListFormats';
          }
          return ({
            'name': _commandName
          });
        };

        /**
         * @override
         * @see src/commands/qowtCommand.js
         * @param response {DCPresponse} The newly handled response object.
         */
        _api.onSuccess = function(/* response */) {
          PubSub.publish('qowt:getListFormats', {
            'success': true
          });
        };

        /**
         * Throw a fatal error if the core failed.
         *
         * NOTE: this uses the new error handling (eg throw an exception)
         * and since that is a fatal exception, we no longer need to use
         * the old "errorPolicy" object anymore.
         *
         * @param {object} response The recevied DCP response.
         */
        _api.onFailure = function(response) {
          var errorName = response.error ? response.error.name : response.e;
          var failureMsg = _api.name + " command - failed: " + errorName;
          console.error(failureMsg);

          if (response.error) {
            throw new CoreError(response.error);
          } else {
            // TODO(jonbronson) : Change CorruptFileError to Generic
            // CommandFailedError because we don't actually have info to know
            // that the file is actually corrupt. In some real documents, this
            // label is demonstrably wrong.
            throw new CorruptFileError(failureMsg);
          }
        };

        return _api;

      };

      var instance = module();
      return instance;

    }

  };

  return _factory;

});
