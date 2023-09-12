/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/getSheetInformationHandler',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/fixtures/sheet/getSheetInformationResponseFixture',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    GetSheetInformationHandler,
    Workbook,
    FIXTURES,
    SheetModel,
    SheetConfig,
    SheetSelectionManager) {

  'use strict';

  describe('getSheetInformation DCP Handler', function() {

    FIXTURES = FIXTURES || {};

    var handler = GetSheetInformationHandler;
    var rootNode;

    beforeEach(function() {

      // Create a dummy grid

      SheetConfig.kGRID_DEFAULT_ROWS = 2000;
      SheetConfig.kGRID_DEFAULT_COLS = 250;
      SheetConfig.kGRID_DEFAULT_ROW_HEIGHT = 45;
      SheetConfig.kGRID_DEFAULT_COL_WIDTH = 180;
      SheetConfig.kGRID_GRIDLINE_WIDTH = 1;

      rootNode = document.createElement('div');
      rootNode.style.visibility = 'hidden';

      Workbook.init();
      Workbook.appendTo(rootNode);
    });

    it("should set SheetModel.seedCell if it's inside the number of " +
        'displayed rows', function() {
          var responseEl = FIXTURES.getSheetInformationResponseElement(
              2000, 163, {}, {}, 0, 0, 1999, 10);
          var v = {el: responseEl};
          SheetConfig.kGRID_DEFAULT_MAX_ROWS = 5000;
          Workbook.setDefaultFormatting = function() {};
          Workbook.setDefaultRowHeight = function() {};
          Workbook.setDefaultColumnWidth = function() {};
          Workbook.ensureMinimalRowCount = function() {};
          Workbook.layoutColumnWidths = function() {};
          SheetSelectionManager.trySeedSelection = function() {};
          SheetSelectionManager.getCurrentSelection = function() {};
          SheetSelectionManager.renderStoredRange = function() {};
          SheetSelectionManager.getStoredSelectionForSheet = function() {};
          SheetModel.seedCell = undefined;
          handler.visit(v);
          expect(SheetModel.seedCell).toBeDefined();
          expect(SheetModel.numberOfNonEmptyRows).toBe(2000);
          expect(SheetModel.numberOfNonEmptyCols).toBe(163);
        });

    it('should set SheetModel.seedCell to A,1 if the seed cell is not ' +
        'inside the number of displayed rows', function() {
          var responseEl = FIXTURES.getSheetInformationResponseElement(
              2000, 163, {}, {}, 0, 0, 2000, 10);
          var v = {el: responseEl};
          SheetConfig.kGRID_DEFAULT_MAX_ROWS = 5000;
          Workbook.setDefaultFormatting = function() {};
          Workbook.setDefaultRowHeight = function() {};
          Workbook.setDefaultColumnWidth = function() {};
          Workbook.ensureMinimalRowCount = function() {};
          Workbook.layoutColumnWidths = function() {};
          SheetSelectionManager.trySeedSelection = function() {};
          SheetSelectionManager.getCurrentSelection = function() {};
          SheetSelectionManager.renderStoredRange = function() {};
          SheetSelectionManager.getStoredSelectionForSheet = function() {};
          SheetModel.seedCell = undefined;
          handler.visit(v);
          var obj = {
            anchor: {rowIdx: 0, colIdx: 0},
            topLeft: {rowIdx: 0, colIdx: 0},
            bottomRight: {rowIdx: 0, colIdx: 0},
            contentType: 'sheetCell'
          };
          expect(SheetModel.seedCell).toEqual(obj);
          expect(SheetModel.numberOfNonEmptyRows).toBe(2000);
          expect(SheetModel.numberOfNonEmptyCols).toBe(163);
        });

    it('should check whether the active sheet is a chart sheet or a ' +
        'normal sheet and act accordingly', function() {
          var responseEl = FIXTURES.getSheetInformationResponseElement(
              2000, 163, {}, {}, 0, 0, 1999, 10, true);
          var v = {el: responseEl};
          expect(SheetModel.activeChartSheet).toBe(false);
          spyOn(Workbook, 'showChartSheet');
          handler.visit(v);
          expect(SheetModel.activeChartSheet).toBe(true);
          expect(Workbook.showChartSheet).toHaveBeenCalled();

          responseEl = FIXTURES.getSheetInformationResponseElement(
              2000, 163, {}, {}, 0, 0, 1999, 10, false);
          v = {el: responseEl};
          expect(SheetModel.activeChartSheet).toBe(true);
          spyOn(Workbook, 'hideChartSheet');
          handler.visit(v);
          expect(SheetModel.activeChartSheet).toBe(false);
          expect(Workbook.hideChartSheet).toHaveBeenCalled();
        });

  });
});
