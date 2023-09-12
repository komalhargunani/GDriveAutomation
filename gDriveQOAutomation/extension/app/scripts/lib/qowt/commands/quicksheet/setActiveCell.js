// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetActiveCell command including response behaviours.
 * See the dcp schema on details of response, but in general this command
 * tells core to remember the currently active cell for the given sheet
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/commandBase'],
  function(
    CommandBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a SetActiveCell command
     *
     * @param {integer} sheetIndex The index of the sheet to
     *                             set the active cell for
     * @param {integer} rowIndex The row index of the active cell
     * @param {integer} colIndex The column index of the active cell
     */
    create: function(sheetIndex, rowIndex, colIndex) {
      // extend default command (optimistic==false, callsService==true)
      var api_ = CommandBase.create('SetActiveCell', false, true);

      if(sheetIndex === undefined) {
        throw new Error("ERROR: SetActiveCell requires a sheet index");
      }

      if(rowIndex === undefined) {
        throw new Error("ERROR: SetActiveCell requires a row index");
      }

      if(colIndex === undefined) {
        throw new Error("ERROR: SetActiveCell requires a column index");
      }

      /**
       * Return an object with the data to be used as the payload of the DCP
       * request. Request manager will add the unique ID to this payload to
       * track and match client-server request-response. The name property
       * is mandatory.
       *
       * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
       *          SetActiveCell/SetActiveCell-request-schema.json
       * @return  {Object} The JSON Payload data to send to the dcp service
       */
      api_.dcpData = function() {
        return {
          name: "sac",
          si: sheetIndex,
          c1: colIndex,
          r1: rowIndex
        };
      };

      /**
       * @override
       * @see    src/commands/qowtCommand.js
       * @param  response {DCP Response | undefined}  The failing DCP
       *         response from service call or undefined if optimistic
       *         handling failure.
       * @param  errorPolicy {object} A policy object used to determine what
       *         behaviour to use in handling the response.
       */
      api_.onFailure = function(/* response, errorPolicy */) {
        // overriden to do nothing - don't dispatch an error event
      };

      return api_;
    }
  };

  return factory_;
});
