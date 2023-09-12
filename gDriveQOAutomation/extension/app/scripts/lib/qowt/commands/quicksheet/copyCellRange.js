// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a CopyCellRange command.
 * See the dcp schema on details of response, but in general this
 * command copies a single cell or range of cells, in the core.
 * If the command is successful then the single cell or range of
 * cells is also copied to the system clipboard.
 *
 * @author Venkatraman Jeyaraman (Venkatraman@google.com)
 */
define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/commands/quicksheet/copyCutCellRangeCommandBase',
    'qowtRoot/events/errors/sheetCopyError',
    'qowtRoot/models/sheet'
  ], function(
    PubSub,
    CopyCutCellRangeCommandBase,
    SheetCopyError,
    SheetModel) {

  'use strict';

  var _factory = {

    /**
     * Creates a CopyCellRange command.
     *
     * @param {object} rangeSelection The selection object that contains
     *                                the range of cells to copy - this
     *                                may be just a single cell, or more
     */
    create: function(rangeSelection) {

         var module = function() {

          // extend CopyCutCellRangeCommandBase (optimistic==false)
          var _api = CopyCutCellRangeCommandBase.create(
            rangeSelection, 'CopyCellRange', false);

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response The name property is
           * mandatory.
           * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *          CutCopyCells/CutCopyCells-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {
              var data = {
                 name: "ccr",
                 r1: rangeSelection.topLeft.rowIdx,
                 c1: rangeSelection.topLeft.colIdx,
                 r2: rangeSelection.bottomRight.rowIdx,
                 c2: rangeSelection.bottomRight.colIdx,
                 si: SheetModel.activeSheetIndex
              };
              return data;
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
           */
          _api.onFailure = function(response, errorPolicy) {
            console.error("CopyCellRange command - failed: " + response.e);
            var rsp;

            if (response.e) {
              rsp = SheetCopyError.create();
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

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;

     }
  };

  return _factory;
});
