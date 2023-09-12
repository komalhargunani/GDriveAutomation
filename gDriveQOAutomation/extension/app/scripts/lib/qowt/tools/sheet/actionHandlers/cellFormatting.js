// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview An action handler which handles 'qowt:requestAction'
 * signals that are related to cell formatting operations in Quicksheet,
 * such as bold and italic.
 * This action handler is used by the Sheet Cell Tool and the
 * Sheet Text Tool to process such signals
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/selection/sheetSelectionManager'],
  function(
    PubSub,
    SheetCellTool,
    SheetTextTool,
    SheetSelectionManager) {

  'use strict';

  var _sheetCellContentType = 'sheetCell',
      _sheetTextContentType = 'sheetText',

      // Signals that are published
      _kSignal_DoAction = "qowt:doAction";

  function _onLoad() {
    SheetCellTool.registerActionHandler([
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'fontFace',
      'fontSize',
      'textColor',
      'backgroundColor',
      'numberFormat',
      'cellVAlignTop',
      'cellVAlignCenter',
      'cellVAlignBottom',
      'cellHAlignLeft',
      'cellHAlignCenter',
      'cellHAlignRight',
      'wrapText',
      'mergeAll',
      'mergeVertically',
      'mergeHorizontally',
      'unmerge',
      'border_all',
      'border_inner',
      'border_horizontal',
      'border_vertical',
      'border_outer',
      'border_left',
      'border_top',
      'border_right',
      'border_bottom',
      'border_none'], _handleCellFormatting);

    SheetTextTool.registerActionHandler([
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'fontFace',
      'fontSize',
      'textColor',
      'backgroundColor',
      'numberFormat',
      'cellVAlignTop',
      'cellVAlignCenter',
      'cellVAlignBottom',
      'cellHAlignLeft',
      'cellHAlignCenter',
      'cellHAlignRight',
      'wrapText'], _handleInlineCellFormatting);
  }

  function _handleCellFormatting(actionData) {
    var context, signalData;
    var currentSelection = SheetSelectionManager.getCurrentSelection();
    if (currentSelection && currentSelection.topLeft &&
        currentSelection.bottomRight) {
      context = actionData.context || {};
      context.contentType = _sheetCellContentType;
      context.fromRowIndex = currentSelection.topLeft.rowIdx;
      context.fromColIndex = currentSelection.topLeft.colIdx;
      context.toRowIndex = currentSelection.bottomRight.rowIdx;
      context.toColIndex = currentSelection.bottomRight.colIdx;
      context.anchor = currentSelection.anchor;
      signalData = {action: actionData.action, context: context};
      PubSub.publish(_kSignal_DoAction, signalData);
    }
  }

  function _handleInlineCellFormatting(actionData) {
    var context, signalData;
    var currentSelection = SheetSelectionManager.getCurrentSelection();
    if (currentSelection &&
        (currentSelection.contentType === _sheetTextContentType)) {
      context = actionData.context || {};
      context.contentType = _sheetTextContentType;
      signalData = {action: actionData.action, context: context};
      PubSub.publish(_kSignal_DoAction, signalData);
    }
  }

  _onLoad();
  return {};
});
