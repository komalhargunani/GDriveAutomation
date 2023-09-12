/**
 * Selection Related Utilities should be populated here.
 *  - A step towards isolating the utilities from selection-gestures.
 *
 *  TODO(umesh.kadam): SelectionGestureHandler is being populated with utility
 *  functions that have nothing to do with selection gesture. Such functions
 *  should be moved from selectionGestureHandler to this file so that
 *  the selectionGestureHandler has only those functions that truly imply
 *  selection gesture.
 */
define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/utils/sheet-lo-dash'
], function(
    PaneManager,
    SheetSelectionManager
    /* sheet-lo-dash */) {

  'use strict';

  var api_ = {
    /**
     * @param {Object | undefined} sel - current selection | undefined
     * @return {boolean} True if the selection is a range, false otherwise
     */
    isSelectionARange: function(sel) {
      var selObj = sel || SheetSelectionManager.getCurrentSelection();
      var isRange = PaneManager.isEntireSheetSelected(selObj) ||
          PaneManager.isOneOrMoreRowsSelected(selObj) ||
          PaneManager.isOneOrMoreColumnsSelected(selObj);

      if (!isRange) {
        var fromRowIdx = _.get(selObj, 'topLeft.rowIdx');
        var fromColIdx = _.get(selObj, 'topLeft.colIdx');
        var toRowIdx = _.get(selObj, 'bottomRight.rowIdx');
        var toColIdx = _.get(selObj, 'bottomRight.colIdx');

        isRange = _.areValidIdx(fromRowIdx, fromColIdx, toRowIdx, toColIdx) &&
            ((toRowIdx - fromRowIdx) !== 0 || (toColIdx - fromColIdx) !== 0);
      }
      return isRange;
    },


    /**
     * @param {Object | undefined} sel - current selection | undefined
     * @return {boolean} true if selection is merged, false otherwise
     */
    isSelectionMerged: function(sel) {
      var selectionIsMerged = false;
      var fromRowIdx = 0, fromColIdx = 0;
      var toRowIdx = 0, toColIdx = 0;
      var currentSel = sel || SheetSelectionManager.getCurrentSelection();
      var mainPane = PaneManager.getMainPane();

      // populate appropriate range.
      if (PaneManager.isEntireSheetSelected(currentSel)) {
        toColIdx = mainPane.getNumOfCols() - 1;
        toRowIdx = mainPane.getNumOfRows() - 1;
      } else if (PaneManager.isOneOrMoreRowsSelected(currentSel)) {
        fromRowIdx = _.get(currentSel, 'topLeft.rowIdx');
        toRowIdx = _.get(currentSel, 'bottomRight.rowIdx');
        toColIdx = mainPane.getNumOfCols() - 1;
      } else if (PaneManager.isOneOrMoreColumnsSelected(currentSel)) {
        fromColIdx = _.get(currentSel, 'topLeft.colIdx');
        toColIdx = _.get(currentSel, 'bottomRight.colIdx');
        toRowIdx = mainPane.getNumOfRows() - 1;
      } else {
        fromRowIdx = _.get(currentSel, 'topLeft.rowIdx');
        fromColIdx = _.get(currentSel, 'topLeft.colIdx');
        toRowIdx = _.get(currentSel, 'bottomRight.rowIdx');
        toColIdx = _.get(currentSel, 'bottomRight.colIdx');
      }

      // validate if range is merged.
      if (_.areValidIdx(fromRowIdx, fromColIdx, toRowIdx, toColIdx)) {
        var floaterMgr = mainPane.getFloaterManager();
        selectionIsMerged = floaterMgr.isRangeMerged(fromRowIdx, fromColIdx,
            toRowIdx, toColIdx);
      }
      return selectionIsMerged;
    }
  };

  return api_;
});
