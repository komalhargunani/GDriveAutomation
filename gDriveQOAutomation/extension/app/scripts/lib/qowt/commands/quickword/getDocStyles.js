/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * @author Duncan
 */

/**
 * GetDocStylesCmd
 * ==================
 * Defines a QW getDocStyles command including response behaviours .
 */
define([
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase'
], function(CorruptFileError, PubSub, CommandBase) {

  'use strict';


  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('getDocStyles', false, true);


          /**
           * Return an object with the data to be used as the payload of
           * the request.
           * Request manager will add the unique ID to this payload to
           * track and match client-server request-response.
           *  The name property is mandatory.
           *
           * @return  {Object} The JSON Payload to send to the dcp service
           * @method dcoData()
           */
          _api.dcpData = function() {
            return ({
              name: "getDocStyles"
            });
          };


          /**
           * Hook for any command-specific behaviour you may have.
           *  Invoked after the framework has processed any DCP response.
           *  Only called for after successful responses.
           * CommandBase provides a try block to catch exceptions
           * generated herein.
           *
           * @param   response {DCPresponse}  The newly handled response object
           * @override
           * @see     src/commands/qowtCommand.js
           * @method onSuccess(response)
           */
          _api.onSuccess = function(/* response */) {
            PubSub.publish('qowt:getDocStyles', {
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
            var failureMsg = _api.name + " command - failed: " + response.e;
            console.error(failureMsg);

            throw new CorruptFileError(failureMsg);
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
