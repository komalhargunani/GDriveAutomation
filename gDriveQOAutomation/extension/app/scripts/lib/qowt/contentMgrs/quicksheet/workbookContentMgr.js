/**
 * Constructor for the Workbook Content Manager.
 * Operations that affect the content of a workbook are serviced through this
 * manager.
 *
 * @constructor
 * @return {Object} A workbook content manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/quicksheet/openWorkbookFile',
  'qowtRoot/commands/quicksheet/getSheetInformation',
  'qowtRoot/commands/quicksheet/getWorkbookInformation',
  'qowtRoot/commands/quicksheet/getSheetContent',
  'qowtRoot/commands/quicksheet/setActiveCell',
  'qowtRoot/widgets/grid/sheetSelector',
  'qowtRoot/commands/quicksheet/toggleNumberFormatDialog',
  'qowtRoot/contentMgrs/commonContentMgr',
  'qowtRoot/contentMgrs/quicksheet/textEditorContentMgr',
  'qowtRoot/contentMgrs/quicksheet/sheetContentMgr',
  'qowtRoot/contentMgrs/quicksheet/rowContentMgr',
  'qowtRoot/contentMgrs/quicksheet/columnContentMgr',
  'qowtRoot/contentMgrs/quicksheet/cellContentMgr',
  'qowtRoot/selection/sheetSelectionManager',
  'utils/analytics/workbookMetaDataLogger'
  ], function(
    PubSub,
    Workbook,
    CommandManager,
    CommandBase,
    OpenWorkbookCmd,
    GetSheetInfoCmd,
    GetWorkbookInfoCmd,
    GetSheetContentCmd,
    SetActiveCellCmd,
    SheetSelector,
    ToggleNumberFormatDialogCmd,
    CommonContentMgr,
    TextEditorContentMgr,
    SheetContentMgr,
    RowContentMgr,
    ColumnContentMgr,
    CellContentMgr,
    SheetSelectionManager,
    WorkbookMetaDataLogger) {

  'use strict';

  var _contentType = 'workbook';
  var _doActionToken, _qowtDisableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_doActionToken || _qowtDisableToken) {
        throw new Error('Workbook Content manager initialized multiple times.');
      }
      TextEditorContentMgr.init();
      SheetContentMgr.init();
      RowContentMgr.init();
      ColumnContentMgr.init();
      CellContentMgr.init();
      SheetSelectionManager.init();
      WorkbookMetaDataLogger.init();
      _doActionToken = PubSub.subscribe('qowt:doAction', _handleWorkbookAction);
      _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
    }
  };

  /**
   * disable WorkbookContentManager defaults and cleans up all resources.
   * Note init() must be called after disable so the module is ready for use.
   */
  _api.disable = function() {
    _disable();
  };

  /* PRIVATE FUNCTIONS */

  function _handleWorkbookAction(event, eventData) {
    if (eventData.context &&
        eventData.context.contentType) {

      if (eventData.context.contentType === _contentType) {
        switch(eventData.action) {
        case 'openWorkbook':
          _handleOpenWorkbookAction(eventData.context);
          break;
        case 'zoomIn':
          _handleZoomInAction();
          break;
        case 'zoomOut':
          _handleZoomOutAction();
          break;
        case 'toggleNumberFormatDialog':
          _handleToggleNumberFormatDialogAction();
          break;
        default:
          break;
        }
      } else {
        if (eventData.context.contentType === "common") {
          switch(eventData.action) {
          case 'autoSave':
            var currentSelection = SheetSelectionManager.getCurrentSelection();
            if(currentSelection &&
              currentSelection.contentType === 'sheetCell') {
              var containingCmd = CommandBase.create();
              var activeTab = SheetSelector.getActiveTab();
              containingCmd.addChild(SetActiveCellCmd.create(activeTab,
                currentSelection.anchor.rowIdx,
                currentSelection.anchor.colIdx));
              CommandManager.addCommand(containingCmd);
            }
            break;
          default:
            break;
          }
          CommonContentMgr.handleCommonAction(event, eventData);
        }
      }
    }
  }

  /**
   * Handle an open workbook action by creating a command with the following
   * child commands:
   * - OpenWorkbookFile
   * - GetSheetInformation
   * - GetSheetContent
   *
   * @param actionContext {object} action context containing:
   * - path {string} The path of the workbook to be opened
   */
  function _handleOpenWorkbookAction(actionContext) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(OpenWorkbookCmd.create(actionContext));
    containingCmd.addChild(GetSheetInfoCmd.create());
    containingCmd.addChild(GetSheetContentCmd.create());
    CommandManager.addCommand(containingCmd);
    CommandManager.addCommand(GetWorkbookInfoCmd.create());
  }

  /**
   * Handle a zoom out action by instructing the workbook to zoom out
   */
  function _handleZoomOutAction() {
    Workbook.zoomOut();
  }

  /**
   * Handle a zoom in action by instructing the workbook to zoom in
   */
  function _handleZoomInAction() {
    Workbook.zoomIn();
  }

  /**
   * Handle toggling the visibility of the number format dialog
   */
  function _handleToggleNumberFormatDialogAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(ToggleNumberFormatDialogCmd.create());
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

