
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Scatter Chart Builder bundles together the information
 * that is necessary to render a given scatter chart. This information is
 * returned as an object by the builder's build() method and contains chart
 * configuration information as well as the actual data points that are to be
 * plotted in the chart. The returned object is in a format that can be used to
 * render the chart using the Google Chart API.
 *
 * A Builder module must provide a build() method in its public API and must
 * also register itself with the Chart Renderer
 * (qowtRoot/utils/charts/chartRenderer) when the builder module is loaded.
 * Using this pattern builder modules are effecively 'plugins' that can be
 * used by the Chart Renderer to render different types of charts.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

 define([
   'qowtRoot/utils/charts/chartUtils',
   'qowtRoot/utils/charts/chartRenderer'
   ],
   function(ChartUtils,ChartRenderer) {

  'use strict';

    var _chartObj,
      scatterLineStyle_ = 'lineMarker';

    var _api;

    _api = {

      /**
       * Chart Type Code
       * This is used by the Chart Renderer to access this builder
       */
      type: 'scat',

      /**
       * Builds a bundle of information that is required to render the given
       * scatter chart and returns this information as an object.
       *
       * @param {object} chartData The chart data
       */
      build : function(chartData) {
        if(chartData) {
          _buildScatterChart(chartData);
        }
        return _chartObj;
      }
    };

    var _buildScatterChart = function(chartData) {
      _buildScatterChartConfig();
      _buildScatterChartData(chartData);
    };

    var _buildScatterChartConfig = function() {
      _chartObj = ChartUtils.getDefaultChartConfig();
    };

    var _buildScatterChartData = function(chartData) {
      ChartUtils.setXYValueAxesPlot(chartData, _chartObj);
      ChartUtils.setChartTitle(chartData, _chartObj);
      ChartUtils.setMinAndMaxYAxisValues(chartData, _chartObj);
      ChartUtils.setMinAndMaxXAxisValues(chartData, _chartObj);
      ChartUtils.setMajorGridlines(chartData, _chartObj);
      ChartUtils.setMarkerVisibilityAndSize(chartData, _chartObj);
      _setChartType();
      _setScatterStyleType(chartData);
  };

  var _setChartType = function() {
    _chartObj.type = 'ScatterChart';
  };

  var _setScatterStyleType = function(chartData) {
    if (chartData.scattype === scatterLineStyle_) {
      _chartObj.options.type = 'line';
    }
  };

  ChartRenderer.registerChartBuilder(_api);

  return _api;
});
