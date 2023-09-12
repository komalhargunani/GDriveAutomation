// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview The Pie Chart Builder bundles together the information that is
 * necessary to render a given pie chart. This information is returned as an
 * object by the builder's build() method and contains chart configuration
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
  'qowtRoot/utils/charts/chartRenderer'], function(
    ChartUtils,
    ChartRenderer) {

  'use strict';

  var _chartObj; // **** is this safe, i.e. inside closure?
  var _api;

  _api = {

    /**
     * Chart Type Code
     * This is used by the Chart Renderer to access this builder
     */
    type: 'pie',

    /**
     * Builds a bundle of information that is required to render the given pie
     * chart and returns this information as an object.
     *
     * @param {object} chartData The chart data
     */
    build: function(chartData) {
      if(chartData) {
        _buildPieChart(chartData);
      }
      return _chartObj;
    }
  };

  var _buildPieChart = function(chartData) {
      _buildPieChartConfig();
      _buildPieChartData(chartData);
    };

  var _buildPieChartConfig = function() {
      _chartObj = ChartUtils.getDefaultChartConfig();
    };

  var _buildPieChartData = function(chartData) {
      // prepare data points
      ChartUtils.setNoValueAxisPlot(chartData, _chartObj);
      ChartUtils.setChartTitle(chartData, _chartObj);
      _setChartType();
    };

  var _setChartType = function() {
      _chartObj.type = 'PieChart';
      // show value instead of percentage which is shown by default
      _chartObj.options.pieSliceText = 'value';
    };

  ChartRenderer.registerChartBuilder(_api);

  return _api;
});
