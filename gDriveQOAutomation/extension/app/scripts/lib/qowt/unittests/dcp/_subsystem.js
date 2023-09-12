
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'dcp',

    suites: [
      'unitTestRoot/dcp/decorators/alignmentDecorator-test',
      'unitTestRoot/dcp/decorators/drawingAnchorDecorator-test',
      'unitTestRoot/dcp/decorators/backgroundDecorator-test',
      'unitTestRoot/dcp/decorators/borderDecorator-test',
      'unitTestRoot/dcp/decorators/geometryDecorator-test',
      'unitTestRoot/dcp/decorators/graphicFrameDecorator-test',
      'unitTestRoot/dcp/decorators/groupShapeDecorator-test',
      'unitTestRoot/dcp/decorators/pointParagraphDecorator-test',
      'unitTestRoot/dcp/decorators/hyperlinkDecorator-test',
      'unitTestRoot/dcp/decorators/listItemDecorator-test',
      'unitTestRoot/dcp/decorators/pointTextBodyPropertiesDecorator-test',
      'unitTestRoot/dcp/decorators/pointTextDecorator-test',
      'unitTestRoot/dcp/decorators/pointTextDecoratorForTable-test',
      'unitTestRoot/dcp/decorators/shapeDecorator-test',
      'unitTestRoot/dcp/decorators/shapeEffectsDecorator-test',
      'unitTestRoot/dcp/decorators/pointTableDecorator-test',
      'unitTestRoot/dcp/decorators/slideDecorator-test',
      'unitTestRoot/dcp/decorators/cellDecorator-test',
      'unitTestRoot/dcp/decorators/placeHolderDecorator-test',
      'unitTestRoot/dcp/decorators/styleDecorator-test',
      'unitTestRoot/dcp/decorators/tableStyleDecorator-test',
      'unitTestRoot/dcp/decorators/drawingDecorator-test',
      'unitTestRoot/dcp/decorators/fieldDecorator-test',
      'unitTestRoot/dcp/decorators/textRotationDecorator-test',
      'unitTestRoot/dcp/pointHandlers/animation/commonTimeNodeHandler-test',
      'unitTestRoot/dcp/pointHandlers/animation/shapeTargetHandler-test',
      'unitTestRoot/dcp/pointHandlers/common/blipFillHandler-test',
      'unitTestRoot/dcp/pointHandlers/common/fillHandler-test',
      'unitTestRoot/dcp/pointHandlers/common/gradientFillHandler-test',
      'unitTestRoot/dcp/pointHandlers/common/outlineDecorator-test',
      'unitTestRoot/dcp/pointHandlers/common/solidFillHandler-test',
      'unitTestRoot/dcp/pointHandlers/fixtures/testFixtures',
      'unitTestRoot/dcp/pointHandlers/util/cssManagers/drawing/' +
          'textSpacingHandler-test',
      'unitTestRoot/dcp/pointHandlers/util/cssManagers/presentation-test',
      'unitTestRoot/dcp/pointHandlers/util/utils-test',
      'unitTestRoot/dcp/pointHandlers/fillStyleHandler-test',
      'unitTestRoot/dcp/pointHandlers/effectStyleHandler-test',
      'unitTestRoot/dcp/pointHandlers/fontSchemeHandler-test',
      'unitTestRoot/dcp/pointHandlers/groupShapeHandler-test',
      'unitTestRoot/dcp/pointHandlers/graphicFrameHandler-test',
      'unitTestRoot/dcp/pointHandlers/pointTableCellHandler-test',
      'unitTestRoot/dcp/pointHandlers/pointTableHandler-test',
      'unitTestRoot/dcp/pointHandlers/pointTableRowHandler-test',
      'unitTestRoot/dcp/pointHandlers/shapeHandler-test',
      'unitTestRoot/dcp/pointHandlers/shapePropertiesHandler-test',
      'unitTestRoot/dcp/pointHandlers/shapeTextBodyHandler-test',
      'unitTestRoot/dcp/pointHandlers/textParagraphHandler-test',
      'unitTestRoot/dcp/pointHandlers/textRunHandler-test',
      'unitTestRoot/dcp/pointHandlers/textFieldHandler-test',
      'unitTestRoot/dcp/pointHandlers/slideContentHandler-test',
      'unitTestRoot/dcp/pointHandlers/slideLayoutHandler-test',
      'unitTestRoot/dcp/pointHandlers/slideMasterHandler-test',
      'unitTestRoot/dcp/pointHandlers/slideNotesHandler-test',
      'unitTestRoot/dcp/pointHandlers/transform2DHandler-test',
      'unitTestRoot/dcp/pointHandlers/' +
          'rectangularShapePropertiesHandler-test',
      'unitTestRoot/dcp/pointHandlers/placeHolderHandler-test',
      'unitTestRoot/dcp/pointHandlers/placeHolderTextBodyHandler-test',
      'unitTestRoot/dcp/pointHandlers/presentationHandler-test',
      'unitTestRoot/dcp/pointHandlers/lineStyleHandler-test',
      'unitTestRoot/dcp/pointHandlers/bgFillStyleHandler-test',
      'unitTestRoot/dcp/pointHandlers/colorSchemeHandler-test',
      'unitTestRoot/dcp/pointHandlers/tableStyleHandler-test',
      'unitTestRoot/dcp/wordHandlers/documentStatisticsHandler-test',
      'unitTestRoot/dcp/wordHandlers/table-test',
      'unitTestRoot/dcp/wordHandlers/tableCell-test',
      'unitTestRoot/dcp/wordHandlers/tableRow-test',
      'unitTestRoot/dcp/drawingHandler-test',
      'unitTestRoot/dcp/axisHandler-test',
      'unitTestRoot/dcp/bulletedListHandler-test',
      'unitTestRoot/dcp/charRunHandler-test',
      'unitTestRoot/dcp/charRunHandler-dcpv2-test',
      'unitTestRoot/dcp/chartHandler-test',
      'unitTestRoot/dcp/chartDataPointXHandler-test',
      'unitTestRoot/dcp/chartDataPointYHandler-test',
      'unitTestRoot/dcp/chartDataPointXYHandler-test',
      'unitTestRoot/dcp/chartDataPointVHandler-test',
      'unitTestRoot/dcp/dcpManager-test',
      'unitTestRoot/dcp/docHandler-test',
      'unitTestRoot/dcp/footerHandler',
      'unitTestRoot/dcp/footerItemHandler',
      'unitTestRoot/dcp/getSheetInformationHandler-test',
      'unitTestRoot/dcp/getWorkbookInformationHandler-test',
      'unitTestRoot/dcp/headerHandler',
      'unitTestRoot/dcp/headerItemHandler',
      'unitTestRoot/dcp/hyperlinkHandler-test',
      'unitTestRoot/dcp/imageHandler',
      'unitTestRoot/dcp/lineSeparatorHandler-test',
      'unitTestRoot/dcp/metafileHandler',
      'unitTestRoot/dcp/numberedListHandler-test',
      'unitTestRoot/dcp/openWorkbookFileHandler-test',
      'unitTestRoot/dcp/paragraphHandler-test',
      'unitTestRoot/dcp/sectionHandler-test',
      'unitTestRoot/dcp/seriesHandler-test',
      'unitTestRoot/dcp/sheetCellHandler-test',
      'unitTestRoot/dcp/sheetChartPositionHandler-test',
      'unitTestRoot/dcp/updateColumnHandler-test',
      'unitTestRoot/dcp/unknownObjectHandler-test',
      'unitTestRoot/dcp/fieldHandler-test',
      'unitTestRoot/dcp/wordStyleHandler-test'
    ]
  };

  return _api;
});
