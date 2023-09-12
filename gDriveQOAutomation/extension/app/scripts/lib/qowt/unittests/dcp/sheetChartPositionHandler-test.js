define([
  'qowtRoot/dcp/sheetChartPositionHandler',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/sheet/sheetChartElementFixture',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/dcp/utils/unitConversionUtils'], function(
    SheetChartPosition,
    PaneManager,
    UnittestUtils,
    FIXTURES,
    SheetConfig,
    Workbook,
    Utils) {

  'use strict';

  describe('sheet chart location DCP Handler', function() {

    FIXTURES = FIXTURES || {};

    var handler, rootNode, floaterMgr, rowNode;
    var testAppendArea;

    beforeEach(function() {
      // Create a dummy grid
      SheetConfig.kGRID_DEFAULT_ROWS = 2000;
      SheetConfig.kGRID_DEFAULT_COLS = 150;
      SheetConfig.kGRID_DEFAULT_ROW_HEIGHT = 45;
      SheetConfig.kGRID_DEFAULT_COL_WIDTH = 180;
      SheetConfig.kGRID_GRIDLINE_WIDTH = 1;

      rootNode = document.createElement('div');

      Workbook.init();
      Workbook.appendTo(rootNode);
      rootNode.style.visibility = 'hidden';

      testAppendArea = UnittestUtils.createTestAppendArea();
      testAppendArea.appendChild(rootNode);

      rowNode = document.getElementsByClassName('qowt-sheet-row')[0];

      handler = SheetChartPosition;
      floaterMgr = PaneManager.getMainPane().getFloaterManager();

    });

    afterEach(function() {
      testAppendArea.removeChild(rootNode);

      floaterMgr = undefined;
      handler = undefined;
      rowNode = undefined;
      testAppendArea = undefined;
    });

    it('should add a new floater', function() {

      var chartLocDCP = FIXTURES.sheetChartElement(0);
      setupHelper(chartLocDCP);

      expect(floaterMgr.count()).toBe(1);
    });

    it('should add a chart with an ID', function() {

      var chartLocDCP = FIXTURES.sheetChartElement(0);
      setupHelper(chartLocDCP);

      expect(floaterMgr.count()).toBe(1);

      var floaterChart = floaterMgr.at(0);
      expect(floaterChart.getChartId()).toBe(chartLocDCP.chid);
    });

    it('should add a chart with a from cell', function() {

      var chartLocDCP = FIXTURES.sheetChartElement(0);
      setupHelper(chartLocDCP);

      var floaterChart = floaterMgr.at(0);

      expect(floaterChart.x()).toBe(chartLocDCP.elm[0].ancr.frm.ci);
      expect(floaterChart.y()).toBe(chartLocDCP.elm[0].ancr.frm.ri);
    });

    it('should add a chart with offsets cell', function() {

      var chartLocDCP = FIXTURES.sheetChartElement(0);
      setupHelper(chartLocDCP);

      var floaterChart = floaterMgr.at(0);


      expect(floaterChart.getFromColOffset()).toBe(
          Utils.convertEmuToPixel(chartLocDCP.elm[0].ancr.frm.xo));
      expect(floaterChart.getFromRowOffset()).toBe(
          Utils.convertEmuToPixel(chartLocDCP.elm[0].ancr.frm.yo));
      expect(floaterChart.getToColOffset()).toBe(
          Utils.convertEmuToPixel(chartLocDCP.elm[0].ancr.to.xo));
      expect(floaterChart.getToRowOffset()).toBe(
          Utils.convertEmuToPixel(chartLocDCP.elm[0].ancr.to.yo));
    });

    it('should override the "oncontextmenu" event handler of a chart',
        function() {

          var chartLocDCP = FIXTURES.sheetChartElement(0);
          setupHelper(chartLocDCP);

          var floaterChart = floaterMgr.at(0);

          expect(floaterChart.getNode().oncontextmenu).not.toBeNull();
        }
    );

    var setupHelper = function(chartLocDCP) {
      expect(floaterMgr.count()).toBe(0);

      var v = {
        el: chartLocDCP,
        node: rowNode
      };
      handler.visit(v);

      expect(floaterMgr.count()).toBe(1);
    };

  });

});
