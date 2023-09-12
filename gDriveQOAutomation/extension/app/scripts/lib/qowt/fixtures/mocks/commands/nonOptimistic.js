
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A mock non-optimistic command.
 * For use in unit test code.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
    'qowtRoot/commands/commandBase',
  ], function(
    CommandBase) {

  'use strict';

  var _factory = {

    /**
     * Create a new instance of a mock non-optimisitic command for test use.
     * @param {string} opt_cmdName An optional command name. If not given then
     *                             a default name will be used.
     */
    create: function(opt_cmdName) {

      // use module pattern for instance object
      var module = function() {

          opt_cmdName = opt_cmdName || 'nonOptimisticCmd';
          // Notice the arguments of optimistic = false, callsService = true
          var _api = CommandBase.create(opt_cmdName, false, true);

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request.
           * Request manager will add the unique ID to this payload to track and
           * match client-server request-response
           * The name property is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           * @see     TODO need dcp schema reference!
           * @method dcpData()
           */
          _api.dcpData = function() {
            var payload = {
              name: "nonOpt",
            };
            return payload;
          };

          /**
           * Hook for any command-specific behaviour you may have.
           * Invoked after the framework has processed any DCP response
           * Only called after successful responses
           *
           * @param   response {DCPresponse}   The newly handled response object
           * @method onSuccess(response)
           */
          _api.onSuccess = function(response) {
            return true;
          };

          /**
           * Hook for any command-specific behaviour you may have.
           * Invoked when the command manager reverts queued
           * commands (including this command) after receiving
           * either a response failure, or optimisitc failure.
           *
           * @override
           * @see     src/commands/qowtCommand.js
           * @param  response {DCP Response | undefined}  The failing DCP
           *                  response from service call or undefined if
           *                  optimistic handling failure.
           * @param  errorPolicy {object} A policy object used to determine what
           *                     behaviour to use in handling the response.
           * @method onFailure(response,errorPolicy)
           */
          _api.onFailure = function(response, errorPolicy) {
            return false;
          };


          return _api;
        };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});


 