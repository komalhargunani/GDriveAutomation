// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base class for any commands that modify cells. Mainly deals
 * with putting new cell widgets into DOM and managing buckets.
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/markDocDirtyCommandBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/commands/quicksheet/getModifiedCells',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/ui/modalDialog'
], function(
    PubSub,
    MarkDocDirtyCommandBase,
    PaneManager,
    Workbook,
    GetModifiedCellsCmd,
    SheetModel,
    SheetConfig,
    I18n,
    ModalDialog) {

  'use strict';

  /* TODO:Add GetInverse method and canInvert flag as part of this Command so
   * that it can be reused by all the edit commands in Sheet
   */
  var _factory = {

    /**
     * @constructor
     * @param config {Object} Configuration of this event. Requires
     *     members commandName and errorFactory
     * @param dcpData {Object} The dcpData for the command. si and bs are
     *     automatically added here
     * @return {Object} A command for modifying cells
     */
    create: function(config, dcpData) {

      // use module pattern for instance object
      var module = function() {

          if (!config.commandName || !config.errorFactory) {
            throw ("ERROR: updateCellsBase config object is missing fields");
          }

          var _api = MarkDocDirtyCommandBase.create(config.commandName, true);

          // assume that this command is always called on the currently active
          // sheet
          var _sheetIndex = SheetModel.activeSheetIndex;
          var _cancelled = false;
          var _kPartialCellMergeError = 'partial_cell_merge_error';

          dcpData.si = _sheetIndex;
          dcpData.bs = SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE;

          /**
           * Set the root element for the DCP response to this command.
           * This is to ensure that the NEW cell HTML elements that are created
           * when the response is processed are appended to an in memory
           * document fragment, which we then add to the DOM at the onSuccess.
           *
           * This will hold any NEW cell widgets which need to be added to the
           * existing content node.(New cell widgets will be created if we, for
           * example, enter text on a previously empty cell) If we update
           * existing cells (eg. then they will not be added to this document
           * fragment, but instead their existing widgets will just be modified
           * in-place in the existing content node.
           */
          _api.rootEl = document.createDocumentFragment();

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response. The name property
           * is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {
            // Lock the screen on the command execution
            PubSub.publish("qowt:lockScreen", {});
            return dcpData;
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
           * silently queues a GetModifiedCells command to retrieve further
           * updated sheet content if there is still more to be retrieved and
           * this command hasn't been cancelled. This gives us progressive
           * loading of the updated sheet content.
           *
           * @override
           * @param response {Object} DCP response from the service
           * @param params {Object}   Optional JSON object with command-specific
           *        data
           */
          _api.onSuccess = function(response /* params */) {

            if (_cancelled) {
              // Unlock the screen after cancellation
              PubSub.publish("qowt:unlockScreen", {});
              return;
            }

            // Process the bucket info
            var bucketsInfo = response.bi;

            // Store the bucket info to fetch any additional buckets
            // (using GetModifiedCellsCmd)
            SheetModel.modifiedSheetCellBucketArray = bucketsInfo;
            SheetModel.modifiedSheetCellBucketCurrentIndex = undefined;

            if (bucketsInfo !== undefined) {

              var numberOfBuckets = bucketsInfo.length;
              if (numberOfBuckets > 0) {

                var currentBucketIndex = 0;
                SheetModel.modifiedSheetCellBucketCurrentIndex =
                    currentBucketIndex;

                var receivedBucket = bucketsInfo[currentBucketIndex];

                var fromRowIndex = receivedBucket.r1;
                var toRowIndex = receivedBucket.r2;

                // For NEWLY CREATED cell widgets => add the populated document
                // fragment to the grid and raise an event so that the workbook
                // can layout the updated rows (NOTE: UPDATED EXISTING cell
                // widgets are already in the DOM, so they're not added here.)
                PaneManager.getMainPane().
                    getContentNode().appendChild(_api.rootEl);

                // SIGNAL TO QOWT TO RELAYOUT THE AFFECTED ROWS
                PubSub.publish('qowt:rowsUpdated', {
                  'from': fromRowIndex,
                  'to': toRowIndex
                });

                // REQUEST 2nd (ie. NEXT) BUCKET OF CONTENT (if it exists)
                _getMoreContent();
              }
            }
            else {
              // Unlock the screen if there are no buckets, eg when sorting
              // a range of empty cells
              PubSub.publish("qowt:unlockScreen", {});
            }
            /*  If the Paste edit command was preceded by Cut command then the
                selected range would have been highlighted in the respective
                panes.We need to unhighlight that selected range by removing the
                highlight widget from the DOM.The Pane widget makes sure if
                there are no highlights in any of the range then it doesn't
                remove any element from the DOM
             */
             if(config.commandName === 'PasteCellRange') {
                 PaneManager.unhighlightCells();
             }
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
            console.error(config.commandName + " command - failed: " +
                response.e);

            // When a user copy multiple cells and paste across merge cell.
            // Show a modal dialog with the error message
            if(response.e === _kPartialCellMergeError) {
              ModalDialog.info(
                I18n.getMessage('partial_cell_merge_error_short_msg'),
                I18n.getMessage('partial_cell_merge_error_msg'));
            }
            else {
              PubSub.publish('qowt:notification', {
                msg: I18n.getMessage(config.errorFactory.errorId + '_msg')});
            }

            if (errorPolicy) {
              // ensure the framework will not present an actual error dialog
              errorPolicy.eventDispatched = true;
            }

            // Unlock the screen after ANY failure
            PubSub.publish("qowt:unlockScreen", {});

            if (config.commandName === 'SetCellContent') {
              // Give focus back to the floating editor, so user can correct
              // formula entry
              Workbook.initiateCellEdit(true);
            }
          };

          /**
           * Private functions
           */

          /**
           * In the case where the command modifies more cells than can
           * reasonably returned in one response payload, we break the response
           * into buckets in the service. This adds another command to the
           * command manager's queue for the next bucket if there are any more
           * to be retrieved. The bucket size is set by the parameter
           * SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE.
           *
           * @private
           */
          var _getMoreContent = function() {

              var numberOfBuckets =
                  SheetModel.modifiedSheetCellBucketArray.length;
              var newBucketIndex =
                  SheetModel.modifiedSheetCellBucketCurrentIndex + 1;

              if (newBucketIndex < numberOfBuckets) {
                SheetModel.modifiedSheetCellBucketCurrentIndex = newBucketIndex;
                var bucketsInfo = SheetModel.modifiedSheetCellBucketArray;
                var newBucket = bucketsInfo[newBucketIndex];
                // GetModifiedCellsCmd will generate the end signals
                // (qowt:unlockScreen and config.endSignal).
                // The current implementation ignores config.endSignal and
                // instead always generates a qowt:cellContentComplete signal.
                // This is undesirable, but in practice, it's OK as the only
                // time we used this command is when there are multiple buckets.
                // This only happens in the case of SetCellContent. If we change
                // the formatting commands to return multiple buckets, then we
                // must fix this. Although, qowt:cellContentComplete has
                // subscribers, other config.endSignal signals, like
                // qowt:cellFormatComplete, qowt:cellPasteComplete don't have
                // subscribers at the time of this code writing.
                var cmd = GetModifiedCellsCmd.create(_sheetIndex, newBucket.r1,
                    newBucket.c1, newBucket.r2, newBucket.c2);

                _api.addChild(cmd);

              } else {
                // Unlock screen, as no more buckets to fetch
                PubSub.publish("qowt:unlockScreen", {});
                if(config.endSignal !== undefined) {
                    PubSub.publish(config.endSignal, {});
                }
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
