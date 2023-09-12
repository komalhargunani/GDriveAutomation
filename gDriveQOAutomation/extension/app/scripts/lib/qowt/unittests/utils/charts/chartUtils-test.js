// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test cases for chartUtils.js file
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/utils/charts/chartUtils',
  'qowtRoot/models/charts'
], function(
    ChartUtils,
    ChartsModel) {

  'use strict';

  describe('Chart Utils Test', function() {

    var _chartData, _chartObject, _expectedChartObject;

    beforeEach(function() {
      _chartData = {
        type: 'bar'
      };

      _chartObject = {
        data: []
      };

      _expectedChartObject = [
        ['', ''],
        [0, 0]
      ];
    });

    it('should add backgroundColor in chart config options if ' +
        'backgroundColor is set in charts model', function() {
          ChartsModel.backgroundColor = 'transparent';

          var chartConfig = ChartUtils.getDefaultChartConfig();
          expect(chartConfig.options.backgroundColor).toEqual('transparent');
        });

    it('should set default data when chart data is empty and chart type is bar',
       function() {
         ChartUtils.setXValueAxisPlot(_chartData, _chartObject);
         expect(_chartObject.data).toEqual(_expectedChartObject);
       });

    it('should set default data when chart data is empty and chart type is ' +
        'column', function() {
          _chartData.type = 'col';
          ChartUtils.setYValueAxisPlot(_chartData, _chartObject);
          expect(_chartObject.data).toEqual(_expectedChartObject);
        });

    it('should set default data when chart data is empty and chart type is ' +
        'line', function() {
          _chartData.type = 'line';
          ChartUtils.setYValueAxisPlot(_chartData, _chartObject);
          expect(_chartObject.data).toEqual(_expectedChartObject);
        });

    it('should set default data when chart data is empty and chart type is ' +
        'scatter', function() {
          _chartData.type = 'scat';
          ChartUtils.setXYValueAxesPlot(_chartData, _chartObject);
          expect(_chartObject.data).toEqual(_expectedChartObject);
        });

    it('should set default data when chart data is empty and chart type is ' +
        'pie', function() {
          _chartData.type = 'pie';
          _expectedChartObject[1][0] = '';
          ChartUtils.setNoValueAxisPlot(_chartData, _chartObject);
          expect(_chartObject.data).toEqual(_expectedChartObject);
        });
  });
});
