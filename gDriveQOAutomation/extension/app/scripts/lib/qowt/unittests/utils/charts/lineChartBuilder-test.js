/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/charts/lineChartBuilder',
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/configs/common',
  'qowtRoot/models/charts',
  'qowtRoot/utils/charts/percentStackedChartBuilder'
], function(
    UnitConversionUtils,
    Builder,
    ChartRenderer,
    CommonConfig,
    ChartsModel,
    PercentStackedChartBuilder) {

  'use strict';

  describe('Line Chart Builder tests', function() {

    beforeEach(function() {
      spyOn(PercentStackedChartBuilder, 'build');
    });

    afterEach(function() {
    });

    it('should register itself with the Chart Renderer on construction',
       function() {
         expect(Builder).toBeDefined();
         expect(ChartRenderer.isBuilderRegistered(Builder.type)).
             toBe(true);
       });

    it('should handle an undefined parameter to the build() method',
       function() {
         Builder.build(undefined);
         expect(Builder).toBeDefined();
       });

    it('should build the correct colors for the chart', function() {
      // mimic the ChartHandler
      ChartsModel.colors = CommonConfig.DEFAULT_COLORS;

      var chartData = {};
      var res = Builder.build(chartData);
      expect(res.options.colors).toEqual(CommonConfig.DEFAULT_COLORS);
    });

    it('should build the correct title for the chart', function() {
      var chartData = {
        options: {
          title: {
            text: 'Countries of the World'
          }
        }
      };
      var res = Builder.build(chartData);
      expect(res.options.title).toBe(chartData.options.title.text);
    });

    it('should build the correct Y value axis plot for the chart',
       function() {
         var chartData = createLineChartData();

         var numOfRows = 4 + 1; // number of data points in a series,
         // plus 1 row for series labels
         var numOfCols = 2 + 1; // number of series, plus 1 row for
         // category labels
         var res = Builder.build(chartData);
         expect(res.data.length).toBe(numOfRows);
         expect(res.data[0].length).toBe(numOfCols);
       });

    it('should build the correct min and max Y-axis values for the chart',
       function() {
         var chartData = createLineChartData();

         var res = Builder.build(chartData);
         expect(res.options.vAxis.viewWindow.min).toBeDefined();
         expect(res.options.vAxis.viewWindow.max).toBeDefined();

         // set explicit min and max values
         chartData.options.axes = {yaxis: {min: 21, max: 47}};
         res = Builder.build(chartData);
         expect(res.options.vAxis.viewWindow.min).toBe(
             chartData.options.axes.yaxis.min);
         expect(res.options.vAxis.viewWindow.max).toBe(
             chartData.options.axes.yaxis.max);
       });

    it('should build the correct gridlines configuration for the chart',
       function() {
         var chartData = {
           options: {
             axes: {
               yaxis: {
                 showMajorGridline: true
               }
             }
           }
         }; // default gridlines configuration
         var res = Builder.build(chartData);
         // i.e. default color is to be used
         expect(res.options.vAxis.gridlines.color).toBe(undefined);
         // i.e. default count is to be used
         expect(res.options.vAxis.gridlines.count).toBe(undefined);

         chartData = {
           options: {
             axes: {
               yaxis: {
                 showMajorGridline: false
               }
             }
           }
         };
         res = Builder.build(chartData);
         // white, so that the gridlines are invisible
         expect(res.options.vAxis.gridlines.color).toBe('#FFF');
         expect(res.options.vAxis.gridlines.count).toBe(undefined);

         chartData = {
           options: {
             axes: {
               yaxis: {
                 showMajorGridline: true,
                 major: 25
               }
             }
           }
         };
         res = Builder.build(chartData);
         expect(res.options.vAxis.gridlines.color).toBe(undefined);
         expect(res.options.vAxis.gridlines.count).toBeDefined();

         chartData = {
           options: {
             axes: {
               yaxis: {
                 showMajorGridline: false,
                 major: 60
               }
             }
           }
         };
         res = Builder.build(chartData);
         expect(res.options.vAxis.gridlines.color).toBe('#FFF');
         expect(res.options.vAxis.gridlines.count).toBeDefined();
       });

    it('should build the correct marker config for the chart', function() {
      var chartData = createLineChartData();

      var res = Builder.build(chartData);

      var obj = {};
      // convert the pointSize from point units to pixel units
      obj.pointSize = UnitConversionUtils.
        convertPointToPixel(chartData.options.series[0].markerOptions.size);
      expect(obj.pointSize).toBeDefined();
      expect(res.options.series[0]).toEqual(obj);
    });

    it('should build the correct type for the chart', function() {
      var chartData = {};
      var res = Builder.build(chartData);
      expect(res.type).toBe('LineChart');
      expect(res.options.isStacked).toBe(undefined);

      chartData.subtype = 'stack';
      res = Builder.build(chartData);
      // area chart used as a workaround
      expect(res.type).toBe('AreaChart');
      expect(res.options.isStacked).toBe(true);
      expect(res.options.areaOpacity).toBe(0.0);
    });

    it('should build for percent stacked chart', function() {
      var chartData = {subtype: 'pctStack'};
      Builder.build(chartData);

      expect(PercentStackedChartBuilder.build).toHaveBeenCalled();
    });

    var createLineChartData = function() {
      return {
        data: [
          [
            [1, 20],
            [2, 30],
            [3, 10],
            [4, 40]
          ], // first series, with 4 data points
          [
            [1, 50],
            [2, 5],
            [3, 25],
            [4, 7]
          ] // second series, with 4 data points
        ],
        options: {
          series: [
            {
              label: 'First Series',
              markerOptions: {show: true, size: 12}
            },
            {label: 'Second Series'}
          ],
          title: {text: 'title'}
        },
        type: 'line',
        subtype: 'stack',
        categories: ['Eggs', 'Bacon', 'Tomatoes', 'Sausage']
      };
    };
  });
});
