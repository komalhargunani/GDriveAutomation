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
  'qowtRoot/utils/charts/barChartBuilder',
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/configs/common',
  'qowtRoot/models/charts',
  'qowtRoot/utils/charts/percentStackedChartBuilder'
], function(
    Builder,
    ChartRenderer,
    CommonConfig,
    ChartsModel,
    PercentStackedBuilder) {

  'use strict';

  describe('Bar Chart Builder tests', function() {

    beforeEach(function() {
      spyOn(PercentStackedBuilder, 'build');
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
      var chartData = {options: {title: {text: 'Population of UK'}}};
      var res = Builder.build(chartData);
      expect(res.options.title).toBe(chartData.options.title.text);
    });

    it('should build the correct X value axis plot for the chart',
       function() {
         var chartData = createBarChartData();
         // number of data points in a series, plus 1 row for series labels
         var numOfRows = 4 + 1;
         // number of series, plus 1 row for category labels
         var numOfCols = 2 + 1;
         var res = Builder.build(chartData);
         expect(res.data.length).toBe(numOfRows);
         expect(res.data[0].length).toBe(numOfCols);
       });

    it('should build the correct min and max X-axis values for the chart',
       function() {
         var chartData = createBarChartData();

         var res = Builder.build(chartData);
         expect(res.options.hAxis.viewWindow.min).toBeDefined();
         expect(res.options.hAxis.viewWindow.max).toBeDefined();

         // set explicit min and max values
         chartData.options.axes = {xaxis: {min: 7, max: 54}};
         res = Builder.build(chartData);
         expect(res.options.hAxis.viewWindow.min).toBe(
             chartData.options.axes.xaxis.min);
         expect(res.options.hAxis.viewWindow.max).toBe(
             chartData.options.axes.xaxis.max);
       });

    it('should build the correct gridlines configuration for the chart',
       function() {
         var chartData = {
           options: {
             axes: {
               xaxis: {
                 showMajorGridline: true
               }
             }
           }
         }; // default gridlines configuration
         var res = Builder.build(chartData);
         // i.e. default color is to be used
         expect(res.options.hAxis.gridlines.color).toBe(undefined);
         // i.e. default count is to be used
         expect(res.options.hAxis.gridlines.count).toBe(undefined);

         chartData = {
           options: {
             axes: {
               xaxis: {
                 showMajorGridline: false
               }
             }
           }
         };
         res = Builder.build(chartData);
         // white, so that the gridlines are invisible
         expect(res.options.hAxis.gridlines.color).toBe('#FFF');
         expect(res.options.hAxis.gridlines.count).toBe(undefined);

         chartData = {
           options: {
             axes: {
               xaxis: {
                 showMajorGridline: true,
                 major: 15
               }
             }
           }
         };
         res = Builder.build(chartData);
         expect(res.options.hAxis.gridlines.color).toBe(undefined);
         expect(res.options.hAxis.gridlines.count).toBeDefined();

         chartData = {
           options: {
             axes: {
               xaxis: {
                 showMajorGridline: false,
                 major: 40
               }
             }
           }
         };
         res = Builder.build(chartData);
         expect(res.options.hAxis.gridlines.color).toBe('#FFF');
         expect(res.options.hAxis.gridlines.count).toBeDefined();
       });

    it('should build the correct type for the chart', function() {
      var chartData = {};
      var res = Builder.build(chartData);
      expect(res.type).toBe('BarChart');
      expect(res.options.isStacked).toBe(undefined);

      chartData.subtype = 'stack';
      res = Builder.build(chartData);
      expect(res.type).toBe('BarChart');
      expect(res.options.isStacked).toBe(true);
    });

    it('should build for percent stacked chart', function() {
      var chartData = {subtype: 'pctStack'};
      Builder.build(chartData);

      expect(PercentStackedBuilder.build).toHaveBeenCalled();
    });


    var createBarChartData = function() {
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
            {label: 'First Series'},
            {label: 'Second Series'}
          ],
          title: {text: 'title'}
        },
        type: 'bar',
        categories: ['Eggs', 'Bacon', 'Tomatoes', 'Sausage']
      };
    };
  });
});
