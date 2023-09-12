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
 * get Slide Info command definition
 * @param {Number} Slide number for which contents are requested.
 * @constructor
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/models/point',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/events/errors/fileOpenError',
  'qowtRoot/utils/errorUtils'
  ], function(
    PubSub,
    CommandBase,
    PointModel,
    ContentRenderError,
    FileOpenError,
    ErrorUtils) {

  'use strict';

    var _factory = {

      create: function(slideNumber) {

        // use module pattern for instance object
        var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('getSlideInfo', false, true);

            /**
             * Return an object with the data to be used as the payload of
             * the DCP request.
             * Request manager will add the unique ID to this payload to
             * track and match client-server request-response
             * The name property is mandatory.
             *
             * @return {Object} The JSON Payload data to send to the
             * dcp service
             * @see     TODO need dcp schema reference!
             */
            _api.dcpData = function() {
              var payload = {
                name:   "gSldInfo",
                sn: slideNumber
              };
              return payload;
            };

            /**
             * Callback for command-specific failure behaviour
             *
             * @override
             * @see     src/commands/qowtCommand.js
             * @param response {DCP Response | undefined} The failing
             * DCP response from service call
             *         or undefined if optimistic handling failure.
             * @param errorPolicy {object} A policy object used to
             * determine what behaviour to use in
             *         handling the response.
             */
            _api.onFailure = function(response, errorPolicy) {
              console.warn("getSlideInfo command onFailure() called: " + 
              response.e);

              var rsp;
              if (response.e === "cpf") {
                rsp = FileOpenError.create();
                // add the core response as additional info
                rsp.additionalInfo = ErrorUtils.errorInfo(response);
                rsp.fatal = true;
              } else {
                rsp = ContentRenderError.create();
                rsp.fatal = (slideNumber === undefined);
              }

              if (errorPolicy) {
                errorPolicy.eventDispatched = true;
              }
              PubSub.publish('qowt:error', rsp);
            };

            /**
             * on Success of 'getSlideINfo', cache the slide-layout id,
             * master-layout id and theme-id.
             *
             * @param   response {DCPresponse} The newly handled response object
             * @override
             * @see     src/commands/qowtCommand.js
             */
            _api.onSuccess = function(response) {
              // console.log("Inside getSlideInfo - onSuccess " + slideNumber);

              //cache theme-id, masterLayout-id and slideLayout-id
              PointModel.MasterSlideId = response.eidmt;
              PointModel.SlideLayoutId = response.eidlt;
              PointModel.currentSlideEId = response.eid;
              PointModel.SlideId = slideNumber;
              PointModel.ThemeId = response.eidth;
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
