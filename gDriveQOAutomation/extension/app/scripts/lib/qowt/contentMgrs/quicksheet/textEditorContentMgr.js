/**
 * Constructor for the Text Editor Content Manager.
 * Operations that affect the text editors in Sheet (namely, the
 * formula bar and the floating editor) are serviced through this manager.
 *
 * @constructor
 * @return {Object} A text editor manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quicksheet/mirrorText',
  'qowtRoot/commands/quicksheet/injectCellRef',
  'qowtRoot/commands/quicksheet/injectCellRange',
  'qowtRoot/commands/quicksheet/setCellBoldnessOptimistically',
  'qowtRoot/commands/quicksheet/setCellItalicsOptimistically',
  'qowtRoot/commands/quicksheet/setCellUnderlineOptimistically',
  'qowtRoot/commands/quicksheet/setCellFontFaceOptimistically',
  'qowtRoot/commands/quicksheet/setCellFontSizeOptimistically',
  'qowtRoot/commands/quicksheet/setCellTextColorOptimistically',
  'qowtRoot/commands/quicksheet/setCellBackgroundColorOptimistically',
  'qowtRoot/commands/quicksheet/setCellVerticalAlignmentOptimistically',
  'qowtRoot/commands/quicksheet/setCellHorizontalAlignmentOptimistically',
  'qowtRoot/commands/quicksheet/setCellStrikethroughOptimistically',
  'qowtRoot/commands/quicksheet/setCellWrapTextOptimistically',
  'qowtRoot/widgets/grid/sysClipboard'
  ], function(
    PubSub,
    SheetModel,
    CommandManager,
    MirrorTextCmd,
    InjectCellRefCmd,
    InjectCellRangeCmd,
    SetCellBoldOptimisticallyCmd,
    SetCellItalicOptimisticallyCmd,
    SetCellUnderlineOptimisticallyCmd,
    SetCellFontFaceOptimisticallyCmd,
    SetCellFontSizeOptimisticallyCmd,
    SetCellTextColorOptimisticallyCmd,
    SetCellBackgroundColorOptimisticallyCmd,
    SetCellVerticalAlignmentOptimisticallyCmd,
    SetCellHorizontalAlignmentOptimisticallyCmd,
    SetCellStrikethroughOptimisticallyCmd,
    SetCellWrapTextOptimisticallyCmd,
    SysClipboard) {

  'use strict';

  var _contentType = 'sheetText';

  var _doActionToken, _qowtDisableToken;
    var _api = {
      /**
       * Initialize the module.
       */
      init: function() {
        if (_doActionToken || _qowtDisableToken) {
          throw new Error('Text Editor Content manager initialized ' +
            'multiple times.');
        }
        _doActionToken = PubSub.subscribe('qowt:doAction', _handleAction);
        _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
      },
      /**
       * disable TextEditorContentManager defaults and cleans up all resources.
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
        case 'mirrorText':
          _handleMirrorTextAction();
          break;
        case 'injectCellRef':
          _handleInjectCellRefAction(eventData.context);
          break;
        case 'injectCellRange':
          _handleInjectCellRangeAction(eventData.context);
          break;
        case 'bold':
        case 'italic':
        case 'underline':
        case 'strikethrough':
        case 'fontFace':
        case 'fontSize':
        case 'textColor':
        case 'backgroundColor':
        case 'cellVAlignTop':
        case 'cellVAlignCenter':
        case 'cellVAlignBottom':
        case 'cellHAlignLeft':
        case 'cellHAlignCenter':
        case 'cellHAlignRight':
        case 'wrapText':
          _formatFloatingEditor(eventData.action, eventData.context);
          break;
        case 'cut':
          _handleCutAction();
          break;
        case 'copy':
          _handleCopyAction();
          break;
        case 'paste':
          _handlePasteAction();
          break;
        default:
          break;
      }
    }
  }

  /**
   * Handle a mirror text action by creating a MirrorText command
   */
  function _handleMirrorTextAction() {
    CommandManager.addCommand(MirrorTextCmd.create());
  }

  /**
   * Handle an inject cell ref action by creating an InjectCellRef command
   */
  function _handleInjectCellRefAction(actionContext) {
    CommandManager.
      addCommand(InjectCellRefCmd.create(actionContext.triggerEvent));
  }

  /**
   * Handle an inject cell range action by creating an InjectCellRange command
   */
  function _handleInjectCellRangeAction(actionContext) {
    CommandManager.
      addCommand(InjectCellRangeCmd.create(actionContext.triggerEvent));
  }

  /**
   * Handle an action to format the cell by creating the appropriate
   * formatting command - for example, SetCellBoldnessOptimistically,
   * SetCellBackgroundColorOptimistically or
   * SetCellVerticalAlignmentOptimistically
   *
   * @param action {string} The name of the formatting action - e.g. "bold"
   * @param actionContext {object} The action context containing:
   * - context {object} Action-specific context data
   */
  function _formatFloatingEditor(action, actionContext) {
    // Sheet does not generate multiple `qowt:selectionChanged` signals when you
    // repeatedly format a cell without moving the cell cursor, unlike Word.
    // So every time we format a cell we send a signal so the formatting toolbar
    // buttons can update correctly.
    PubSub.publish('qowt:formattingChanged', {
      'action': action,
      'context': actionContext
    });
    var cmd;
    var key = (actionContext && actionContext.formatting) ?
            Object.keys(actionContext.formatting)[0] : undefined;
    var set = (key) ? actionContext.formatting[key] : undefined;

    switch (action) {
      case "bold":
        cmd = SetCellBoldOptimisticallyCmd.create(set);
        SheetModel.inlineFormatEdits.bold = true;
        break;
      case "italic":
        cmd = SetCellItalicOptimisticallyCmd.create(set);
        SheetModel.inlineFormatEdits.italic = true;
        break;
      case "underline":
        cmd = SetCellUnderlineOptimisticallyCmd.create(set);
        SheetModel.inlineFormatEdits.underline = true;
        break;
      case 'strikethrough':
        cmd = SetCellStrikethroughOptimisticallyCmd.create(set);
        SheetModel.inlineFormatEdits.strikethrough = true;
        break;
      case "fontFace":
        cmd = SetCellFontFaceOptimisticallyCmd.create(
            actionContext.formatting.font);
        SheetModel.inlineFormatEdits.fontFace = true;
        break;
      case "fontSize":
        cmd = SetCellFontSizeOptimisticallyCmd.create(
            actionContext.formatting.siz);
        SheetModel.inlineFormatEdits.fontSize = true;
        break;
      case "textColor":
        cmd = SetCellTextColorOptimisticallyCmd.create(
            actionContext.formatting.clr);
        SheetModel.inlineFormatEdits.textColor = true;
        break;
      case "backgroundColor":
        var backgroundColor = actionContext.formatting.bg;
        cmd = SetCellBackgroundColorOptimisticallyCmd.create(backgroundColor);
        SheetModel.inlineFormatEdits.backgroundColor = true;
        break;
      case "cellVAlignTop":
        cmd = SetCellVerticalAlignmentOptimisticallyCmd.create("t");
        SheetModel.inlineFormatEdits.verticalAlignment = true;
        break;
      case "cellVAlignCenter":
        cmd = SetCellVerticalAlignmentOptimisticallyCmd.create("c");
        SheetModel.inlineFormatEdits.verticalAlignment = true;
        break;
      case "cellVAlignBottom":
        cmd = SetCellVerticalAlignmentOptimisticallyCmd.create("b");
        SheetModel.inlineFormatEdits.verticalAlignment = true;
        break;
      case "cellHAlignLeft":
        cmd = SetCellHorizontalAlignmentOptimisticallyCmd.create("l");
        SheetModel.inlineFormatEdits.horizontalAlignment = true;
        break;
      case "cellHAlignCenter":
        cmd = SetCellHorizontalAlignmentOptimisticallyCmd.create("c");
        SheetModel.inlineFormatEdits.horizontalAlignment = true;
        break;
      case "cellHAlignRight":
        cmd = SetCellHorizontalAlignmentOptimisticallyCmd.create("r");
        SheetModel.inlineFormatEdits.horizontalAlignment = true;
        break;
      case "wrapText":
        cmd = SetCellWrapTextOptimisticallyCmd.create(set);
        SheetModel.inlineFormatEdits.wrapText = true;
        break;
      default:
        break;
    }
    CommandManager.addCommand(cmd);
  }

  /**
   * Handle a cut action by cutting any currently
   * selected text to the system clipboard
   */
  function _handleCutAction() {
    SysClipboard.cutText();
  }

  /**
   * Handle a copy action by copying any currently
   * selected text to the system clipboard
   */
  function _handleCopyAction() {
    SysClipboard.copyText();
  }

  /**
   * Handle a paste action by pasting the text that is currently
   * on the system clipboard into the active text widget
   * (either the formula bar or the floating editor)
   */
  function _handlePasteAction() {
    SysClipboard.paste();
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
