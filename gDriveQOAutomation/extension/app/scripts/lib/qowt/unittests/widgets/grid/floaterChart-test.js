define([
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/grid/floaterChart'
], function(
    SheetConfig,
    UnittestUtils,
    SheetFloaterChart) {

  'use strict';

  describe('sheet floater chart widget', function() {
    var rootNode, testAppendArea, config;

    beforeEach(function() {

      SheetConfig.kGRID_DEFAULT_ROWS = 150;
      SheetConfig.kGRID_DEFAULT_COLS = 150;
      SheetConfig.kGRID_DEFAULT_ROW_HEIGHT = 45;
      SheetConfig.kGRID_DEFAULT_COL_WIDTH = 180;
      SheetConfig.kGRID_GRIDLINE_WIDTH = 1;

      testAppendArea = UnittestUtils.createTestAppendArea();
      rootNode = document.createElement('div');
      testAppendArea.appendChild(rootNode);

      config = {
        chartId: 'chart3',
        anchor: {
          frm: {
            ri: 10,
            ci: 20,
            xo: 19050,
            yo: 142875
          },
          to: {
            ri: 4,
            ci: 4,
            xo: 323850,
            yo: 28575
          },
          type: 'two'
        }
      };

    });

    afterEach(function() {
      testAppendArea.removeChild(rootNode);
      rootNode = undefined;
      config = undefined;
    });

    it('should return the anchor cell', function() {
      var anchorRow = 10;
      var anchorCol = 20;
      var chartWidget = SheetFloaterChart.create(config);
      expect(chartWidget.x()).toBe(anchorCol);
      expect(chartWidget.y()).toBe(anchorRow);
    });

    it('should return the row span,column span, chart Id and offsets',
       function() {
         var chartWidget = SheetFloaterChart.create(config);
         var rowSpan = config.anchor.to.ri - config.anchor.frm.ri + 1;
         var colSpan = config.anchor.to.ci - config.anchor.frm.ci + 1;

         expect(chartWidget.rowSpan()).toBe(rowSpan);
         expect(chartWidget.colSpan()).toBe(colSpan);
         expect(chartWidget.getChartId()).toBe('chart3');
        });

    it('should not match against undefined or null', function() {
      var chartWidget = SheetFloaterChart.create(config);

      expect(chartWidget.isMatchingFloater(undefined)).toBe(false);
      expect(chartWidget.isMatchingFloater(null)).toBe(false);
    });

    it("should set the node's display property", function() {
      var chartWidget = SheetFloaterChart.create(config);

      chartWidget.setDisplay('none');
      expect(chartWidget.getNode().style.display).toBe('none');

      chartWidget.setDisplay('block');
      expect(chartWidget.getNode().style.display).toBe('block');

      chartWidget.setDisplay('none');
      expect(chartWidget.getNode().style.display).toBe('none');
    });

    it('should have a cloneTo() method which clones the specified chart widget',
       function() {
         var numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBe(0);

         var chartWidget = SheetFloaterChart.create(config);

         chartWidget.appendTo(rootNode);
         numChildNodes = rootNode.childNodes.length;
         expect(numChildNodes).toBeGreaterThan(0);

         chartWidget.cloneTo(rootNode);
         var numChildNodesAfterCloning = rootNode.childNodes.length;
         expect(numChildNodesAfterCloning).toEqual(numChildNodes * 2);
       });

    it('should NOT request to be selected', function() {
      var chartWidget = SheetFloaterChart.create(config);

      chartWidget.appendTo(rootNode);

      expect(chartWidget.isSelectable()).toBe(false);
    });
  });
});
