/// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a GetWorkbookInformation command including response
 *  behaviours
 * See the dcp schema on details of response, but in general this
 * command retrieves information about a particular workbook.
 *
 * @author anchals@google.com (Anchal Sharma)
 */

define([
    'qowtRoot/commands/commandBase'
  ], function(
    CommandBase) {

  'use strict';


  var _factory = {

    create: function() {

      // extend default command (optimistic==false, callsService==true)
      var _api = CommandBase.create('GetWorkbookInformation', false, true);


      /**
       * Return an object with the data to be used as the payload of the
       * DCP request.
       * Request manager will add the unique ID to this payload to track
       * and match client-server request-response
       * The name property is mandatory.
       *
       * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet
       *          /GetWorkbookInformation/
       *          GetWorkbookInformation-request-schema.json
       * @return  {Object} The JSON Payload data to send to the dcp
       *           service
       */
      _api.dcpData = function() {

        var payload = {
          name: "gwi",
        };

        return payload;
      };

      /**
       * @override
       * @see    src/commands/qowtCommand.js
       * @param  response {DCP Response | undefined}  The failing DCP
       *         response from service call or undefined if optimistic
       *         handling failure.
       * @param  errorPolicy {object} A policy object used to determine
       *         what behaviour to use in handling the response.
       */
      _api.onFailure = function(response, errorPolicy) {

        console.error("GetWorkbookInformation command - failed: " +
                      response.e);

        if (response.e) {
          if (errorPolicy) {
             errorPolicy.ignoreError = true;
          }
        }
      };
      return _api;
    }
  };

  return _factory;
});
