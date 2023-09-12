/**
 * Constructor for the Sheet Content Manager.
 * Operations that affect the content of a sheet are serviced through this
 * manager.
 *
 * @constructor
 * @return {Object} A sheet content manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/models/sheet',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/quicksheet/getSheetInformation',
  'qowtRoot/commands/quicksheet/getSheetContent',
  'qowtRoot/commands/quicksheet/setActiveCell',
  'qowtRoot/commands/quicksheet/setActiveSheetIndex',
  'qowtRoot/commands/quicksheet/setFreezePanes',
  'qowtRoot/commands/quicksheet/setSheetInfo',
  'qowtRoot/commands/quicksheet/resetWorkbook',
  'qowtRoot/commands/common/unlockScreen',
  'qowtRoot/controls/grid/paneManager'
  ], function(
    PubSub,
    SheetSelectionManager,
    SheetModel,
    CommandManager,
    CommandBase,
    GetSheetInfoCmd,
    GetSheetContentCmd,
    SetActiveCellCmd,
    SetActiveSheetIndexCmd,
    SetFreezePanesCmd,
    SetSheetInfo,
    ResetWorkbookCmd,
    UnlockScreen,
    PaneManager) {

  'use strict';

  var _contentType = 'sheet';

  var _doActionToken, _qowtDisableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_doActionToken || _qowtDisableToken) {
        throw new Error('Sheet Content manager initialized ' +
          'multiple times.');
      }
      _doActionToken = PubSub.subscribe('qowt:doAction', _handleAction);
      _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },
    /**
     * disable SheetContentManager defaults and cleans up all resources.
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
        case 'changeSheet':
          _handleChangeSheetAction(eventData.context);
          break;
        case 'freeze':
          _handleFreezePanesAction();
          break;
        case 'unfreeze':
          _handleUnfreezePanesAction();
          break;
          case 'renameSheet':
          _handleSheetRenameAction(eventData.context);
          break;
        default:
          break;
      }
    }
  }

  /**
   * @private
   *
   * This private API handles the action to rename a sheet tab.
   * SetSheetInfo Command is prepared with the relevant actionContext data
   * and is added to the CommandManager. The configuration parameters are
   * those which are required for a command inheriting from
   * markDocDirtyCommandBase.
   *
   * @param {object} actionContext details what parameters the command needs to
   *     work over.
   */
  function _handleSheetRenameAction(actionContext){
      var _config = {
        sheetName : actionContext.newSheetName,
        sheetIndex: actionContext.sheetIndex,
        oldSheetName: actionContext.oldSheetName
      };

      CommandManager.addCommand(SetSheetInfo.create(_config));
  }
  /**
   * Handle a change sheet action by creating a command with the following child
   * commands:
   * - GetSheetInformation
   * - GetSheetContent
   * - SetActiveSheetIndex
   *
   * @param actionContext {object} action context containing:
   * - sheetIndex {integer} The index of the sheet to change to
   */
  function _handleChangeSheetAction(actionContext) {
    CommandManager.cancelAllCommands();

    SheetModel.seedCell = undefined;
    var containingCmd = CommandBase.create();
    containingCmd.addChild(ResetWorkbookCmd.create());

    if(SheetModel.currentCellSelection) {
      containingCmd.addChild(SetActiveCellCmd.
        create(SheetModel.activeSheetIndex,
          SheetModel.currentCellSelection.anchor.rowIdx,
          SheetModel.currentCellSelection.anchor.colIdx));
    }

    SheetModel.activeSheetIndex = actionContext.newSheetIndex;
    // There are cases where we cancel commands before a command completes and
    // unlocks the scren. For those cases, we add an unlock screen command here.
    // This is an ugly solution and should be considered temporary.
    containingCmd.
      addChild(UnlockScreen.create());
    containingCmd.
      addChild(GetSheetInfoCmd.create(SheetModel.activeSheetIndex));
    containingCmd.
      addChild(GetSheetContentCmd.create(SheetModel.activeSheetIndex));
    containingCmd.
      addChild(SetActiveSheetIndexCmd.create(SheetModel.activeSheetIndex));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a freeze panes action by creating a SetFreezePanes command
   */
  function _handleFreezePanesAction() {
    var selection = SheetSelectionManager.getCurrentSelection();
    var rowIndex = selection.anchor.rowIdx;
    var colIndex = selection.anchor.colIdx;

    // row selection: we want to freeze just rows, so we ignore the
    // anchor's colIndex
    if (selection.topLeft.colIdx === undefined) {
      colIndex = 0;
    }
    // column selection: we want to freeze just columns, so we ignore the
    // anchor's rowIndex
    else if (selection.topLeft.rowIdx === undefined) {
      rowIndex = 0;
    }
    // If A1 cell or first row/column is selected and user freezes the pane,
    // freeze the middle row and middle column of the displayed area.
    if (colIndex === 0 && rowIndex === 0) {
      rowIndex = PaneManager.getVisibleWindowMiddleRowIdx();
      colIndex = PaneManager.getVisibleWindowMiddleColIdx();
    }

    CommandManager.addCommand(SetFreezePanesCmd.create(rowIndex, colIndex));
  }

  /**
   * Handle an unfreeze panes action by creating a SetFreezePanes command with
   * row and column set to 0
   */
  function _handleUnfreezePanesAction() {
    var rowIndex = 0;
    var colIndex = 0;
    CommandManager.addCommand(SetFreezePanesCmd.create(rowIndex, colIndex));
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

