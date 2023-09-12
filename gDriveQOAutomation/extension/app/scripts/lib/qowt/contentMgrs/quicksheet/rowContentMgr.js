/**
 * Constructor for the Row Content Manager.
 * Operations that affect the content of a row are serviced through this
 * manager.
 *
 * @constructor
 * @return {Object} A row content manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/events/errors/sheetInsertRowError',
  'qowtRoot/events/errors/sheetInsertRowExceedError',
  'qowtRoot/events/errors/sheetDeleteRowError',
  'qowtRoot/commands/quicksheet/resizeRow',
  'qowtRoot/commands/quicksheet/spliceRows',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet',
  'qowtRoot/configs/sheet',
  'qowtRoot/commands/quicksheet/getSheetContent',
  'qowtRoot/controls/grid/paneManager'
  ], function(
    PubSub,
    CommandManager,
    CommandBase,
    SheetInsertRowError,
    SheetInsertRowExceedError,
    SheetDeleteRowError,
    ResizeRowCmd,
    SpliceRowsCmd,
    SheetSelectionManager,
    SheetModel,
    SheetConfig,
    GetSheetContentCmd,
    PaneManager) {

  'use strict';

  var _contentType = 'sheetRow';

  var _doActionToken, _qowtDisableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_doActionToken || _qowtDisableToken) {
        throw new Error('Row Content manager initialized ' +
          'multiple times.');
      }
      _doActionToken = PubSub.subscribe('qowt:doAction', _handleAction);
      _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },
    /**
     * disable RowContentManager defaults and cleans up all resources.
     * Note init() must be called after disable so the module is ready for use.
     */
    disable: function() {
      _disable();
    }
  };
  function _handleAction(event, eventData) {
    event = event || {};
    if (eventData.context &&
        eventData.context.contentType &&
        eventData.context.contentType === _contentType) {

      switch(eventData.action) {
        case 'resizeRow':
          _handleResizeRowAction(eventData.context);
          break;
        case 'insertRow':
          _handleInsertRow();
          break;
        case 'deleteRow':
          _handleDeleteRow();
          break;
        case 'autofit':
          // only added this to show what else would be here, and
          // thereby keep jshint happy that this is a valid switch
          // statement and that no thank you we dont want an if statement ;-)
          break;
        default:
          break;
      }
    }
  }

  /**
   * Handle a resize row action by creating a ResizeRow command
   *
   * @param actionContext {object} action context containing:
   * - rowIndex {integer} The index of the row to be resized
   * - newHeight {integer} The new height of the row to be resized
   */
  function _handleResizeRowAction(actionContext) {
    CommandManager.addCommand(
        ResizeRowCmd.create(actionContext.rowIndex, actionContext.deltaY));
  }

  /**
   * Handle an insert row action by creating a SpliceRow command
   */
  function _handleInsertRow() {
    var selection = SheetSelectionManager.getCurrentSelection();
    var from, to, count = 1;
    if(selection && selection.topLeft &&
      selection.topLeft.rowIdx !== undefined) {
      from = selection.topLeft.rowIdx;
    }
    if(selection && selection.bottomRight &&
      selection.bottomRight.rowIdx !== undefined) {
      to = selection.bottomRight.rowIdx;
    }
    if(from !== undefined && to !== undefined) {
      count = to - from + 1;
    }
    if(!(from >= 0 && to >= 0)) {
      PubSub.publish('qowt:error', SheetInsertRowError.create());
      return;
    }
    if(SheetModel.numberOfNonEmptyRows + count >
        SheetConfig.kGRID_DEFAULT_ABS_MAX_ROWS) {
      PubSub.publish('qowt:error', SheetInsertRowExceedError.create());
      return;
    }
    var containingCmd = CommandBase.create();
    containingCmd.addChild(SpliceRowsCmd.create(from, count));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a delete row action by creating a SpliceRow command
   */
  function _handleDeleteRow() {
    var selection = SheetSelectionManager.getCurrentSelection();
    var from, to, count = 1;
    if(selection && selection.topLeft &&
      selection.topLeft.rowIdx !== undefined) {
      from = selection.topLeft.rowIdx;
    }
    if(selection && selection.bottomRight &&
      selection.bottomRight.rowIdx !== undefined) {
      to = selection.bottomRight.rowIdx;
    }
    if(from !== undefined && to !== undefined) {
      count = to - from + 1;
    }
    if(!(from >= 0 && to >= 0)) {
      PubSub.publish('qowt:error', SheetDeleteRowError.create());
      return;
    }

    var containingCmd = CommandBase.create();
    containingCmd.addChild(SpliceRowsCmd.create(from, count, true));

    // Lets request new rows into the space of the deleted ones
    var numOfRows = PaneManager.getMainPane().getNumOfRows();
    if(SheetModel.numOfNonEmptyRows > numOfRows) {
      var reqFrom = numOfRows - count - 1;
      var reqTo = numOfRows - 1;
      containingCmd.addChild(GetSheetContentCmd.
        create(SheetModel.activeSheetIndex, reqFrom, reqTo));
    }
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Unsubscribe all the outstanding tokens or listeners.
   */
  function _disable() {
    PubSub.unsubscribe(_doActionToken);
    PubSub.unsubscribe(_qowtDisableToken);
    _doActionToken = undefined;
    _qowtDisableToken = undefined;
  }

  return _api;
});
