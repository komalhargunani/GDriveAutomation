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
 * @fileoverview Defines a ResizeRow command including response behaviours. See
 * the dcp schema on details of response, but in general this command resizes a
 * row to have a different height than before.
 *
 * @constructor
 * @param rowIndex {integer} Mandatory integer to indicate the row to be resized
 *                           For example, a value of -10 indicates that the new
 *                           height is 10 pixels less
 * @return {Object}          A ResizeRow command
 */
define([
  'qowtRoot/commands/quicksheet/coreUndoRedo',
  'qowtRoot/commands/quicksheet/updateRowsColumnsBase',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/models/sheet'
], function (
  CoreUndoRedo,
  UpdateRowsColumnsBase,
  Workbook,
  PaneManager,
  UnitConversionUtils,
  SheetModel) {

  'use strict';

  var _factory = {

    create:function (rowIndex, deltaY) {

      // use module pattern for instance object
      var module = function () {

        var _api = UpdateRowsColumnsBase.create('ResizeRow');

        if (rowIndex === undefined) {
          throw ("ERROR: ResizeRow requires a row index");
        }

        if (deltaY === undefined) {
          throw ("ERROR: ResizeRow requires a deltaY");
        }

        var _rowWidget = Workbook.getRow(rowIndex);
        if (_rowWidget === undefined) {
          throw ("ERROR: ResizeRow requires a valid row index");
        }

        /**
         * Return an object with the data to be used as the payload of the DCP
         * request. Request manager will add the unique ID to this payload to
         * track and match client-server request-response. The name property is
         * mandatory.
         *
         * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
         *          SetRowSize/SetRowSize-request-schema.json
         * @return  {Object} The JSON Payload data to send to the dcp service
         */
        _api.dcpData = function () {

          var newRowHeight = _rowWidget.getHeight();
          /*
           * After resizing the row, value in newRowHeight is in pixels.
           * So need to convert newRowHeight from pixel to point units.
           */
          newRowHeight = UnitConversionUtils.convertPixelToPoint(newRowHeight);

          var data = {
            name:"rSZ",
            // LM TODO: change to "srs" here and in the service
            si:SheetModel.activeSheetIndex,
            rw:rowIndex,
            rh:newRowHeight,
            qu:true
          };

          return data;
        };

        /**
         * Optimistic part of the request (called from MarkDocDirtyCommandBase)
         */
        _api.doDirtyOptimistic = function() {
          PaneManager.resizeRow(rowIndex, deltaY);
        };

        /**
         * Reverts the optimistic part of the request if the request fails
         */
        _api.doRevert = function () {
          PaneManager.resizeRow(rowIndex, -deltaY);
        };

        /**
         * Creates the inverse command for undo.
         */
        _api.canInvert = true;
        _api.getInverse = function() {
          return CoreUndoRedo.createUndo();
        };

        /**
         * @override
         * @see    src/commands/qowtCommand.js
         * @param  response {DCP Response | undefined}  The failing DCP response
         *         from service call or undefined if optimistic handling
         *         failure.
         * @param  errorPolicy {object} A policy object used to determine what
         *         behaviour to use in handling the response.
         */
        _api.onFailure = function (/* response, errorPolicy */) {
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
