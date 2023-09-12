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
 * @fileoverview Defines a ResizeColumn command including response behaviours.
 * See the dcp schema on details of response, but in general this
 * command resizes a column to have a different width than before.
 *
 * @constructor
 * @param colIndex {integer} Mandatory integer to indicate the column to be
 *        resized For example, a value of -10 indicates that the new width is 10
 *        pixels less
 *
 * @return {Object}          A ResizeColumn command
 */
define([
  'qowtRoot/commands/quicksheet/updateRowsColumnsBase',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/models/sheet'
  ], function(
    UpdateRowsColumnsBase,
    Workbook,
    PaneManager,
    UnitConversionUtils,
    SheetModel) {

  'use strict';

  var _factory = {

    create: function(colIndex, deltaX) {

      // use module pattern for instance object
      var module = function() {

          var _api = UpdateRowsColumnsBase.create('ResizeColumn');

          if (colIndex === undefined) {
            throw ("ERROR: ResizeColumn requires a column index");
          }

          if (deltaX === undefined) {
            throw ("ERROR: ResizeColumn requires a width delta value");
          }

          var _colWidget = Workbook.getColumn(colIndex);
          if (_colWidget === undefined) {
            throw ("ERROR: ResizeColumn requires a valid column index");
          }

          /**
           * Return an object with the data to be used as the payload of the DCP
           * request. Request manager will add the unique ID to this payload to
           * track and match client-server request-response
           *
           * The name property is mandatory.
           *
           * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
           *          SetColumnSize/SetColumnSize-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {

            var newColWidth = _colWidget.getWidth();
            /*
             * After resizing the column, value in newColWidth is in pixels.
             * So need to convert newColWidth from pixel to point units.
             */
            newColWidth = UnitConversionUtils.convertPixelToPoint(newColWidth);

            var data = {
              name: "cSZ",
              // LM TODO: change to "scs" here and in the service
              si: SheetModel.activeSheetIndex,
              cl: colIndex,
              cw: newColWidth,
              hd: _colWidget.isHidden() ? 1 : 0,
              qu: true
            };

            return data;
          };

          /**
           * Optimistic part of the request(called from MarkDocDirtyCommandBase)
           */
          _api.doDirtyOptimistic = function() {
            PaneManager.resizeColumn(colIndex, deltaX);
          };

          /**
           * Reverts the optimistic part of the request if the request fails
           */
          _api.doRevert = function() {
            PaneManager.resizeColumn(colIndex, -deltaX);
          };

          /**
           * Creates the inverse command for undo.
           */
          _api.canInvert = true;
          _api.getInverse = function() {
            return _factory.create(colIndex, -deltaX);
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
