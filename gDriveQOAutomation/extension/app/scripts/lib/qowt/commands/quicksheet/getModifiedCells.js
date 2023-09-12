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
 * @fileoverview Defines a GetModifiedCellsCmd command including response
 * behaviours. See the dcp schema on details of response, but in general this
 * command gets a bucket of modified cells which is stored in the service.
 * The buckets will have been created by a previous call to an editable command,
 * for example SetCellContent
 *
 * @constructor
 * @param sheetIndex {integer} The index of the sheet which the changed bucket
 *        exists in.
 * @param rowIndex1 {integer} The index of the row of the first cell in the
 *        bucket which has changed.
 * @param colIndex1 {integer} The index of the column of the first cell in the
 *        bucket which has changed.
 * @param rowIndex2 {integer} The index of the row of the last cell in the
 *        bucket which has changed.
 * @param colIndex2 {integer} The index of the column of the last cell in the
 *        bucket which has changed.
 * @return {Object} A GetModifiedCellsCmd command
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/models/sheet',
  'qowtRoot/events/errors/contentRenderError'
  ], function(
    PubSub,
    CommandBase,
    PaneManager,
    SheetModel,
    ContentRenderError) {

  'use strict';


  var _factory = {

    create: function(sheetIndex, rowIndex1, colIndex1, rowIndex2, colIndex2) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('GetModifiedCellsCmd', false, true);

          var _cancelled = false;

          /**
           * Set the root element for the DCP response to this command.
           * This is to ensure that the NEW cell HTML elements that are created
           * when the response is processed are appended to an in memory
           * document fragment, which we then add to the DOM at the onSuccess.
           * This will hold any NEW cell widgets which need to be added to the
           * existing content node. (New cell widgets will be created if we, for
           * example, enter text on a previously empty cell) If we update
           * existing cells (eg. then they will not be added to this document
           * fragment, but instead their existing widgets will just be modified
           * in-place in the existing content node.
           */
          _api.rootEl = document.createDocumentFragment();

          if ((sheetIndex === undefined) || (rowIndex1 === undefined) ||
              (colIndex1 === undefined) || (rowIndex2 === undefined) ||
              (colIndex2 === undefined)) {
            throw ("ERROR: GetModifiedCellsCmd requires a sheetIndex, " +
                "rowIndex1, colIndex1, rowIndex2, colIndex2");
          }

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response. The name property
           * is mandatory.
           *
           *  @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *      GetModifiedCellRange/GetModifiedCellRange-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {

            var data = {
              name: "gmc",
              si: sheetIndex,
              r1: rowIndex1,
              c1: colIndex1,
              r2: rowIndex2,
              c2: colIndex2
            };
            // Lock the screen on the command execution
            PubSub.publish("qowt:lockScreen", {});
            return data;
          };

          /**
           * Cancel this command. The effect is that the response to this
           * command will be ignored and the command will not attempt to
           * construct another GetSheetContent command to retrieve the next
           * chunk
           */
          _api.cancel = function() {
            _cancelled = true;
          };

          /**
           * Response hook to alter the response before it is processed
           *
           * @param response {Object}  DCP response from the service
           * @return {Object}          The modified response object
           */
          _api.responseHook = function(response) {

            if (_cancelled) {
              // Unlock the screen after cancellation
              PubSub.publish("qowt:unlockScreen", {});
              // Prevents the DCP manager from doing any processing
              // (although we may still get call to onSuccess)
              return {};
            }

            return response;
          };

          /**
           * Called after the commands response has been processed. The command
           * silently queues another SetCellContent command to retrieve further
           * updated sheet content if there is still more to be retrieved and
           * this command hasn't been cancelled. This gives us progressive
           * loading of the updated sheet content.
           *
           * @override
           * @param response {Object} DCP response from the service
           * @param params {Object}   Optional JSON object with command-specific
           *        data
           */
          _api.onSuccess = function(/* response, params */) {

            if (_cancelled) {
              // Unlock the screen after cancellation
              PubSub.publish("qowt:unlockScreen", {});
              return;
            }

            var bucketsInfo = SheetModel.modifiedSheetCellBucketArray;
            var currentBucketIndex =
                SheetModel.modifiedSheetCellBucketCurrentIndex;

            var receivedBucket = bucketsInfo[currentBucketIndex];

            var fromRowIndex = receivedBucket.r1;
            var toRowIndex = receivedBucket.r2;

            // For NEWLY CREATED cell widgets => add the populated document
            // fragment to the grid and raise an event so that the workbook can
            // layout the updated rows (NOTE: UPDATED EXISTING cell widgets are
            // already in the DOM, so they're not added here.)
            PaneManager.getMainPane().getContentNode().appendChild(_api.rootEl);

            // SIGNAL TO QOWT TO RELAYOUT THE AFFECTED ROWS
            PubSub.publish('qowt:rowsUpdated', {
              'from': fromRowIndex,
              'to': toRowIndex
            });

            // REQUEST NEXT BUCKET OF CONTENT (if it exists)
            _getMoreContent();
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
          _api.onFailure = function(response, errorPolicy) {

            // Ignore any cancellation (ie. _cancelled === true), as it came too
            // late (response already received)
            console.error("GetModifiedCellsCmd command - failed: " +
                response.e);
            var rsp;

            if (response.e) {
              rsp = ContentRenderError.create();
              rsp.fatal = false; // NON-FATAL
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

            // Unlock the screen after ANY failure
            PubSub.publish("qowt:unlockScreen", {});
          };

          /**
           * Private functions
           */

          /**
           * In the case where an update request modifies more cells than can
           * reasonably returned in one response payload, we break the response
           * into buckets in the service. This adds another command to the
           * command manager's queue for the next bucket if there are any more
           * to be retrieved. The bucket size is set by the parameter.
           * SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE.
           *
           * @private
           */

          function _getMoreContent() {

            var numberOfBuckets =
                SheetModel.modifiedSheetCellBucketArray.length;
            var newBucketIndex =
                SheetModel.modifiedSheetCellBucketCurrentIndex + 1;

            if (newBucketIndex < numberOfBuckets) {
              SheetModel.modifiedSheetCellBucketCurrentIndex = newBucketIndex;
              var bucketsInfo = SheetModel.modifiedSheetCellBucketArray;
              var newBucket = bucketsInfo[newBucketIndex];
              var cmd = _factory.create(sheetIndex, newBucket.r1, newBucket.c1,
                  newBucket.r2, newBucket.c2);

              _api.addChild(cmd);
            } else {
              // Unlock screen, as no more buckets to fetch
              PubSub.publish("qowt:unlockScreen", {});
              PubSub.publish("qowt:cellContentComplete", {});
            }

          }

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
