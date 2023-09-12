define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/commands/quicksheet/setMergeCell',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/sheetSelection/selectionUtils',
  'qowtRoot/widgets/ui/modalDialog'
], function(
    CommandManager,
    CommandBase,
    PaneManager,
    SetMergeCellCmd,
    PubSub,
    I18n,
    SheetSelectionUtils,
    ModalDialog) {

  'use strict';

  var kContentType_ = 'sheetCell';
  var kMergeDialog_ = 'qowt-merge-dialog';
  var kFloaterType_ = 'sheetFloaterMergeCell';
  var kDialogTitleMsg_ = I18n.getMessage('title_error_msg_for_merge_cells');
  var kPartialSelectionMsg_ =
      I18n.getMessage('content_msg_merging_partially_selected_merged_cells');
  var confirmDlg_;

  var api_ = {

    handleMergeCellAction: function(eventData) {
      // If selection is not a range then return.
      // TODO(umesh.kadam): This check is not needed since the operation
      // should not be possible on a non-range selection. Merge operation in
      // menu bar should be disabled and this check should be removed.
      if (!SheetSelectionUtils.isSelectionARange()) {
        return;
      }

      if (eventData) {
        var eventAction = eventData.action;
        var eventContext = eventData.context;
        if (eventContext && eventContext.contentType === kContentType_) {
          switch (eventAction) {
            case 'mergeAll':
              handleMergeAll_(eventAction, eventContext);
              break;
            case 'mergeVertically':
              handleVerticalMerge_(eventAction, eventContext);
              break;
            case 'mergeHorizontally':
              handleHorizontalMerge_(eventAction, eventContext);
              break;
            case 'unmerge':
              handleUnmerge_(eventAction, eventContext);
              break;
            default:
              break;
          }
        }
      }
    },

    isConfirmDlgShowing: function() {
      return confirmDlg_ && confirmDlg_.isShowing();
    },

    /**
     * Closing confirm dialog instance with invoking desired button action.
     * @param {string} buttonOption - This can be one of the following-
     *     1. "affirmative" for "OK" button and
     *     2. "negative" for "Cancel" button.
     */
    closeConfirmDialog: function(buttonOption) {
      confirmDlg_ && confirmDlg_.close(buttonOption);
    }
  };


  /**
   * Handles mergeAll action.
   * - If the selection is partial, meaning any of the merge cell is partially
   *   selected, then a information dialog with message "cannot merge" is shown
   * - If the selection has multiple cells having text then a confirm dialog is
   *   shown.
   * - Otherwise, it will create command to merge the cells.
   *
   * @param {string} action - mergeAll action
   * @param {object} context - contains from/to row and column indexes.
   * @private
   */
  function handleMergeAll_(action, context) {
    var range = getRangeFromContext_(context);
    if (isPartialSelection_(range)) {
      showInfoDialog_(kDialogTitleMsg_, kPartialSelectionMsg_);
    } else if (rangeHasMultipleCellsWithText_(range)) {
      showCellMergeConfirmDialog_(action, context);
    } else {
      createCommandAndPublishAction_(action, context);
    }
  }


  /**
   * Handles unmerge action for the selection.
   * - If the selection is partial, meaning any of the merge cell is partially
   *   selected, then a information dialog with message "cannot unmerge" is
   *   shown. Otherwise, it will create command to unmerge the selection.
   *
   * @param {string} action - unmerge action
   * @param {object} context - contains from/to row and column indexes.
   * @private
   */
  function handleUnmerge_(action, context) {
    var range = getRangeFromContext_(context);
    if (isPartialSelection_(range)) {
      showInfoDialog_(kDialogTitleMsg_, kPartialSelectionMsg_);
    } else {
      createCommandAndPublishAction_(action, context);
    }
  }


  /**
   * Handles mergeVertically action.
   * - If the selection is partial, meaning any of the merge cell is partially
   *   selected, then a information dialog with message "cannot merge" is shown
   * - If the selection has merged cells and if all are not vertically merged
   *   then, it will show an information dialog for merging vertically across
   *   existing horizontally merged section.'
   * - If the selection has multiple cells having text then a confirm dialog is
   *   shown.
   * - Otherwise, it will create command to merge the cells.
   *
   * @param {string} action - mergeVertically action.
   * @param {object} context - contains from/to row and column indexes.
   * @private
   */
  function handleVerticalMerge_(action, context) {
    // Returns true if more than one rows are selected, false otherwise
    function isVerticalSelection() {
      return range.r2 - range.r1 > 0;
    }

    var range = getRangeFromContext_(context);
    if (isVerticalSelection()) {
      var existingMergeCells = getMergedCellsInRange_(range);
      if (_.isEmpty(existingMergeCells)) {
        confirmActionAndMerge_(range, action, context);
      } else {
        if (isPartialSelection_(range, existingMergeCells)) {
          showInfoDialog_(kDialogTitleMsg_, kPartialSelectionMsg_);
        } else if (!areAllVerticallyMerged_(range, existingMergeCells)) {
          var message = I18n.getMessage(
              'content_msg_merging_vertically_across_horizontal_section');
          showInfoDialog_(kDialogTitleMsg_, message);
        }
      }
    }
  }


  /**
   * Handles mergeHorizontally action.
   * - If the selection is partial, meaning any of the merge cell is partially
   *   selected, then a information dialog with message "cannot merge" is shown
   * - If the selection has merged cells and if all are not horizontally merged
   *   then, it will show an information dialog for merging horizontally across
   *   existing vertically merged section.'
   * - If the selection has multiple cells having text then a confirm dialog is
   *   shown.
   * - Otherwise, it will create command to merge the cells.
   *
   * @param {string} action - mergeHorizontally action.
   * @param {object} context - contains from/to row and column indexes.
   * @private
   */
  function handleHorizontalMerge_(action, context) {
    function isHorizontalSelection() {
      return range.c2 - range.c1 > 0;
    }

    var range = getRangeFromContext_(context);
    if (isHorizontalSelection()) {
      var existingMergeCells = getMergedCellsInRange_(range);
      if (_.isEmpty(existingMergeCells)) {
        confirmActionAndMerge_(range, action, context);
      } else {
        if (isPartialSelection_(range, existingMergeCells)) {
          showInfoDialog_(kDialogTitleMsg_, kPartialSelectionMsg_);
        } else if (!areAllHorizontallyMerged_(range, existingMergeCells)) {
          var errorMsg = I18n.getMessage(
              'content_msg_merging_horizontally_across_vertical_section');
          showInfoDialog_(kDialogTitleMsg_, errorMsg);
        }
      }
    }
  }


  /**
   * Shows confirm dialog if range has multiple cells with text, merges
   * otherwise
   *
   * @param {Object} range - an object defining range i.e. r1, r2, c1, c2
   * @param {String} action - the action to be performed
   * @param {Object} context - associated context for the action
   * @private
   */
  function confirmActionAndMerge_(range, action, context) {
    rangeHasMultipleCellsWithText_(range) ?
        showCellMergeConfirmDialog_(action, context) :
        createCommandAndPublishAction_(action, context);
  }


  /**
   * @param {Object} range - an object defining range i.e. r1, r2, c1, c2
   * @param {Array | undefined} existingMergedCells - existing merged cells
   * @return {boolean} True if any of the existing merged cell is partially
   *                    selected, false otherwise.
   */
  function isPartialSelection_(range, existingMergedCells) {
    var mergedCells = existingMergedCells || getMergedCellsInRange_(range);
    return !_.isEmpty(mergedCells) && mergedCells.some(function(mergeCell) {
      return !mergeCell.isCompletelyInSelection(range.r1, range.c1, range.r2,
          range.c2);
    });
  }


  /**
   * @param {Object} range - an object defining range i.e. r1, r2, c1, c2
   * @param {Array} mergedCells - array of merged cells
   * @return {boolean} True if all the given merged cells are vertically merged,
   *                   false otherwise
   */
  function areAllVerticallyMerged_(range, mergedCells) {
    // TODO(umesh.kadam): consider moving this function to floaterMergeCell.js
    function isVerticallyMerged(cell) {
      var rowSpan = cell.rowSpan();
      var colSpan = cell.colSpan();
      return (colSpan === 1 && rowSpan > 1);
    }

    return !_.isEmpty(mergedCells) && mergedCells.every(function(mergeCell) {
      return mergeCell.isCompletelyInSelection(range.r1, range.c1, range.r2,
          range.c2) && isVerticallyMerged(mergeCell);
    });
  }


  /**
   * @param {Object} range - an object defining range i.e. r1, r2, c1, c2
   * @param {Array} mergedCells - array of existing merged cells in
   *    selection
   * @return {boolean} True if all the give cells are horizontally merged, false
   *                   otherwise
   */
  function areAllHorizontallyMerged_(range, mergedCells) {
    // TODO(umesh.kadam): consider moving this function to floaterMergeCell.js
    function isHorizontallyMerged(cell) {
      var rowSpan = cell.rowSpan();
      var colSpan = cell.colSpan();
      return (rowSpan === 1 && colSpan > 1);
    }

    return !_.isEmpty(mergedCells) && mergedCells.every(function(mergeCell) {
      return mergeCell.isCompletelyInSelection(range.r1, range.c1, range.r2,
          range.c2) && isHorizontallyMerged(mergeCell);
    });
  }


  /**
   * Shows merge dialog with the given title and msg and an optional callback
   * @param {String} title - title for dialog
   * @param {String} msg - message in the dialog
   * @private
   */
  function showInfoDialog_(title, msg) {
    ModalDialog.info(title, msg).addDialogClass(kMergeDialog_);
  }


  /**
   * Shows confirmation modal dialog. When user selects a range which includes
   * multiple cells with text and apply merge action, a modal dialog will be
   * shown to confirm user's action.
   *
   * @param {string} mergeOption - One of the following-
   *    mergeAll, mergeHorizontally, mergeVertically and unmerge.
   * @param {object} context - contains from/to row and column indices.
   * @private
   */
  function showCellMergeConfirmDialog_(mergeOption, context) {
    var title = I18n.getMessage('title_msg_merging_multiple_cells_with_text');
    var message =
        I18n.getMessage('content_msg_merging_multiple_cells_with_text');

    confirmDlg_ = ModalDialog.confirm(title, message, function() {
      createCommandAndPublishAction_(mergeOption, context);
    }).addDialogClass(kMergeDialog_);
  }


  /**
   * @param {Object} range - an object defining range i.e. r1, r2, c1, c2
   * @return {boolean} True if range has more than one cell with text, false
   *                   otherwise
   */
  function rangeHasMultipleCellsWithText_(range) {
    var noOfCellsWithText = 0;
    for (var rowIdx = range.r1; rowIdx <= range.r2; rowIdx++) {
      for (var colIdx = range.c1; colIdx <= range.c2; colIdx++) {
        var row = PaneManager.getMainPane().getRow(rowIdx);
        var cell = row && row.getCell(colIdx);
        if (cell && cell.cellText) {
          ++noOfCellsWithText;
        }
        if (noOfCellsWithText > 1) {
          return true;
        }
      }
    }
    return false;
  }


  /**
   * @param {Object} context - this will have following -
   * @param {number} fromColIndex - The index of the column from where the
   *     cell selection started to be merged/unmerged. fromColIndex must be
   *     less than or equal to toColIndex.
   * @param {number} fromRowIndex - The index of the row from where the cell
   *     selection started to be merged/unmerged. fromRowIndex must be
   *     less than or equal to toRowIndex.
   * @param {number} toColIndex - The index of the column where the cell
   *     selection ended to be merged/unmerged.
   * @param {number} toRowIndex - The index of the row where the cell
   *     selection ended to be merged/unmerged.
   * @param {string} mergeOption - Selected merge option. Merge option could
   *     be one of the following:
   *     1. Merge All
   *     2. Merge horizontally
   *     3. Merge vertically
   *     4. Unmerge
   * @private
   */
  function createCommand_(mergeOption, context) {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(SetMergeCellCmd.create(context.fromRowIndex,
        context.fromColIndex, context.toRowIndex,
        context.toColIndex, mergeOption));
    CommandManager.addCommand(containingCmd);
  }


  /**
   * Creates a command and publishes an action.
   * - Command to send to the core and
   * - Action is published so that the merge button on toolbar changes its
   *    state
   *
   * @param {String} action - the event action
   * @param {Object} context - the action context.
   * @private
   */
  function createCommandAndPublishAction_(action, context) {
    createCommand_(action, context);
    PubSub.publish('qowt:formattingChanged', {
      'action': action,
      'context': context
    });
  }


  /**
   * @param {object} range - contains from/to row and column indices.
   * @return {Array} - existing merged cells in the range
   */
  function getMergedCellsInRange_(range) {
    var floaterMgr = PaneManager.getMainPane().getFloaterManager();
    return PaneManager.isEntireSheetSelected() ?
        floaterMgr.getAllFloaters(kFloaterType_) :
        floaterMgr.getFloatersInRange(range.r1, range.c1, range.r2, range.c2,
            kFloaterType_);
  }


  /**
   * @param {Object} context - the action context
   * @return {Object} an object defining range i.e. r1, r2, c1, c2
   * @private
   */
  function getRangeFromContext_(context) {
    var range = {};
    range.r1 = context.fromRowIndex;
    range.r2 = context.toRowIndex;
    range.c1 = context.fromColIndex;
    range.c2 = context.toColIndex;
    if (_.areUndefined(range.r1, range.r2)) {
      range.r1 = 0;
      range.r2 = PaneManager.getMainPane().getNumOfRows() - 1;
    }
    if (_.areUndefined(range.c1, range.c2)) {
      range.c1 = 0;
      range.c2 = PaneManager.getMainPane().getNumOfCols() - 1;
    }
    return range;
  }

  return api_;
});
