
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The percent Stacked Chart Builder bundles together the
 * information that is necessary to render a given percent Stacked chart.
 *
 * @author rasika.tandale@google.com (Lorraine Martin)
 */

define([],
   function() {

  'use strict';

    var _api = {

      /**
       * Builds the data and configuration for 100% stacked chart
       * @param {object} chartObj The chart data
       */
      build: function(chartObj) {
        _buildConfig(chartObj);
        _buildData(chartObj);
      }
    };

     /**
      * Builds the configuration required for the given percent stacked chart
      * @param chartData The chart Data
      */
     var _buildConfig = function(chartObj) {
       chartObj.options[_chartAxisMap[chartObj.type]].viewWindow.max = 1;
       chartObj.options[_chartAxisMap[chartObj.type]].format = '#%';
       return chartObj;
     };

     /**
      * Builds the data required to render the given percent stacked chart
      * @param chartData The chart Data
      */
     var _buildData = function(chartData) {

       var dataArr = chartData.data;
       var chartType = chartData.type;

       for (var i = 1; i < dataArr.length; i++) {
         var data = dataArr[i];

         var total = 0;
         for (var j1 = 1; j1 < data.length; j1++) {
           total = total + data[j1];
         }

         if (chartType === "LineChart") {
           for (var j2 = 2; j2 < data.length; j2++) {
             data[j2] = (data[j2] + data[j2 - 1]);
           }
         }

         for (var j = 1; j < data.length; j++) {
           data[j] = (data[j] / total);
         }
       }
     };

     /**
      * map of the chart type to the Axis - required for percent stacked chart
      * settings.
      */
     var _chartAxisMap = {
        'BarChart' : 'hAxis',
       'ColumnChart' : 'vAxis',
       'LineChart' : 'vAxis',
       'AreaChart' : 'vAxis'
     };


    return _api;
});
