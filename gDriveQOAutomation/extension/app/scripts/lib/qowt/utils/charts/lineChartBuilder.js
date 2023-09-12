
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Line Chart Builder bundles together the information that
 * is necessary to render a given line chart. This information is returned as
 * an object by the builder's build() method and contains chart configuration
 * information as well as the actual data points that are to be plotted in the
 * chart. The returned object is in a format that can be used to render the
 * chart using the Google Chart API.
 *
 * A Builder module must provide a build() method in its public API and must
 * also register itself with the Chart Renderer
 * (qowtRoot/utils/charts/chartRenderer) when the builder module is loaded.
 * Using this pattern builder modules are effecively 'plugins' that
 * can be used by the Chart Renderer to render different types of charts.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

 define([
   'qowtRoot/utils/charts/chartUtils',
   'qowtRoot/utils/charts/chartRenderer',
   'qowtRoot/utils/charts/percentStackedChartBuilder'
   ],
   function(ChartUtils,ChartRenderer, PercentStackedChartBuilder) {

  'use strict';

    var _chartObj;

    var _api;

    _api = {

      /**
       * Chart Type Code
       * This is used by the Chart Renderer to access this builder
       */
      type: 'line',

      /**
       * Builds a bundle of information that is required to render the given
       * line chart and returns this information as an object.
       *
       * @param {object} chartData The chart data
       */
      build : function(chartData) {
        if(chartData) {
          _buildLineChart(chartData);
        }
        return _chartObj;
      }
  };

  var _buildLineChart = function(chartData) {
    _buildLineChartConfig();
    _buildLineChartData(chartData);
    if (chartData.subtype === 'pctStack') {
      PercentStackedChartBuilder.build(_chartObj);
    }
  };

  var _buildLineChartConfig = function() {
    _chartObj = ChartUtils.getDefaultChartConfig();
  };

  var _buildLineChartData = function(chartData) {
    ChartUtils.setYValueAxisPlot(chartData, _chartObj);
    ChartUtils.setChartTitle(chartData, _chartObj);
    ChartUtils.setMinAndMaxYAxisValues(chartData, _chartObj);
    ChartUtils.setMajorGridlines(chartData, _chartObj);
    ChartUtils.setMarkerVisibilityAndSize(chartData, _chartObj);
    _setChartType(chartData);
  };

  var _setChartType = function(chartData) {
    _chartObj.type = 'LineChart';
    if (chartData.subtype === 'stack' || chartData.subtype === 'pctStack') {
      // the workaround to support stacked line charts is to use a stacked area
      // chart with a transparent area
      _chartObj.type = 'AreaChart';
      _chartObj.options.isStacked = true;
      _chartObj.options.areaOpacity = 0.0;
    }
  };

  ChartRenderer.registerChartBuilder(_api);

  return _api;
});
