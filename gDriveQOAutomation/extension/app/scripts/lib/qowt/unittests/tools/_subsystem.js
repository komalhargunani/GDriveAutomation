// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'tools',

    suites: [
      'unitTestRoot/tools/point/actionHandlers/slideSelect-test',
      'unitTestRoot/tools/point/actionHandlers/resetSlideSelection-test',
      'unitTestRoot/tools/point/actionHandlers/slideHideUnhide-test',
      'unitTestRoot/tools/point/actionHandlers/slideInsert-test',
      'unitTestRoot/tools/point/actionHandlers/slideDelete-test',
      'unitTestRoot/tools/point/actionHandlers/slideMove-test',
      'unitTestRoot/tools/point/actionHandlers/duplicateSlide-test',
      'unitTestRoot/tools/point/thumbnailStripTool-test',
      'unitTestRoot/tools/point/actionHandlers/addShape-test',
      'unitTestRoot/tools/point/actionHandlers/addBehaviour-test',
      'unitTestRoot/tools/point/slide-test',
      'unitTestRoot/tools/shape/shapeTool-test',
      'unitTestRoot/tools/shape/actionHandlers/shapeDelete-test',
      'unitTestRoot/tools/shape/actionHandlers/shapeSelect-test',
      'unitTestRoot/tools/shape/actionHandlers/shapeMove-test',
      'unitTestRoot/tools/shape/actionHandlers/shapeResize-test',
      'unitTestRoot/tools/shape/actionHandlers/modifyTransform-test',
      'unitTestRoot/tools/sheet/sheetCellTool-test',
      'unitTestRoot/tools/sheet/sheetTextTool-test',
      'unitTestRoot/tools/sheet/sheetImageTool-test',
      'unitTestRoot/tools/sheet/sheetChartTool-test',
      'unitTestRoot/tools/sheet/sheetTabTool-test',
      'unitTestRoot/tools/sheet/actionHandlers/autoComplete-test',
      'unitTestRoot/tools/sheet/actionHandlers/cellFormatting-test',
      'unitTestRoot/tools/sheet/actionHandlers/cutCopyPaste-test',
      'unitTestRoot/tools/sheet/textHelpers/baseHelper-test',
      'unitTestRoot/tools/sheet/textHelpers/normalTextHelper-test',
      'unitTestRoot/tools/sheet/textHelpers/formulaTextHelper-test',
      'unitTestRoot/tools/text/sequencer-test',
      'unitTestRoot/tools/text/textTool-test',
      'unitTestRoot/tools/text/cleaners/emptySection-test',
      'unitTestRoot/tools/text/cleaners/fontSizeCleaner-test',
      'unitTestRoot/tools/text/cleaners/fontTagRemover-test',
      'unitTestRoot/tools/text/cleaners/nestedSpans-test',
      'unitTestRoot/tools/text/cleaners/alignmentRemover-test',
      'unitTestRoot/tools/text/mutations/graph-test'
    ]
  };

  return _api;
});
