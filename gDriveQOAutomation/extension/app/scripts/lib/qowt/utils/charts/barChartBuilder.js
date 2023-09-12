
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Bar Chart Builder bundles together the information that is
 * necessary to render a given bar chart. This information is returned as an
 * object by the builder's build() method and contains chart configuration
 * information as well as the actual data points that are to be plotted in the
 * chart. The returned object is in a format that can be used to render the
 * chart using the Google Chart API.
 *
 * A Builder module must provide a build() method in its public API and must
 * also register itself with the Chart Renderer (qowtRoot/utils/charts/
 * chartRenderer) when the builder module is loaded. Using this pattern builder
 * modules are effecively 'plugins' that can be used by the Chart Renderer to
 * render different types of charts.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

 define([
   'qowtRoot/utils/charts/chartUtils',
   'qowtRoot/utils/charts/chartRenderer',
   'qowtRoot/utils/charts/percentStackedChartBuilder'
   ],
   function(ChartUtils, ChartRenderer, PercentStackedChartBuilder) {

  'use strict';

    var _chartObj;

    var _api = {

      /**
       * Chart Type Code
       * This is used by the Chart Renderer to access this builder
       */
      type: 'bar',

      /**
       * Builds a bundle of information that is required to render the given
       * bar chart and returns this information as an object.
       *
       * @param {object} chartData The chart data
       */
      build : function(chartData) {
        if(chartData) {
          _buildBarChart(chartData);
        }
        return _chartObj;
      }
    };

    var _buildBarChart = function(chartData) {
      _buildBarChartConfig();
      _buildBarChartData(chartData);
      if(chartData.subtype === 'pctStack'){
        PercentStackedChartBuilder.build(_chartObj);
      }
    };

    var _buildBarChartConfig = function() {
      _chartObj = ChartUtils.getDefaultChartConfig();
    };   

    var _buildBarChartData = function(chartData) {
      ChartUtils.setXValueAxisPlot(chartData, _chartObj);
      ChartUtils.setChartTitle(chartData, _chartObj);
      ChartUtils.setMinAndMaxXAxisValues(chartData, _chartObj);
      ChartUtils.setMajorGridlines(chartData, _chartObj);
      _setChartType(chartData);
    };

    var _setChartType = function(chartData) {
      _chartObj.type = 'BarChart';
      if (chartData.subtype === 'stack' || chartData.subtype === 'pctStack') {
        _chartObj.options.isStacked = true;
      } 
    };

    ChartRenderer.registerChartBuilder(_api);

    return _api;
});
