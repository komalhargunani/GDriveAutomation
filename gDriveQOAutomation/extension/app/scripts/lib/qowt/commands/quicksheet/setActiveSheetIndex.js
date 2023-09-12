/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained herein are
 * proprietary to Quickoffice, Inc. and is protected by trade secret and
 * copyright law. Dissemination of any of this information or reproduction of
 * this material is strictly forbidden unless prior written permission is
 * obtained from Quickoffice, Inc.
 */

/**
 * @fileoverview Defines a SetActiveSheetIndex command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command creates an optimistic command, which tells what is the current
 * selected sheet
 *
 * @constructor
 * @param sheetIndex {Number} The sheet index
 * @return {Object} A SetActiveSheetIndex command
 */
define(['qowtRoot/commands/commandBase'], function(CommandBase) {

  'use strict';


  var _factory = {

    create: function(sheetIndex) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==true, callsService==true)
          var _api = CommandBase.create('SetActiveSheetIndex', true, true);

          if (sheetIndex === undefined) {
            throw ("ERROR: SetActiveSheetIndex requires a sheet index");
          }

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response. The name property
           * is mandatory.
           *
           * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *         SetActiveSheetIndex/SetActiveSheetIndex-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {
            return {
              name: "sai",
              si: sheetIndex
            };
          };

          /**
           * Reverts the optimistic part of the request if the request fails
           */
          _api.doRevert = function() {
            return; // Nothing to revert as nothing is done in doOptimistic
          };

          /**
           * Optimistic part of the request
           */
          _api.doOptimistic = function() {
            // We have actually set the selection already so there's nothing to
            // do here
            return;
          };

          /**
           * @override
           * @see    src/commands/qowtCommand.js
           * @param  response {DCP Response | undefined}  The failing DCP
           *         response from service call or undefined if optimistic
           *         handling failure.
           *
           * @param  errorPolicy {object} A policy object used to determine what
           *         behaviour to use in handling the response.
           *
           */
          _api.onFailure = function(/* response, errorPolicy */) {
            // do nothing - if request fails then don't dispatch an error event
          };

          return _api;
        };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
