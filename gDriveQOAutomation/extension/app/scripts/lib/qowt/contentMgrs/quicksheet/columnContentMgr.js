/**
 * Constructor for the Column Content Manager.
 * Operations that affect the content of a column are serviced through this
 * manager.
 *
 * @constructor
 * @return {Object} A column content manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/quicksheet/resizeColumn',
  'qowtRoot/events/errors/sheetInsertColumnError',
  'qowtRoot/events/errors/sheetInsertColumnExceedError',
  'qowtRoot/events/errors/sheetDeleteColumnError',
  'qowtRoot/commands/quicksheet/spliceColumns',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet',
  'qowtRoot/configs/sheet'
  ], function(
    PubSub,
    CommandManager,
    CommandBase,
    ResizeColumnCmd,
    SheetInsertColError,
    SheetInsertColExceedError,
    SheetDeleteColError,
    SpliceColumnsCmd,
    SheetSelectionManager,
    SheetModel,
    SheetConfig) {

  'use strict';

  var _contentType = 'sheetColumn';

  var _doActionToken, _qowtDisableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_doActionToken || _qowtDisableToken) {
        throw new Error('Column Content manager initialized ' +
          'multiple times.');
      }
      _doActionToken = PubSub.subscribe('qowt:doAction', _handleAction);
      _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },
    /**
     * disable ColumnContentManager defaults and cleans up all resources.
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
        case 'resizeColumn':
          _handleResizeColumnAction(eventData.context);
          break;
        case 'insertColumn':
          _handleInsertColumn();
          break;
        case 'deleteColumn':
          _handleDeleteColumn();
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
   * Handle a resize column action by creating a ResizeColumn command
   *
   * @param actionContext {object} action context containing:
   * - colIndex {integer} The index of the column to be resized
   * - newWidth {integer} The new width of the column to be resized
   */
  function _handleResizeColumnAction(actionContext) {
    CommandManager.addCommand(
        ResizeColumnCmd.create(actionContext.colIndex, actionContext.deltaX));
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

  /**
   * Handle an insert column action by creating a SpliceColumns command
   */
  function _handleInsertColumn() {
    var selection = SheetSelectionManager.getCurrentSelection();
    var from, to, count = 1;
    if(selection && selection.topLeft &&
        selection.topLeft.colIdx !== undefined) {
      from = selection.topLeft.colIdx;
    }
    if(selection && selection.bottomRight &&
        selection.bottomRight.colIdx !== undefined) {
      to = selection.bottomRight.colIdx;
    }
    if(from !== undefined && to !== undefined) {
      count = to - from + 1;
    }
    if(!(from >= 0 && to >= 0)) {
      PubSub.publish('qowt:error', SheetInsertColError.create());
      return;
    }
    if(SheetModel.numberOfNonEmptyCols + count >
        SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS) {
      PubSub.publish('qowt:error', SheetInsertColExceedError.create());
      return;
    }
    var containingCmd = CommandBase.create();
    containingCmd.addChild(SpliceColumnsCmd.create(from, count));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a delete column action by creating a SpliceColumns command
   */
  function _handleDeleteColumn() {
    var selection = SheetSelectionManager.getCurrentSelection();
    var from, to, count = 1;
    if(selection && selection.topLeft &&
        selection.topLeft.colIdx !== undefined) {
      from = selection.topLeft.colIdx;
    }
    if(selection && selection.bottomRight &&
        selection.bottomRight.colIdx !== undefined) {
      to = selection.bottomRight.colIdx;
    }
    if(from !== undefined && to !== undefined) {
      count = to - from + 1;
    }
    if(!(from >= 0 && to >= 0)) {
      PubSub.publish('qowt:error', SheetDeleteColError.create());
      return;
    }

    var containingCmd = CommandBase.create();
    containingCmd.addChild(SpliceColumnsCmd.create(from, count, true));
    CommandManager.addCommand(containingCmd);
  }

  return _api;
});