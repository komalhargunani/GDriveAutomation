
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'widgets',

    suites: [
      'unitTestRoot/widgets/factory-test',
      'unitTestRoot/widgets/contextMenu/contextMenu-test',
      'unitTestRoot/widgets/document/bookmark-test',
      'unitTestRoot/widgets/document/linebreak-test',
      'unitTestRoot/widgets/document/drawing-test',
      'unitTestRoot/widgets/drawing/ghostShape-test',
      'unitTestRoot/widgets/fields/dateTime-test',
      'unitTestRoot/widgets/grid/cell-test',
      'unitTestRoot/widgets/grid/column-test',
      'unitTestRoot/widgets/grid/formulaBar-test',
      'unitTestRoot/widgets/grid/floatingEditor-test',
      'unitTestRoot/widgets/grid/horizontalLine-test',
      'unitTestRoot/widgets/grid/colHeaderContainer-test',
      'unitTestRoot/widgets/grid/colResizeHandle-test',
      'unitTestRoot/widgets/grid/numberFormatDialog-test',
      'unitTestRoot/widgets/grid/row-test',
      'unitTestRoot/widgets/grid/pane-test',
      'unitTestRoot/widgets/grid/selectionBox-test',
      'unitTestRoot/widgets/grid/highlightBox-test',
      'unitTestRoot/widgets/grid/sheetHeader-test',
      'unitTestRoot/widgets/grid/sheetSelector-test',
      'unitTestRoot/widgets/grid/rowHeaderContainer-test',
      'unitTestRoot/widgets/grid/rowResizeHandle-test',
      'unitTestRoot/widgets/grid/floaterMergeCell-test',
      'unitTestRoot/widgets/grid/floaterChart-test',
      'unitTestRoot/widgets/grid/floaterImage-test',
      'unitTestRoot/widgets/grid/textEditorBase-test',
      'unitTestRoot/widgets/grid/sysClipboard-test',
      'unitTestRoot/widgets/point/addShapeButtonDropdown-test',
      'unitTestRoot/widgets/point/slide-test',
      'unitTestRoot/widgets/point/overlay-test',
      'unitTestRoot/widgets/point/slideNotes-test',
      'unitTestRoot/widgets/point/slideNotesSplitter-test',
      'unitTestRoot/widgets/point/slidesContainer-test',
      'unitTestRoot/widgets/point/shapeMenuItem-test',
      'unitTestRoot/widgets/point/shapeItem-test',
      'unitTestRoot/widgets/point/shapeItemsPane-test',
      'unitTestRoot/widgets/point/thumbnailStrip-test',
      'unitTestRoot/widgets/point/thumbnailContextMenu-test',
      'unitTestRoot/widgets/point/moveSlideDragHandler-test',
      'unitTestRoot/widgets/shape/shape-test',
      'unitTestRoot/widgets/shape/shapeTextBody-test',
      'unitTestRoot/widgets/ui/autocompleteMenu-test',
      'unitTestRoot/widgets/ui/button-test',
      'unitTestRoot/widgets/ui/feedbackButton-test',
      'unitTestRoot/widgets/ui/menuItem-test',
      //'unitTestRoot/widgets/ui/modalDialog-test',
      'unitTestRoot/widgets/image/image-test',
      'unitTestRoot/widgets/ui/menuBase-test',
      'unitTestRoot/widgets/ui/menuPane-test',
      'unitTestRoot/widgets/ui/buttonDropdown-test',
      'unitTestRoot/widgets/ui/modalSpinner-test'
    ]
  };

  return _api;
});
