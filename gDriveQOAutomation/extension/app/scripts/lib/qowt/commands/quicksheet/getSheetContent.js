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
 * @fileoverview Defines a GetSheetContent command including response behaviours
 * See the dcp schema on details of response, but in general this command
 * retrieves nested JSON for a range of rows in a sheet. If the GetSheetContent
 * command does not retrieve the final chunk of populated rows in a sheet then
 * it will recursively construct another GetSheetContent command to retrieve the
 * next chunk of rows. In this way the entire populated area of a sheet is
 * retrieved via successive GetSheetContent commands.
 *
 * @constructor
 * @param sheetIndex {integer}  Optional integer to indicate which sheet to
 *                              retrieve content for;defaults to
 *                              SheetModel.activeSheetIndex or if that is not
 *                              set to zero
 * @param fromRow {integer}     Optional integer to indicate which row to start
 *                              retrieving data from; defaults to zero
 * @param toRow {integer}       Optional integer to indicate up to which row to
 *                              retrieve data for; defaults to the smallest
 *                              of SheetModel.numberOfNonEmptyRows - 1 and
 *                              SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE
 * @param skipLayoutColumns {boolean} Optional boolean to indicate whether the
 *                                    columns should be laid out as part of
 *                                    the command's 'onSuccess' processing - a
 *                                    value of true indicates that the task
 *                                    of laying out the columns should be
 *                                    skipped; a value of false or undefined
 *                                    indicates that the columns should be laid
 *                                    out
 * @return {Object}             A GetSheetContent command
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandManager',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/chartSheetManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/tools/toolManager'
  ], function(
    PubSub,
    CommandBase,
    CommandManager,
    SheetSelectionManager,
    ChartSheetManager,
    PaneManager,
    Workbook,
    SheetModel,
    ContentRenderError,
    SheetConfig,
    ToolsManager) {

  'use strict';


  var _factory = {

    create: function(sheetIndex, fromRow, toRow, skipLayoutColumns) {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('GetSheetContent', false, true);

          // convention over configuration:
          // retrieve requested row range, or else get the content in chunks as
          // dictated by sheet config values note for the sheetIndex we will
          // check in the preExecuteHook function if there is an active sheet
          // index to use
          var _sheetIndex = sheetIndex;
          var _fromRow = fromRow || 0;
          var _toRow = toRow;
          var _lastNonEmptyRowIndex = 0;
          var _targetContainer;

          /**
           * Set the root element for the DCP response to this command. This is
           * to ensure that the cell HTML elements that are created when the
           * response is processed are appended to an in memory document
           * fragment, which we then add to the DOM at the onSuccess.
           */
          _api.rootEl = document.createDocumentFragment();

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response. The name property
           * is mandatory.
           *
           * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *          GetSheetContent/GetSheetContent-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {

            // (1) Some 'preExecuteHook' behaviour
            // Pre-execute hook which allows the command to update the dcpData
            // object before the command is executed. If this command was
            // constructed without a sheetIndex param then if there is an active
            // sheet index set in the model then use that, if not just default
            // down to index 0. If this command was constructed without a toRow
            // param then use the smallest of the values
            // SheetModel.numberOfNonEmptyRows - 1 and
            // SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE
            if (_sheetIndex === undefined) {
              _sheetIndex = SheetModel.activeSheetIndex || 0;
            }

            _lastNonEmptyRowIndex =
                Math.min(SheetModel.numberOfNonEmptyRows - 1,
                    SheetConfig.kGRID_DEFAULT_MAX_ROWS - 1);


            if (_toRow === undefined) {
              _toRow = Math.min(_lastNonEmptyRowIndex,
                  SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE);
            }

            // range error check
            if (_fromRow > _toRow) {
              _fromRow = 0;
              _toRow = 0;
            }

            // (2) Create the payload
            var data = {
              name: "gsc",
              si: _sheetIndex,
              r1: _fromRow,
              r2: _toRow
            };

            // also set the target content container based on the info retrieved
            // by the preceding GetSheetInformation command
            if(SheetModel.activeChartSheet) {
              _targetContainer = ChartSheetManager.getChartSheetContainer();
              skipLayoutColumns = true;
            }
            else {
              _targetContainer = PaneManager.getMainPane().getContentNode();
            }

            return data;
          };

          /**
           * Called after the commands response has been processed. The command
           * silently queues another GetSheetContent command to retrieve further
           * sheet content if there is still more to be retrieved and this
           * command hasn't been cancelled. This gives us progressive loading of
           * the sheet content.
           * @override
           * @param response {Object} DCP response from the service
           * @param params {Object}   Optional JSON object with command-specific
           *                          data
           */
          _api.onSuccess = function(/* response, params */) {

            // add the populated document fragment to the target container
            _targetContainer.appendChild(_api.rootEl);

            // if instructed to do so, layout the cached column widths now
            if(!skipLayoutColumns) {
              Workbook.layoutCachedColumnWidths();
            }

            PubSub.publish('qowt:contentReceived', {
              'from': _fromRow,
              'to': _toRow
            });

            var curSel = SheetModel.seedCell;
            if( curSel && curSel.anchor && curSel.anchor.rowIdx >= _fromRow &&
                curSel.anchor.rowIdx <= _toRow) {
              // This needs to be called first in getSheetInformationHandler
              // and then here. The first call is to make sure the selection
              // appears on the screen asap. Here we call it to make sure that
              // the toolbar buttons are updated now that we have loaded
              // the content of the anchor cell
              _trySeedSelection();
            }

            if (_toRow < _lastNonEmptyRowIndex) {
              _fetchMoreContent();
            } else {
              // Calling trySeedSelection() here to cover the case where the
              // seed selection is after the last non-empty cell
              _trySeedSelection();
              PubSub.publish('qowt:contentComplete');
            }

            // Show the cell highlighting of the last cut operation
            if (SheetModel.activeCutOpSheetIdx === SheetModel.
                  activeSheetIndex) {
              PaneManager.showCellHighlighting();
            }
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
           *
           */
          _api.onFailure = function(response, errorPolicy) {

            // Ignore any cancellation (ie. _cancelled === true), as it came too
            // late (response already received)
            console.error("GetSheetContent command - failed: " + response.e);
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
          };


          /**
           * Private functions
           */

          /**
           * Adds another GetSheetContent command to the command manager's
           * queue, to fetch the next chunk of rows in the sheet. The number of
           * rows requested is SheetConfig.kGRID_NORMAL_ROW_CHUNK_SIZE, or less
           * than that if the number of populated rows still to be retrieved is
           * less
           * @private
           */

          function _fetchMoreContent() {
            var nextFromRow = _toRow + 1;
            var nextToRow = _toRow + Math.min(_lastNonEmptyRowIndex - _toRow,
                SheetConfig.kGRID_NORMAL_ROW_CHUNK_SIZE);
            var cmd =
                _factory.create(_sheetIndex, nextFromRow, nextToRow, true);

            // Add this next GetSheetContent() command outwith the initial
            // OpenWorkbook' compound command. This means that if this next
            // GetSheetContent() command fails then it will not cause the
            // 'OpenWorkbook' compound command to fail - just this chunk of the
            // content
            CommandManager.addCommand(cmd);
          }

          function _trySeedSelection() {
            // only try to seed the cell selection if the sheet tab tool is
            // not active (it will be active if the user is renaming the sheet)
            if(ToolsManager.activeTool !== 'sheetTab') {
              SheetSelectionManager.trySeedSelection();
              SheetModel.seedCell = undefined;
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
