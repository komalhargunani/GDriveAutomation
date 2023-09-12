// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview An action handler which handles 'qowt:requestAction'
 * signals that are related to cut, copy and paste operations in Quicksheet.
 * This action handler is used by the Sheet Cell Tool and the
 * Sheet Text Tool to process such signals
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetTextTool'],
  function(
    PubSub,
    SheetCellTool,
    SheetTextTool) {

  'use strict';

  var _sheetCellContentType = 'sheetCell',
      _sheetTextContentType = 'sheetText',

      // Signals that are published
      _kSignal_DoAction = "qowt:doAction";

  function _onLoad() {
    SheetCellTool.registerActionHandler([
      'cut',
      'copy',
      'paste'], _handleCellCutCopyPaste);

    SheetTextTool.registerActionHandler([
      'cut',
      'copy',
      'paste'], _handleTextCutCopyPaste);
  }

  function _handleCellCutCopyPaste(actionData) {
    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': {
        contentType: _sheetCellContentType
      }
    });
  }

  function _handleTextCutCopyPaste(actionData) {
    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': {
        contentType: _sheetTextContentType
      }
    });
  }

  _onLoad();
  return {};
});
