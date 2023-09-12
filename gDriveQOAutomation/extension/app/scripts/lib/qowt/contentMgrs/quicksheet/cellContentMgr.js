/**
 * Constructor for the Cell Content Manager.
 * Operations that affect a cell are serviced through this manager.
 *
 * @constructor
 * @return {Object} A cell content manager
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/widgets/grid/widgetAccessor',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/contentMgrs/quicksheet/contentMgrHelper/mergeCellHandler',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/quicksheet/moveCellSelectionUp',
  'qowtRoot/commands/quicksheet/moveCellSelectionDown',
  'qowtRoot/commands/quicksheet/moveCellSelectionLeft',
  'qowtRoot/commands/quicksheet/moveCellSelectionRight',
  'qowtRoot/commands/quicksheet/moveCellSelectionToClickPos',
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionUp',
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionDown',
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionLeft',
  'qowtRoot/commands/quicksheet/moveCellRangeSelectionRight',
  'qowtRoot/commands/quicksheet/sortCellRange',
  'qowtRoot/commands/quicksheet/setCellContent',
  'qowtRoot/commands/quicksheet/completeCellEdit',
  'qowtRoot/commands/quicksheet/setCellBoldness',
  'qowtRoot/commands/quicksheet/setCellBorder',
  'qowtRoot/commands/quicksheet/setCellItalics',
  'qowtRoot/commands/quicksheet/setCellUnderline',
  'qowtRoot/commands/quicksheet/setCellFontFace',
  'qowtRoot/commands/quicksheet/setCellFontSize',
  'qowtRoot/commands/quicksheet/setCellTextColor',
  'qowtRoot/commands/quicksheet/setCellBackgroundColor',
  'qowtRoot/commands/quicksheet/setCellVerticalAlignment',
  'qowtRoot/commands/quicksheet/setCellHorizontalAlignment',
  'qowtRoot/commands/quicksheet/setCellNumberFormat',
  'qowtRoot/commands/quicksheet/copyCellRange',
  'qowtRoot/commands/quicksheet/cutCellRange',
  'qowtRoot/commands/quicksheet/pasteCellRange',
  'qowtRoot/commands/quicksheet/cancelCutCellRange',
  'qowtRoot/commands/quicksheet/setCellStrikethrough',
  'qowtRoot/commands/quicksheet/setCellWrapText',
  'qowtRoot/contentMgrs/quicksheet/actionValidators/borderActionValidator',
  'qowtRoot/errors/qowtError',
  'qowtRoot/widgets/grid/sysClipboard'
  ], function(
    PubSub,
    SheetModel,
    SheetSelectionManager,
    PaneManager,
    WidgetAccessor,
    Converter,
    MergeCellHandler,
    CommandManager,
    CommandBase,
    MoveSelectionUpCmd,
    MoveSelectionDownCmd,
    MoveSelectionLeftCmd,
    MoveSelectionRightCmd,
    MoveSelectionToClickPosCmd,
    MoveRangeSelectionUpCmd,
    MoveRangeSelectionDownCmd,
    MoveRangeSelectionLeftCmd,
    MoveRangeSelectionRightCmd,
    SortCellRangeCmd,
    SetCellContentCmd,
    CompleteCellEditCmd,
    SetCellBoldCmd,
    SetCellBorderCmd,
    SetCellItalicCmd,
    SetCellUnderlineCmd,
    SetCellFontFaceCmd,
    SetCellFontSizeCmd,
    SetCellTextColorCmd,
    SetCellBackgroundColorCmd,
    SetCellVerticalAlignmentCmd,
    SetCellHorizontalAlignmentCmd,
    SetCellNumberFormatCmd,
    CopyCellRangeCmd,
    CutCellRangeCmd,
    PasteCellRangeCmd,
    CancelCutCellRangeCmd,
    SetCellStrikethroughCmd,
    SetCellWrapTextCmd,
    BorderActionValidator,
    QOWTError,
    SysClipboard) {

  'use strict';

  var _contentType = 'sheetCell',

  _KNoneColor = "NONE",

  _kTabKeyCode = 9,
  _kEnterKeyCode = 13;

  var _doActionToken, _qowtDisableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_doActionToken || _qowtDisableToken) {
        throw new Error('Cell Content manager initialized ' +
          'multiple times.');
      }
      _doActionToken = PubSub.subscribe('qowt:doAction', _handleAction);
      _qowtDisableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },
    /**
     * Disable CellContentManager defaults and cleans up all resources.
     * Note init() must be called after reset so the module is ready for use.
     */
    disable: function() {
      _disable();
    }
  };

  function _handleAction(event, eventData) {
    event = event || '';
    if (eventData.context &&
        eventData.context.contentType &&
        eventData.context.contentType === _contentType) {

      switch(eventData.action) {
        case 'moveSelectionUp':
          _handleMoveSelectionUpAction(eventData.byBlock);
          break;
        case 'moveSelectionDown':
          _handleMoveSelectionDownAction(eventData.byBlock);
          break;
        case 'moveSelectionLeft':
          _handleMoveSelectionLeftAction(eventData.byBlock);
          break;
        case 'moveSelectionRight':
          _handleMoveSelectionRightAction(eventData.byBlock);
          break;
        case 'moveRangeSelectionUp':
          _handleMoveRangeSelectionUpAction();
          break;
        case 'moveRangeSelectionDown':
          _handleMoveRangeSelectionDownAction();
          break;
        case 'moveRangeSelectionLeft':
          _handleMoveRangeSelectionLeftAction();
          break;
        case 'moveRangeSelectionRight':
          _handleMoveRangeSelectionRightAction();
          break;
        case 'sortCellRange':
          _handleSortCellRangeAction(eventData.context);
          break;
        case 'copy':
          _handleCopyAction(eventData.context);
          break;
        case 'cut':
          _handleCutAction(eventData.context);
          break;
        case 'paste':
          _handlePasteAction(eventData.context);
          break;
        case 'commitCellEdit':
          _handleCommitCellEditAction(eventData.context);
          break;
        case 'cancelCellEdit':
          _handleCancelCellEditAction();
          break;
        case 'cancelCut':
          _handleCancelCutAction();
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
        case 'numberFormat':
        case 'wrapText':
        case 'border_all':
        case 'border_inner':
        case 'border_horizontal':
        case 'border_vertical':
        case 'border_outer':
        case 'border_left':
        case 'border_top':
        case 'border_right':
        case 'border_bottom':
        case 'border_none':
          _formatCells(eventData.action, eventData.context);
          break;
        case 'mergeAll':
        case 'mergeVertically':
        case 'mergeHorizontally':
        case 'unmerge':
          _handleMergeCellAction(eventData);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Handle a move selection up action by creating a MoveCellSelectionUp command
   *
   * @param {boolean} byBlock - if true the new selection will be determined
   *                            by the closest block of populated cells in the
   *                            'up' direction. if false the new selection
   *                            will be one row up from the current selection.
   */
  function _handleMoveSelectionUpAction(byBlock) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveSelectionUpCmd.create(byBlock));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move selection down action by creating a MoveCellSelectionDown
   * command
   *
   * @param {boolean} byBlock - if true the new selection will be determined
   *                            by the closest block of populated cells in the
   *                            'down' direction. if false the new selection
   *                            will be one row down from the current selection.
   */
  function _handleMoveSelectionDownAction(byBlock) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveSelectionDownCmd.create(byBlock));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move selection left action by creating a MoveCellSelectionLeft
   * command
   *
   * @param {boolean} byBlock - if true the new selection will be determined by
   *                            the closest block of populated cells in the
   *                            'left' direction. if false the new selection
   *                            will be one column left from the current
   *                            selection.
   */
  function _handleMoveSelectionLeftAction(byBlock) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveSelectionLeftCmd.create(byBlock));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move selection right action by creating a MoveCellSelectionRight
   * command
   *
   * @param {boolean} byBlock - if true the new selection will be determined by
   *                            the closest block of populated cells in the
   *                            'right' direction. if false the new selection
   *                            will be one column right from the current
   *                            selection.
   */
  function _handleMoveSelectionRightAction(byBlock) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveSelectionRightCmd.create(byBlock));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move range selection up action by creating a
   * MoveCellRangeSelectionUp command
   */
  function _handleMoveRangeSelectionUpAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveRangeSelectionUpCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move range selection down action by creating a
   * MoveCellRangeSelectionDown command
   */
  function _handleMoveRangeSelectionDownAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveRangeSelectionDownCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move range selection left action by creating a
   * MoveCellRangeSelectionLeft command
   */
  function _handleMoveRangeSelectionLeftAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveRangeSelectionLeftCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a move range selection right action by creating a
   * MoveCellRangeSelectionRight command
   */
  function _handleMoveRangeSelectionRightAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(MoveRangeSelectionRightCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a sort cell range action by creating a SortCellRange command
   *
   * @param actionContext {object} action context containing:
   * - ascending {boolean} Flag indicating whether the sort is to be ascending
   *                 or descending; true for ascending, otherwise false
   */
  function _handleSortCellRangeAction(actionContext) {

    // JELTE TODO: the getCurrentSelection should always return something
    // so that we do not have to do needless checks for undefined here

    // JELTE TODO: and we should just have selection objects, which have
    // functions like isSingleCell etc, but that should be done when integrating
    // the new generic selection manager (which should be extendible for
    // each app). In short this nested if block needs cleaning up!

    var rangeSelection = SheetSelectionManager.getCurrentSelection();
    if (rangeSelection === undefined ||
        rangeSelection.topLeft === undefined ||
        rangeSelection.bottomRight === undefined) {
      throw new QOWTError({
          title: 'sheet_sort_error_title',
          details: 'sheet_sort_error',
          message: 'sort command failed: no selection'
      });
    }

    var topLeft = rangeSelection.topLeft;
    var bottomRight = rangeSelection.bottomRight;

    if (topLeft.rowIdx === bottomRight.rowIdx &&
        topLeft.colIdx === bottomRight.colIdx) {
      throw new QOWTError({
          title: 'sheet_sort_one_cell_error_title',
          details: 'sheet_sort_one_cell_error'
      });
    }

    var floaterMgr = PaneManager.getMainPane().getFloaterManager();

    // JELTE TODO: should be able to pass in the selection range, rather
    // than each coordinate
    if (floaterMgr.hasAreaMergedCells(topLeft.rowIdx, topLeft.colIdx,
       bottomRight.rowIdx, bottomRight.colIdx)) {
      throw new QOWTError({
          title: 'sheet_sort_merged_cell_error_title',
          details: 'sheet_sort_merged_cell_error'
      });
    } else {
      // execute the actual command
      var sortCmd = SortCellRangeCmd.create(rangeSelection,
          actionContext.ascending);
      CommandManager.addCommand(sortCmd);
    }
  }

  /**
   * Handle a copy action by creating a CopyCellRangeCmd command
   */
  function _handleCopyAction() {
    // Cancelling cut action if any performed before copy action. This is
    // needed to unhighlight the cell, which was highlighted after cut action
    // and is no longer relevant after copy action.
    _handleCancelCutAction();
      var rangeSelection = SheetSelectionManager.getCurrentSelection();

      // execute the actual command
      var containingCmd = CommandBase.create();
      containingCmd.addChild(CopyCellRangeCmd.create(rangeSelection));
      CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a cut action by creating a CutCellRangeCmd command
   */
  function _handleCutAction() {
      var rangeSelection = SheetSelectionManager.getCurrentSelection();
      // execute the actual command
      var containingCmd = CommandBase.create();
      containingCmd.addChild(CutCellRangeCmd.create(rangeSelection));
      CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a Paste action by creating PasteCellRange command
   */
  function _handlePasteAction() {
      var selection = SheetSelectionManager.getCurrentSelection();
      var containingCmd = CommandBase.create();

      if(SysClipboard.containsCellContent()) {
        // the last copy/cut by the user was on cells in Quicksheet
        // (which would have been serviced by a CopyCellRangeCmd
        // or CutCellRangeCmd), so use a PasteCellRange command
        containingCmd.addChild(PasteCellRangeCmd.create(selection));
        CommandManager.addCommand(containingCmd);
      }
      else {
        // otherwise, simply extract the current textual content of
        // the system clipboard and use it in a SetCellContent command
        var text = SysClipboard.getContents();
        if(text) {
          containingCmd.addChild(SetCellContentCmd.create(
            selection.topLeft.colIdx,
            selection.topLeft.rowIdx,
            selection.bottomRight.colIdx,
            selection.bottomRight.rowIdx,
            text));
          CommandManager.addCommand(containingCmd);
        }
      }
  }

  /**
   * Handle a commit cell edit action by creating a command with the following
   * child commands:
   * - SetCellContent
   * - Zero or more of the SetCell formatting commands
   * - One of the MoveCellSelection commands
   * - CompleteCellEdit
   *
   * @param actionContext {object} action context containing:
   * - cellText {string} The text to commit for the cell
   * - fromRowIndex {integer} The index of the row of the upper-left cell
   *                          which is to have its contents changed
   * - fromColIndex {integer} The index of the column of the upper-left cell
   *                          which is to have its contents changed
   * - toRowIndex {integer} The index of the row of the lower-right cell
   *                        which is to have its contents changed
   * - toColIndex {integer} The index of the column of the lower-right cell
   *                        which is to have its contents changed
   * - commitEvent {HTML event} The HTML event that signalled the user wanted to
   *                            commit the edit
   * - textWidget {object} The text widget whose formatting is to be applied to
   *                       the target cell
   */
  function _handleCommitCellEditAction(actionContext) {
    var clickObj, containingCmd = CommandBase.create();

    // create a SetCellContent command
    containingCmd.addChild(SetCellContentCmd.create(actionContext.fromColIndex,
        actionContext.fromRowIndex, actionContext.toColIndex,
        actionContext.toRowIndex, actionContext.cellText));

    // create the necessary SetCell formatting commands
    _addCellFormattingCommands(containingCmd, actionContext.fromColIndex,
      actionContext.fromRowIndex, actionContext.textWidget);

    if(actionContext && actionContext.commitEvent) {
      // create the appropriate MoveCellSelection command
      var altModifier = actionContext.commitEvent.altKey;
      var controlModifier = actionContext.commitEvent.ctrlKey;
      var shiftModifier = actionContext.commitEvent.shiftKey;
      var metaModifier = actionContext.commitEvent.metaKey;
      var shiftOnly =
        (shiftModifier && !altModifier && !controlModifier && !metaModifier);
      var noModifiers =
        (!shiftModifier && !altModifier && !controlModifier && !metaModifier);

      if(actionContext.commitEvent.type === "keyup") { // key event
        switch(actionContext.commitEvent.keyCode) {
          case _kEnterKeyCode:
            if (noModifiers) {
              containingCmd.addChild(MoveSelectionDownCmd.create());
            }
            else if (shiftOnly) {
              containingCmd.addChild(MoveSelectionUpCmd.create());
            }
            break;
          case _kTabKeyCode:
            if (noModifiers) {
              containingCmd.addChild(MoveSelectionRightCmd.create());
            }
            else if (shiftOnly) {
              containingCmd.addChild(MoveSelectionLeftCmd.create());
            }
            break;
          default:
            break;
        }
      } else if(actionContext.commitEvent.type === 'mousedown') { // mouse
        var paneArea = document.getElementById("qowt-sheet-container-panes");
        // inside grid
        if(paneArea && paneArea.contains(actionContext.commitEvent.target)) {
            containingCmd.addChild(MoveSelectionToClickPosCmd.
              create(actionContext.commitEvent));
        } else { // outside grid, eg. toolbar or sheet selector
          clickObj = actionContext.commitEvent.target;
        }
      }
    }
    // If no commit event is passed we default to move the selection down.
    // Handle when a user clicks on a suggestion in the autocomplete menu.
    else if (actionContext.commitEvent === undefined) {
      containingCmd.addChild(MoveSelectionDownCmd.create());
    }

    containingCmd.addChild(CompleteCellEditCmd.create(false, clickObj));

    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a cancel cell edit action by creating a CompleteCellEdit command
   */
  function _handleCancelCellEditAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(CompleteCellEditCmd.create(true));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Handle a cancel cut  action by creating a CancelCut command
   */
  function _handleCancelCutAction() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(CancelCutCellRangeCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Convert a color to hex string and remove the leading hash '#' character,
   * as the DCP expects.
   *
   * @param {string} color The rgb or hex string representation of a color,
   *                 or "NONE" for auto text color and no background color.
   */
  function _convertColorForDcp(color) {
    if (color !== _KNoneColor) {
      color = Converter.colorString2hex(color).substr(1);
    }
    return color;
  }

  /**
   * Handle an action to format a cell by creating the appropriate formatting
   * command - for example, SetCellBoldness, SetCellBackgroundColor or
   * SetCellVerticalAlignment
   *
   * @param action {string} The name of the formatting action - e.g. "bold"
   * @param actionContext {object} The action context containing:
   * - fromRowIndex {integer} The top left row index of the selected cell range
   * - fromColIndex {integer} The top left column index of the selected cell
   *                          range
   * - toRowIndex {integer} The bottom right row index of the selected cell
   *                        range
   * - toColIndex {integer} The bottom right column index of the selected cell
   *                        range
   * - anchor {object} The anchor cell of the selected cell range
   * - context {object} Any action-specific context data
   */
  function _formatCells(action, actionContext) {
    // Sheet does not generate multiple `qowt:selectionChanged` signals when you
    // repeatedly format a cell without moving the cell cursor, unlike Word.
    // So every time we format a cell we send a signal so the formatting toolbar
    // buttons can update correctly.
    PubSub.publish('qowt:formattingChanged', {
      'action': action,
      'context': actionContext
    });
    var config = {}, toggleOn;
    config.anchor = actionContext.anchor;
    config.newSelection = {};
    config.newSelection.topLeft = {};
    config.newSelection.topLeft.rowIdx = actionContext.fromRowIndex;
    config.newSelection.topLeft.colIdx = actionContext.fromColIndex;
    config.newSelection.bottomRight = {};
    config.newSelection.bottomRight.rowIdx = actionContext.toRowIndex;
    config.newSelection.bottomRight.colIdx = actionContext.toColIndex;
    var widgetAccessor = WidgetAccessor.create(config);
    var containingCmd = CommandBase.create();
    switch (action) {
      case "bold":
        toggleOn = widgetAccessor.hasBold() ? false : true;
        _addSetCellBoldCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          toggleOn);
        break;
      case "italic":
        toggleOn = widgetAccessor.hasItalic() ? false : true;
        _addSetCellItalicCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          toggleOn);
        break;
      case "underline":
        toggleOn = widgetAccessor.hasUnderline() ? false : true;
        _addSetCellUnderlineCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          toggleOn);
        break;
      case 'strikethrough':
        toggleOn = !widgetAccessor.hasStrikethrough();
        _addSetCellStrikethroughCmd(containingCmd, actionContext.fromColIndex,
            actionContext.fromRowIndex, actionContext.toColIndex,
            actionContext.toRowIndex, toggleOn);
        break;
      case "fontFace":
        _addSetCellFontFaceCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          actionContext.formatting.font);
        break;
      case "fontSize":
        _addSetCellFontSizeCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          actionContext.formatting.siz);
        break;
      case "cellHAlignLeft":
        _addSetCellHorizontalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "l");
        break;
      case "cellHAlignCenter":
        _addSetCellHorizontalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "c");
        break;
      case "cellHAlignRight":
        _addSetCellHorizontalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "r");
        break;
      case "cellVAlignTop":
        _addSetCellVerticalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "t");
        break;
      case "cellVAlignCenter":
        _addSetCellVerticalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "c");
        break;
      case "cellVAlignBottom":
        _addSetCellVerticalAlignmentCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          "b");
        break;
      case "textColor":
        _addSetCellTextColorCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          actionContext.formatting.clr);
        break;
      case "backgroundColor":
        _addSetCellBackgroundColorCmd(containingCmd,
          actionContext.fromColIndex, actionContext.fromRowIndex,
          actionContext.toColIndex, actionContext.toRowIndex,
          actionContext.formatting.bg);
        break;
      case "numberFormat":
        _addSetCellNumberFormatCmd(containingCmd,
            actionContext.fromColIndex, actionContext.fromRowIndex,
            actionContext.toColIndex, actionContext.toRowIndex,
            actionContext.value);
        break;
      case "wrapText":
        toggleOn = !widgetAccessor.hasWrapText();
        _addSetCellWrapTextCmd(containingCmd,
            actionContext.fromColIndex, actionContext.fromRowIndex,
            actionContext.toColIndex, actionContext.toRowIndex,
            toggleOn);
        break;
      case 'border_all':
      case 'border_inner':
      case 'border_horizontal':
      case 'border_vertical':
      case 'border_outer':
      case 'border_left':
      case 'border_top':
      case 'border_right':
      case 'border_bottom':
      case 'border_none':
        if (BorderActionValidator.isValidAction(actionContext)) {
          _addSetCellBorderCmd(containingCmd, actionContext.fromColIndex,
            actionContext.fromRowIndex, actionContext.toColIndex,
            actionContext.toRowIndex, actionContext.formatting.borders);
        }
        break;
      default:
        break;
    }
    CommandManager.addCommand(containingCmd);
  }

  function _handleMergeCellAction(eventData){
    MergeCellHandler.handleMergeCellAction(eventData);
  }

  /**
   * Add the necessary formatting commands to the given parent command,
   * based on which formatting styles have been edited inline.
   *
   * @param containingCmd {object} The parent command to add formatting commands
   *                               to
   * @param colIndex {integer} The column index of the target cell
   * @param rowIndex {integer} The row index of the target cell
   * @param textWidget {object} The text widget to take formatting styles from
   */
  function _addCellFormattingCommands(containingCmd, colIndex, rowIndex,
                                      textWidget) {
    if(SheetModel.inlineFormatEdits &&
      (Object.keys(SheetModel.inlineFormatEdits).length > 0))
    {
      // There is at least one formatting style that has been edited inline -
      // for each one that has been edited we need to set the target cell to
      // reflect it

      var config = {};
      config.anchor = {rowIdx: rowIndex, colIdx: colIndex};

      if(SheetModel.inlineFormatEdits.bold) {
        _addSetCellBoldCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textWidget.hasBold());
      }

      if(SheetModel.inlineFormatEdits.italic) {
        _addSetCellItalicCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textWidget.hasItalic());
      }

      if(SheetModel.inlineFormatEdits.underline) {
        _addSetCellUnderlineCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textWidget.hasUnderline());
      }

      if(SheetModel.inlineFormatEdits.strikethrough) {
        _addSetCellStrikethroughCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textWidget.hasStrikethrough());
      }

      var textFontFace = textWidget.getFontFace();
      if(SheetModel.inlineFormatEdits.fontFace && textFontFace) {
        _addSetCellFontFaceCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textFontFace);
      }

      var textFontSize = textWidget.getFontSizePoints();
      if(SheetModel.inlineFormatEdits.fontSize && textFontSize) {
        _addSetCellFontSizeCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textFontSize);
      }

      var textTextColor = textWidget.getTextColor();
      if(SheetModel.inlineFormatEdits.textColor && textTextColor) {
        _addSetCellTextColorCmd(containingCmd, colIndex, rowIndex, colIndex,
          rowIndex, textTextColor);
      }

      var textBackgroundColor = textWidget.getBackgroundColor();
      if(SheetModel.inlineFormatEdits.backgroundColor && textBackgroundColor) {
        _addSetCellBackgroundColorCmd(containingCmd, colIndex, rowIndex,
            colIndex, rowIndex, textBackgroundColor);
      }

      var textVerticalAlignment = textWidget.getVerticalAlignment();
      if(SheetModel.inlineFormatEdits.verticalAlignment &&
        textVerticalAlignment) {
        _addSetCellVerticalAlignmentCmd(containingCmd, colIndex, rowIndex,
          colIndex, rowIndex, textVerticalAlignment);
      }

      var textHorizontalAlignment = textWidget.getHorizontalAlignment();
      if(SheetModel.inlineFormatEdits.horizontalAlignment &&
        textHorizontalAlignment) {
        _addSetCellHorizontalAlignmentCmd(containingCmd, colIndex, rowIndex,
          colIndex, rowIndex, textHorizontalAlignment);
      }

      if (SheetModel.inlineFormatEdits.wrapText) {
        _addSetCellWrapTextCmd(containingCmd, colIndex, rowIndex, colIndex,
            rowIndex, textWidget.hasWrapText());
      }
    }
  }

  function _addSetCellBoldCmd(containingCmd, fromColIndex, fromRowIndex,
                              toColIndex, toRowIndex, boldness) {
    containingCmd.addChild(SetCellBoldCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, boldness));
  }

  function _addSetCellItalicCmd(containingCmd, fromColIndex, fromRowIndex,
                                toColIndex, toRowIndex, italics) {
    containingCmd.addChild(SetCellItalicCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, italics));
  }

  function _addSetCellUnderlineCmd(containingCmd, fromColIndex, fromRowIndex,
                                   toColIndex, toRowIndex, underline) {
    containingCmd.addChild(SetCellUnderlineCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, underline));
  }

  function _addSetCellStrikethroughCmd(containingCmd, fromColIndex,
                                       fromRowIndex, toColIndex, toRowIndex,
                                       isStrikethrough) {
    containingCmd.addChild(SetCellStrikethroughCmd.create(
        fromColIndex, fromRowIndex, toColIndex, toRowIndex, isStrikethrough));
  }

  function _addSetCellFontFaceCmd(containingCmd, fromColIndex, fromRowIndex,
                                  toColIndex, toRowIndex, fontFace) {
    containingCmd.addChild(SetCellFontFaceCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, fontFace));
  }

  function _addSetCellFontSizeCmd(containingCmd, fromColIndex, fromRowIndex,
                                  toColIndex, toRowIndex, fontSize) {
    containingCmd.addChild(SetCellFontSizeCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, fontSize));
  }

  function _addSetCellTextColorCmd(containingCmd, fromColIndex, fromRowIndex,
                                   toColIndex, toRowIndex, textColor) {
    var convertedTextColor = _convertColorForDcp(textColor);
    containingCmd.addChild(SetCellTextColorCmd.
      create(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
      convertedTextColor));
  }

  function _addSetCellBackgroundColorCmd(containingCmd, fromColIndex,
                                         fromRowIndex, toColIndex, toRowIndex,
                                         backgroundColor) {
    var convertedBackgroundColor = _convertColorForDcp(backgroundColor);
    containingCmd.addChild(SetCellBackgroundColorCmd.
      create(fromColIndex, fromRowIndex, toColIndex, toRowIndex,
      convertedBackgroundColor));
  }

  function _addSetCellVerticalAlignmentCmd(containingCmd, fromColIndex,
                                           fromRowIndex, toColIndex, toRowIndex,
                                           alignPos) {
    containingCmd.addChild(SetCellVerticalAlignmentCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, alignPos));
  }

  function _addSetCellHorizontalAlignmentCmd(containingCmd, fromColIndex,
                                             fromRowIndex, toColIndex,
                                             toRowIndex, alignPos) {
    containingCmd.addChild(SetCellHorizontalAlignmentCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, alignPos));
  }

  function _addSetCellNumberFormatCmd(containingCmd, fromColIndex, fromRowIndex,
                                      toColIndex, toRowIndex, numberFormat) {
    containingCmd.addChild(SetCellNumberFormatCmd.create(
            fromColIndex, fromRowIndex, toColIndex, toRowIndex, numberFormat));
  }

  function _addSetCellWrapTextCmd(containingCmd, fromColIndex, fromRowIndex,
                                  toColIndex, toRowIndex, wrapText) {
    containingCmd.addChild(SetCellWrapTextCmd.create(
        fromColIndex, fromRowIndex, toColIndex, toRowIndex, wrapText));
  }

  function _addSetCellBorderCmd(containingCmd, fromColIndex, fromRowIndex,
                                  toColIndex, toRowIndex, borderInfo) {
    containingCmd.addChild(SetCellBorderCmd.create(
      fromColIndex, fromRowIndex, toColIndex, toRowIndex, borderInfo));
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
