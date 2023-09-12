// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview An action handler which handles 'qowt:requestAction'
 * signals that are related to entire rows or columns in Quicksheet.
 * This action handler is used by the Sheet Cell Tool to process
 * such signals
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/sheet/sheetCellTool'],
  function(
    PubSub,
    SheetCellTool) {

  'use strict';

  var sheetRowContentType_ = 'sheetRow',
      sheetColContentType_ = 'sheetColumn',

      // Signals that are published
      _kSignal_DoAction = "qowt:doAction";

  function _onLoad() {
    SheetCellTool.registerActionHandler([
      'insertRow',
      'deleteRow'], _handleRowOp);

    SheetCellTool.registerActionHandler([
      'insertColumn',
      'deleteColumn'], _handleColOp);
  }

  function _handleRowOp(actionData) {
    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': {
        contentType: sheetRowContentType_
      }
    });
  }

  function _handleColOp(actionData) {
    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': {
        contentType: sheetColContentType_
      }
    });
  }

  _onLoad();
  return {};
});