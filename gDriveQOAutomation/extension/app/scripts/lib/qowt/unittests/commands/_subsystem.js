
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'commands',

    suites: [
      'unitTestRoot/commands/common/convertToDocs-test',
      'unitTestRoot/commands/common/deleteQowtElement-test',
      'unitTestRoot/commands/common/saveFile-test',
      'unitTestRoot/commands/common/transactionStart-test',
      'unitTestRoot/commands/common/transactionEnd-test',
      'unitTestRoot/commands/common/writeToUserFile-test',
      'unitTestRoot/commands/drawing/modifyShapeFill-test',
      'unitTestRoot/commands/quicksheet/completeCellEdit-test',
      'unitTestRoot/commands/quicksheet/getModifiedCells-test',
      'unitTestRoot/commands/quicksheet/getSheetContent-test',
      'unitTestRoot/commands/quicksheet/getSheetInformation-test',
      'unitTestRoot/commands/quicksheet/getWorkbookInformation-test',
      'unitTestRoot/commands/quicksheet/mirrorText-test',
      'unitTestRoot/commands/quicksheet/openWorkbookFile-test',
      'unitTestRoot/commands/quicksheet/setCellBoldness-test',
      'unitTestRoot/commands/quicksheet/setCellContent-test',
      'unitTestRoot/commands/quicksheet/setCellItalics-test',
      'unitTestRoot/commands/quicksheet/setCellUnderline-test',
      'unitTestRoot/commands/quicksheet/setActiveCell-test',
      'unitTestRoot/commands/quicksheet/setActiveSheetIndex-test',
      'unitTestRoot/commands/quicksheet/setCellBackgroundColor-test',
      'unitTestRoot/commands/quicksheet/setCellFontFace-test',
      'unitTestRoot/commands/quicksheet/' +
          'setCellBackgroundColorOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellBoldnessOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellFontFaceOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellFontSizeOptimistically-test',
      'unitTestRoot/commands/quicksheet/' +
          'setCellHorizontalAlignmentOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellItalicsOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellTextColorOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellUnderlineOptimistically-test',
      'unitTestRoot/commands/quicksheet/' +
          'setCellVerticalAlignmentOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellWrapTextOptimistically-test',
      'unitTestRoot/commands/quicksheet/setCellHorizontalAlignment-test',
      'unitTestRoot/commands/quicksheet/setCellVerticalAlignment-test',
      'unitTestRoot/commands/quicksheet/setCellFontSize-test',
      'unitTestRoot/commands/quicksheet/setCellTextColor-test',
      'unitTestRoot/commands/quicksheet/setCellWrapText-test',
      'unitTestRoot/commands/quicksheet/resizeRow-test',
      'unitTestRoot/commands/quicksheet/resizeColumn-test',
      'unitTestRoot/commands/quicksheet/updateCellsBase-test',
      'unitTestRoot/commands/quicksheet/updateRowsColumnsBase-test',
      'unitTestRoot/commands/quicksheet/setCellNumberFormat-test',
      'unitTestRoot/commands/quicksheet/spliceColumns-test',
      'unitTestRoot/commands/quicksheet/moveCellRangeSelectionDown-test',
      'unitTestRoot/commands/quicksheet/moveCellRangeSelectionLeft-test',
      'unitTestRoot/commands/quicksheet/moveCellRangeSelectionRight-test',
      'unitTestRoot/commands/quicksheet/moveCellRangeSelectionUp-test',
      'unitTestRoot/commands/quicksheet/moveCellSelectionDown-test',
      'unitTestRoot/commands/quicksheet/moveCellSelectionLeft-test',
      'unitTestRoot/commands/quicksheet/moveCellSelectionRight-test',
      'unitTestRoot/commands/quicksheet/moveCellSelectionToClickPos-test',
      'unitTestRoot/commands/quicksheet/moveCellSelectionUp-test',
      'unitTestRoot/commands/quicksheet/injectCellRef-test',
      'unitTestRoot/commands/quicksheet/copyCellRange-test',
      'unitTestRoot/commands/quicksheet/cutCellRange-test',
      'unitTestRoot/commands/quicksheet/copyCutCellRangeCommandBase-test',
      'unitTestRoot/commands/quicksheet/cancelCutCellRange-test',
      'unitTestRoot/commands/quicksheet/pasteCellRange-test',
      'unitTestRoot/commands/quicksheet/injectCellRange-test',
      'unitTestRoot/commands/quicksheet/toggleNumberFormatDialog-test',
      'unitTestRoot/commands/quickword/getDocumentStatistics-test',
      'unitTestRoot/commands/quickword/getDocFonts-test',
      'unitTestRoot/commands/quickword/getDocStyles-test',
      'unitTestRoot/commands/domMutations/textTransactions-test',
      'unitTestRoot/commands/domMutations/deleteNode-test',
      'unitTestRoot/commands/domMutations/deleteText-test',
      'unitTestRoot/commands/domMutations/formatElement-test',
      'unitTestRoot/commands/domMutations/insertText-test',
      'unitTestRoot/commands/domMutations/moveNode-test',
      'unitTestRoot/commands/domMutations/newCharRun-test',
      'unitTestRoot/commands/domMutations/newParagraph-test',
      'unitTestRoot/commands/drawing/addQowtImage-test',
      'unitTestRoot/commands/text/textCommandBase-test',
      'unitTestRoot/commands/text/addQowtTable-test',
      'unitTestRoot/commands/text/addQowtTableRow-test',
      'unitTestRoot/commands/text/addQowtTableCell-test',
      'unitTestRoot/commands/text/addQowtHyperlink-test',
      'unitTestRoot/commands/text/insertQowtText-test',
      'unitTestRoot/commands/text/deleteQowtText-test',
      'unitTestRoot/commands/text/addQowtCharacterRun-test',
      'unitTestRoot/commands/undo/undoManager-test',
      'unitTestRoot/commands/commandManager-test',
      'unitTestRoot/commands/commandQueueManager-test',
      'unitTestRoot/commands/coreFailureHandler-test',
      'unitTestRoot/commands/commandBase-test',
      'unitTestRoot/commands/markDocDirtyCommandBase-test',
      'unitTestRoot/commands/queueableCommandJoiner-test',
      'unitTestRoot/commands/revertManager-test',
      'unitTestRoot/commands/commandBaseQueueableAdapter-test',
      'unitTestRoot/commands/rootCommandBaseQueueableAdapter-test'
    ]
  };

  return _api;
});
