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
 * Defines a command to getStyles
 * @return {Object} getStyles command
 */
define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/commands/commandBase',
    'qowtRoot/utils/cssManager',
    'qowtRoot/events/errors/contentRenderError'
  ], function(
    PubSub,
    CommandBase,
    CssManager,
    ContentRenderError) {

  'use strict';


  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('getStyles', false, true);

          /**
           * check to see that we have the data for this in the cache
           * if we do - clone and use that instead of sending
           * un-necessary request to the service.
           */
          _api.preExecuteHook = function() {
            //TODO: making getTheme a null command as DCP does not support it.
            // changes are expected when DCP is ready with Themes.
            //_api.makeNullCommand();
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
           */
          _api.dcpData = function() {
            var payload = {
              name: "gStls"
            };
            return payload;
          };

          /**
           * Hook for any command-specific behaviour you may have.
           * Invoked after the framework has processed any DCP response
           * Only called for after successful responses
           *
           * @param   response {DCPresponse} The newly handled response object
           * @override
           * @see     src/commands/qowtCommand.js
           */
          _api.onSuccess = function(/* response */) {
            CssManager.flushCache();
          };

          /**
           * Callback for command-specific failure behaviour
           *
           * @override
           * @see     src/commands/qowtCommand.js
           * @param   response {DCP Response | undefined} The failing
           *          DCP response from service call or undefined if optimistic
           *          handling failure.
           *
           * @param   errorPolicy {object} A policy object used to determine
           *          what behaviour to use in handling the response.
           */
          _api.onFailure = function(response, errorPolicy) {
            console.warn("--> getStyles command onFailure() called: " +
              response.e);

            var rsp = ContentRenderError.create();
            rsp.fatal = true;
            if (errorPolicy) {
              errorPolicy.eventDispatched = true;
            }

            PubSub.publish('qowt:error', rsp);
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
