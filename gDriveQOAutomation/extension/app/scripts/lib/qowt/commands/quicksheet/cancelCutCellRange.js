// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a CancelCutCellRange command
 * This command instructs the PaneManager to:
 * - Unhighlight the cells which are highlighted during the Cut Operation
 * @author Venkatraman Jeyaraman (Venkatraman@google.com)
 *
 * @constructor
 * @return {Object} A CancelCutCellRange command
 */
define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/controls/grid/paneManager'
  ], function(
    CommandBase,
    PaneManager) {

  'use strict';

  var _factory = {

    create: function() {

      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create('CancelCutCellRange', false,true);
        /**
         * Return an object with the data to be used as the payload of the DCP
         * request.
         * Request manager will add the unique ID to this payload to track and
         * match client-server request-response. The name property is mandatory.
         * @see
         * dcplegacyservice-cpp-main/schemas/requests/quicksheet/CutCopyCells/
         * CancelCutOperation-request-schema.json
         * @return  {Object} The JSON Payload data to send to the dcp service
         */

        _api.dcpData = function() {
          var data = {
            name: "ccp"
          };
          return data;
        };

        /**
         * Called after the commands response has been processed.
         * @override
         * @param response {Object} DCP response from the service
         * @param params {Object}   Optional JSON object with command-specific
         *                          data
         */

        _api.onSuccess = function(/* response, params */) {
          PaneManager.unhighlightCells();
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
