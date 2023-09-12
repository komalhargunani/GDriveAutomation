
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A mock optimistic command that does not call the service.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
    'qowtRoot/commands/commandBase',
  ], function(
    CommandBase) {

  'use strict';

  var _factory = {

    create: function(opt_cmdName) {

      // use module pattern for instance object
      var module = function() {

          opt_cmdName = opt_cmdName || 'optimisticCmd';
          // Notice the arguments of optimistic = true, callsService = true
          var _api = CommandBase.create(opt_cmdName, true, true);


          /**
           * Optional
           * Only relevant for optimistic commands
           * This is where, for an optimistic command you implement the
           * optimisitc hanlding. eg, insert text formatting at cursor
           * @method doOptimistic()
           */
          _api.doOptimistic = function() {
            return true;
          };

          /**
           * Optional
           * Only relevant for optimistic commands
           * This is the counterpart to doOptimistic() where you implement the
           * revert behaviour when you have to revert the optimistic processing
           * @method doRevert()
           */
          _api.doRevert = function() {
            return true;
          };

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
              name: "optimisticCmd",
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


 