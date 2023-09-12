// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview An action handler which handles 'qowt:requestAction'
 * signals that are related to cell content editing in Quicksheet.
 * This action handler is used by the Sheet Cell Tool to process
 * such signals
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/controls/grid/workbook'],
  function(
    QOWTSilentError,
    PubSub,
    SheetCellTool,
    SheetTextTool,
    Workbook) {

  'use strict';

  var sheetCellContentType_ = 'sheetCell',

      // Signals that are published
      _kSignal_DoAction = "qowt:doAction";

  function _onLoad() {
    SheetCellTool.registerActionHandler(['commitCellEdit'], _handleCommitEdit);
    SheetTextTool.registerActionHandler(['commitCellEdit'], _handleCommitEdit);

    SheetCellTool.registerActionHandler(['cancelCellEdit'], _handleCancelEdit);
  }

  function _handleCommitEdit(actionData) {
    var obj = Workbook.getTargetCellForEdit();
    if (obj.rowIdx === undefined || obj.colIdx === undefined) {
      throw new QOWTSilentError('Unable to commit, no selection');
    }

    var context = actionData.context;
    // In a normal edit we always just change a single cell: the target cell,
    // ie. normally the anchor. However here we set all the properties to
    // avoid any confusion with delete of a whole row or column where some of
    // these properties are undefined
    context.fromRowIndex = obj.rowIdx;
    context.fromColIndex = obj.colIdx;
    context.toRowIndex = obj.rowIdx;
    context.toColIndex = obj.colIdx;
    context.textWidget = Workbook.getActivePane().getFloatingEditor();

    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': context
    });
  }

  function _handleCancelEdit(actionData) {
    PubSub.publish(_kSignal_DoAction, {
      'action': actionData.action,
      'context': {
        contentType: sheetCellContentType_
      }
    });
  }

  _onLoad();
  return {};
});

