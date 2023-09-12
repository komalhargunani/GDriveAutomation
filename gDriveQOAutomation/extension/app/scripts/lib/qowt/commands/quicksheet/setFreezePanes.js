// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a SetFreezePanes command including response behaviours.
 * See the dcp schema on details of response, but in general this command
 * creates an optimistic command, which tells the core where a sheet is frozen
 * or unfreezes the sheet.
 *
 */

define([
  'qowtRoot/commands/markDocDirtyCommandBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/models/sheet'
  ], function(
    MarkDocDirtyCommandBase,
    PaneManager,
    Workbook,
    SheetModel) {

  'use strict';

  var _factory = {

    create: function(rowIndex, columnIndex) {

      var _api = MarkDocDirtyCommandBase.create('SetFreezePanes', true),

          _rowIndex = rowIndex,
          _columnIndex = columnIndex,
          _oldRowIndex, _oldColumnIndex, _isFrozen;

      if (_rowIndex === undefined) {
        throw ("ERROR: FreezePanes requires a row index");
      }

      if (_columnIndex === undefined) {
        throw ("ERROR: FreezePanes requires a column index");
      }

      // if the current selection is a floater then ensure that we use the
      // underlying top-left cell of the floater as the frozen anchor
      var floater = Workbook.findContainingFloater(_rowIndex, _columnIndex);
      if(floater) {
        _rowIndex = floater.y();
        _columnIndex = floater.x();
      }

      /**
       * Return an object with the data to be used as the payload of the DCP
       * request. Request manager will add the unique ID to this payload to
       * track and match client-server request-response. The name property
       * is mandatory.
       *
       * @see     dcplegacyservice-cpp-main/schemas/requests/quicksheet/
       *          SetFreezePanes/SetFreezePanes-request-schema.json
       * @return  {Object} The JSON Payload data to send to the dcp service
       */
      _api.dcpData = function() {
        return {
          name: "sfp",
          si: SheetModel.activeSheetIndex,
          ci: _columnIndex,
          ri: _rowIndex
        };
      };

      /**
       * Reverts the optimistic part of the request if the request fails
       */
      _api.doRevert = function() {
        if (_isFrozen) {
          Workbook.freezePanes(_oldRowIndex, _oldColumnIndex);
        } else {
          Workbook.unfreezePanes();
        }
      };

      /**
       * Optimistic part of the request
       * (called from MarkDocDirtyCommandBase)
       */
      _api.doDirtyOptimistic = function() {
        _oldRowIndex = Workbook.getFrozenRowIndex();
        _oldColumnIndex = Workbook.getFrozenColumnIndex();
        _isFrozen = Workbook.isFrozen();
        if (_isFrozen) {
          Workbook.unfreezePanes();
        } else {
          Workbook.freezePanes(_rowIndex, _columnIndex);
        }
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
       *
       */
      _api.onFailure = function(/* response, errorPolicy */) {
        // do nothing - if request fails then don't dispatch an error event
      };


      /** Creates the inverse command to undo changes. */
      _api.canInvert = true;
      _api.getInverse = function() {
        var rowIndex = 0, colIndex = 0;

        if (Workbook.isFrozen()) {
          rowIndex = PaneManager.getFrozenRowIndex();
          colIndex = PaneManager.getFrozenColumnIndex();
        }
        return _factory.create(rowIndex, colIndex);
      };

      return _api;
    }
  };

  return _factory;
});
