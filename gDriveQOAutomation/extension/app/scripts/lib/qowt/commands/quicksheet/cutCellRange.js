// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a CutCellRange command.
 * See the dcp schema on details of response, but in general this
 * command cuts a single cell or range of cells, in the core.
 * If the command is successful then the single cell or range of
 * cells is also copied (not cut) to the system clipboard.
 *
 * @author Venkatraman Jeyaraman (Venkatraman@google.com)
 */
define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/commands/quicksheet/copyCutCellRangeCommandBase',
    'qowtRoot/controls/grid/paneManager',
    'qowtRoot/events/errors/sheetCutError',
    'qowtRoot/models/sheet'
  ], function(
    PubSub,
    CopyCutCellRangeCommandBase,
    PaneManager,
    SheetCutError,
    SheetModel) {

  'use strict';

    var _factory = {

      /**
       * Creates a CutCellRange command.
       *
       * @param {object} rangeSelection The selection object that contains
       *                                the range of cells to cut - this
       *                                may be just a single cell, or more
       */
      create: function(rangeSelection) {

        var module = function() {

          // extend CopyCutCellRangeCommandBase (optimistic==true)
          var _api = CopyCutCellRangeCommandBase.create(
            rangeSelection, 'CutCellRange', true);

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response. The name property
           * is mandatory.
           *
           *  @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
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
               si: SheetModel.activeSheetIndex,
               cut:true
            };
            return data;
          };

          // Highlight the selected cells for Cut using highlight box widget
          _api.doOptimistic = function () {
            var highlights = [];
            highlights.push({
              rowIdx: rangeSelection.topLeft.rowIdx,
              colIdx: rangeSelection.topLeft.colIdx
            });
            highlights[0].rangeEnd = {
                 rowIdx: rangeSelection.bottomRight.rowIdx,
                 colIdx: rangeSelection.bottomRight.colIdx
            };
            /* Call the Pane Manager to highlight cells for the selected range.
             * Pane Manager makes sure the highlight happens on the
             * corresponding pane for which the cells are selected
             */
            PaneManager.highlightCells(highlights);

            /**
             * TODO(gbiagiotti): Rather than storing this 'cut' state in QOWT
             * it would be better if core could tell us about it as part of the
             * getSheetContent response - e.g. a 'cr' property to tell what the
             * 'cut range' is for this sheet (this property would only have a
             * value if the user had done a 'cut' op on this sheet that they
             * haven't yet pasted somewhere, either to the same sheet or another
             * one).
             */
            SheetModel.activeCutOpSheetIdx = SheetModel.activeSheetIndex;
          };

           // Un highlight the selected range in the do revert part
           _api.doRevert = function() {
             PaneManager.unhighlightCells();
             return;
           };

           /**
            * @override
            * @see     src/commands/qowtCommand.js
            * @param  response {DCP Response | undefined}  The failing DCP
            *         response from service call or undefined if optimistic
            *         handling failure.
            *
            * @param  errorPolicy {object} A policy object used to determine
            *         what behaviour to use in handling the response.
            *
            */
           _api.onFailure = function(response, errorPolicy) {
             console.error("CutCellRange command - failed: " + response.e);
             var rsp;
             if (response.e) {
               rsp = SheetCutError.create();
               // NON-FATAL (user should still be able to go to other sheets)
               rsp.fatal = false;
             }
             /**
              * If we're catching specfic errors then override the cmdMgr
              * default error handling...
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
