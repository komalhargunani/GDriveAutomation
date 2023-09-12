/**
 * Chart Sheet Manager unit test suite
 */

define([
  'qowtRoot/controls/grid/chartSheetManager',
  'qowtRoot/widgets/grid/floaterChart',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/cssManager'
], function(
    ChartSheetManager,
    FloaterChart,
    DomListener,
    CssManager) {

  'use strict';

  describe('Chart Sheet Manager', function() {

    var containerNode;
    var chartFloaterWidget;
    var floaterChartConfig;

    beforeEach(function() {
      containerNode = document.createElement('div');
      floaterChartConfig = {
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
          type: 'center'
        }
      };
    });

    afterEach(function() {
      ChartSheetManager.reset();
      containerNode = undefined;
      chartFloaterWidget = undefined;
    });

    it('should have an init() method that initialises the singleton ' +
        'chart sheet manager', function() {
          expect(ChartSheetManager.getChartSheetContainer()).not.toBeDefined();
          expect(ChartSheetManager.getFloaterManager()).not.toBeDefined();
          expect(ChartSheetManager.init).toBeDefined();
          ChartSheetManager.init(containerNode);
          expect(ChartSheetManager.getChartSheetContainer()).toBeDefined();
          expect(ChartSheetManager.getFloaterManager()).toBeDefined();
          expect(ChartSheetManager.getFloaterManager().count()).toBe(0);
        });

    it('should have a reset() method that resets the singleton chart ' +
        'sheet manager', function() {
          ChartSheetManager.init(containerNode);

          chartFloaterWidget = FloaterChart.create(floaterChartConfig);
          ChartSheetManager.getFloaterManager().attachWidget(
              chartFloaterWidget);
          chartFloaterWidget.appendTo(containerNode);

          expect(ChartSheetManager.getChartSheetContainer().childNodes.length).
              toBe(1);
          expect(ChartSheetManager.getFloaterManager().count()).toBe(1);

          ChartSheetManager.reset();
          expect(ChartSheetManager.getChartSheetContainer().childNodes.length).
              toBe(0);
          expect(ChartSheetManager.getFloaterManager().count()).toBe(0);
        });

    it('should have an activate() method that starts listening for ' +
        'window resize events', function() {
          spyOn(DomListener, 'addListener');
          ChartSheetManager.init(containerNode);
          expect(DomListener.addListener).not.toHaveBeenCalled();
          ChartSheetManager.activate();
          expect(DomListener.addListener).toHaveBeenCalled();
          ChartSheetManager.deactivate();
        });

    it('should reposition the chart when a window resize event occurs',
       function() {
         ChartSheetManager.init(containerNode);

         chartFloaterWidget = FloaterChart.create(floaterChartConfig);
         ChartSheetManager.getFloaterManager().attachWidget(chartFloaterWidget);
         chartFloaterWidget.appendTo(containerNode);

         spyOn(chartFloaterWidget, 'setTopPosition');
         spyOn(chartFloaterWidget, 'setLeftPosition');

         ChartSheetManager.activate();
         DomListener.dispatchEvent(window, 'resize');
         expect(chartFloaterWidget.setTopPosition).toHaveBeenCalled();
         expect(chartFloaterWidget.setLeftPosition).toHaveBeenCalled();
         ChartSheetManager.deactivate();
       });

    it('should have a deactivate() method that stops listening for ' +
        'window resize events', function() {
          ChartSheetManager.init(containerNode);

          chartFloaterWidget = FloaterChart.create(floaterChartConfig);
          ChartSheetManager.getFloaterManager().attachWidget(
              chartFloaterWidget);
          chartFloaterWidget.appendTo(containerNode);

          ChartSheetManager.activate();

          spyOn(DomListener, 'removeListener');
          ChartSheetManager.deactivate();
          expect(DomListener.removeListener).toHaveBeenCalled();
        });

    it('should have an adjustForZoomScale() method that repositions the ' +
        'chart and resizes the scrollbars', function() {
          ChartSheetManager.init(containerNode);

          chartFloaterWidget = FloaterChart.create(floaterChartConfig);
          ChartSheetManager.getFloaterManager().attachWidget(
              chartFloaterWidget);
          chartFloaterWidget.appendTo(containerNode);

          spyOn(chartFloaterWidget, 'setTopPosition');
          spyOn(chartFloaterWidget, 'setLeftPosition');
          spyOn(CssManager, 'addRule');

          ChartSheetManager.adjustForZoomScale();
          expect(chartFloaterWidget.setTopPosition).toHaveBeenCalled();
          expect(chartFloaterWidget.setLeftPosition).toHaveBeenCalled();
          expect(CssManager.addRule).toHaveBeenCalled();
        });
  });
});
