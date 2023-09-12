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
 * @fileoverview Defines a GetSheetInformation command including response
 * behaviours See the dcp schema on details of response, but in general this
 * command retrieves information about a particular sheet, such as the column
 * widths for that sheet.
 *
 * @constructor
 * @param sheetIndex {integer}  Optional integer to indicate which sheet to
 *                              retrieve content for;
 *                              defaults to SheetModel.activeSheetIndex or if
 *                              that is not set to zero
 * @return {Object}             A GetSheetInformation command
 */
define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/commands/commandBase',
    'qowtRoot/models/sheet',
    'qowtRoot/events/errors/sheetLoadError'
  ], function(
    PubSub,
    CommandBase,
    SheetModel,
    SheetLoadError) {

  'use strict';


  var _factory = {

    create: function(sheetIndex) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('GetSheetInformation', false, true);

          var _sheetIndex = sheetIndex;
          if ((_sheetIndex !== undefined) && typeof(_sheetIndex) !== "number") {
            throw ("ERROR: GetSheetInformation requires parameter to be " +
                "undefined or an integer");
          }


          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response.The name property is
           * mandatory.
           *
           *  @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *  GetSheetInformation/GetSheetInformation-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {

            // (1) Some 'preExecuteHook' behaviour
            // Pre-execute hook which allows the command to update the dcpData
            // object before the command is executed. If this command was
            // constructed without a sheetIndex param then if there is an active
            // sheet index set in the model then use that,if not just default
            // down to index 0.
            if (_sheetIndex === undefined) {
              _sheetIndex = SheetModel.activeSheetIndex || 0;
            }

            // (2) Create the payload
            var data = {
              name: "gsi",
              si: _sheetIndex
            };

            return data;
          };

          /**
           * @override
           * @see     src/commands/qowtCommand.js
           * @param  response {DCP Response | undefined}  The failing DCP
           *         response from service call or undefined if optimistic
           *         handling failure.
           *
           * @param  errorPolicy {object} A policy object used to determine what
           *         behaviour to use in handling the response.
           */
          _api.onFailure = function(response, errorPolicy) {

            // Ignore any cancellation (ie. _cancelled === true), as it came too
            // late (response already received)
            console.error("GetSheetInformation command - failed: " +
                response.e);
            var rsp;

            if (response.e) {
              rsp = SheetLoadError.create();
              // NON-FATAL (user should still be able to go to other sheets)
              rsp.fatal = false;
            }

            /**
             * If we're catching specfic errors then override the cmdMgr default
             * error handling...
             */
            if (rsp !== undefined) {
              if (errorPolicy) {
                errorPolicy.eventDispatched = true;
              }
              PubSub.publish('qowt:error', rsp);
            }
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
