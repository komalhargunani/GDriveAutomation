/**
 * Utility object for charts
 *
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/models/charts'
  ], function(
       UnitConversionUtils, ChartsModel) {

  'use strict';

  var _api = {

    /**
     *
     * Utility method to get the default configuration settings for a chart.
     * This may include settings such as whether a legend is displayed by
     * default.
     *
     * @return {object} An object containing the default chart configuration
     *                  settings
     */
    getDefaultChartConfig: function() {
      var chartConfig = {

        options: {

          hAxis: { viewWindow: {}, gridlines: {} },

          vAxis: { viewWindow: {}, gridlines: {} },

          // The colors to use for the chart elements
          colors: ChartsModel.colors,

          series: {},

          // The background color of chart
          // if ChartsModel.backgroundColor value is undefined then it
          // fallbacks to default color(white).
          backgroundColor: ChartsModel.backgroundColor
        }
      };

      return chartConfig;
    },

    /**
     * Utility method to set the marker size of a chart series,
     * for use when rendering the chart.
     *
     * @param {number} size A number indicating the marker size in POINTS.
     *             see "http://www.quickoffice.com/ChartSeries-element-schema".
     * @param {object} seriesOptions An object containing a 'markerOptions'
     *                 property, which is an itself an object.
     */
    setMarkerSize: function(size, seriesOptions) {
      seriesOptions.markerOptions.size = size;
    },

    /**
     * Utility method to specify whether or not to display the markers of a
     * chart series for use when rendering the chart.
     *
     * @param {boolean} doShow A flag indicating whether or not the markers of
     *  this series should be displayed. True if they should, otherwise false.
     *
     * @param {object} seriesOptions An object containing a 'markerOptions'
     *                               property, which is an itself an object.
     */
    setMarkerVisibility: function(doShow, seriesOptions) {
      seriesOptions.markerOptions.show = doShow;
    },

    /**
     *
     * Utility method to set the title of a chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with the
     *                             chart title
     */
    setChartTitle : function(chartData, refChartObj) {
      if(chartData.options && chartData.options.title) {
        refChartObj.options.title = chartData.options.title.text;
      }
    },

    /**
     *
     * Utility method to set the min and max X-axis values of a chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with the
     *                             min and max X-axis values
     */
    setMinAndMaxXAxisValues : function(chartData, refChartObj) {
      // set the min and max axis values if they are explicitly defined
      _setExplicitMinAndMaxXValues(chartData, refChartObj);

      // if the min and/or max axis values have not been explicitly defined
      // then set them using the min and max data points
      if((!refChartObj.options.hAxis.viewWindow.max ||
          !refChartObj.options.hAxis.viewWindow.min) &&
          (refChartObj.data.length > 0)) {

        var rangeObj = {min:0, max:0};
        _extractMinAndMaxDataPoints(chartData, refChartObj, rangeObj);

        if(!refChartObj.options.hAxis.viewWindow.min) {
          refChartObj.options.hAxis.viewWindow.min = rangeObj.min;
        }
        if(!refChartObj.options.hAxis.viewWindow.max) {
          // if the max value is divisible by 10 then add 1, to get GViz to
          // actually show it
          refChartObj.options.hAxis.viewWindow.max =
            (rangeObj.max%10 === 0 ? rangeObj.max+1: rangeObj.max);
        }
      }
    },

    /**
     *
     * Utility method to set the min and max Y-axis values of a chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with the
     *                             min and max Y-axis values
     */
    setMinAndMaxYAxisValues : function(chartData, refChartObj) {
      // set the min and max axis values if they are explicitly defined
      _setExplicitMinAndMaxYValues(chartData, refChartObj);

      // if the min and/or max axis values have not been explicitly defined
      // then set them using the min and max data points
      if((!refChartObj.options.vAxis.viewWindow.max ||
          !refChartObj.options.vAxis.viewWindow.min) &&
          (refChartObj.data.length > 0)) {

        var rangeObj = {min:0, max:0};
        _extractMinAndMaxDataPoints(chartData, refChartObj, rangeObj);

        if(!refChartObj.options.vAxis.viewWindow.min) {
          refChartObj.options.vAxis.viewWindow.min = rangeObj.min;
        }
        if(!refChartObj.options.vAxis.viewWindow.max) {
          // if the max value is divisible by 10 then add 1, to get GViz to
          // actually show it
          refChartObj.options.vAxis.viewWindow.max =
            (rangeObj.max%10 === 0 ? rangeObj.max+1: rangeObj.max);
        }
      }
    },

    /**
     *
     * Utility method to set the visibility and count of the gridlines in a
     * chart
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with
     *                             the gridline configuration
     */
    setMajorGridlines : function(chartData, refChartObj) {
      // to hide the major gridlines note that instead of setting
      // 'gridlines.count' to 0 - which results in the axis not being shown at
      // all - we set 'gridlines.color' to white which is the background color
      // of the chart and so the gridlines become invisible
      if(!chartData.options || !chartData.options.axes ||
          !chartData.options.axes.yaxis ||
          !chartData.options.axes.yaxis.showMajorGridline) {
        refChartObj.options.vAxis.gridlines.color = '#FFF';
      }
      if(!chartData.options || !chartData.options.axes ||
          !chartData.options.axes.xaxis ||
          !chartData.options.axes.xaxis.showMajorGridline) {
        refChartObj.options.hAxis.gridlines.color = '#FFF';
      }

      // if the major axis unit is defined then calculate how many grid lines
      // are required to represent this (the axis is counted as 1 gridline)
      var maxAxisValue, minAxisValue, majorUnit;
      if(chartData.options && chartData.options.axes &&
          chartData.options.axes.yaxis && chartData.options.axes.yaxis.major) {
        maxAxisValue = refChartObj.options.vAxis.viewWindow.max;
        minAxisValue = refChartObj.options.vAxis.viewWindow.min;
        majorUnit = chartData.options.axes.yaxis.major;
        refChartObj.options.vAxis.gridlines.count =
          Math.ceil(Math.abs((maxAxisValue - minAxisValue) / majorUnit));
      }
      if(chartData.options && chartData.options.axes &&
          chartData.options.axes.xaxis && chartData.options.axes.xaxis.major) {
        maxAxisValue = refChartObj.options.hAxis.viewWindow.max;
        minAxisValue = refChartObj.options.hAxis.viewWindow.min;
        majorUnit = chartData.options.axes.xaxis.major;
        refChartObj.options.hAxis.gridlines.count =
          Math.ceil(Math.abs((maxAxisValue - minAxisValue) / majorUnit));
      }
    },

    /**
     *
     * Utility method to set the plot data for a chart that has no value axis,
     * for example, a PIE chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with the
     *                             data points
     */
    setNoValueAxisPlot : function(chartData, outChartObj) {
      // A 2D array is used to contain the chart 'data table'.
      // If chart data is empty then to render empty chart, chart library
      // requires atleast two 2D array with default values set so it can
      // renders default axes.
      var data = [
        ['', ''],
        ['', 0]
      ];

      // iterate over the series
      if(chartData.data) {
        for(var seriesIdx = 0; seriesIdx < chartData.data.length; seriesIdx++) {

          if(chartData.options && chartData.options.series &&
              chartData.options.series[seriesIdx]) {
            // add the label for this series to the data table
            var label = chartData.options.series[seriesIdx].label ?
              chartData.options.series[seriesIdx].label : "";
            data[0][seriesIdx+1] = label;
          }

          for(var y = 0; y < chartData.data[seriesIdx].length; y++) {
            // add this data point of this series to the data table
            data[y+1]=[];
            // prepareNoValueAxisPlot is used only by pie chart and it means
            // there's only one series so we can always put the data point
            // labels into column '0'
            data[y+1][0]=chartData.data[seriesIdx][y][0];
            data[y+1][seriesIdx+1]=chartData.data[seriesIdx][y][1];
          }
        }
      }

      outChartObj.data = data;
    },

    /**
     *
     * Utility method to set the plot data for a chart that has values on the
     * X-axis for example, a BAR chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with
     *                             the data points
     */
    setXValueAxisPlot : function(chartData, refChartObj) {
      // A 2D array is used to contain the chart 'data table'.
      // In this 2D array there is a row for each category and a column for
      // each series. If chart data is empty then to render empty chart, chart
      // library requires atleast two 2D array with default values set so it
      // can renders default axes.
      var data = [
        ['', ''],
        [0, 0]
      ], numOfCats;

      // add the category labels to the data table
      if(chartData.categories) {
        numOfCats = chartData.categories.length;
        for(var i = 0; i < numOfCats; i++) {
          data[numOfCats-i]=[];
          data[numOfCats-i][0]=chartData.categories[i];
        }
      }
      else if(chartData.data) {
        // category labels not available for the chart so set it as empty string
        // this is required since we map the data points of every series with
        // respective category in the data table.
        numOfCats = chartData.data.length;
        for(var cat = 0; cat < numOfCats; cat++) {
          data[numOfCats-cat] = [];
          data[numOfCats-cat][0] = '';
        }
      }

      // iterate over the series
      if(chartData.data) {
        refChartObj.options.series = refChartObj.options.series || {};
        var numOfColors = ChartsModel.colors.length;
        var numOfSeries = chartData.data.length;
        var colorIdx, seriesObj;
        for(var seriesIdx = 0; seriesIdx < numOfSeries; seriesIdx++) {

          if(chartData.options && chartData.options.series &&
            chartData.options.series[seriesIdx]) {
            // add the label for this series to the data table
            var label = chartData.options.series[seriesIdx].label ?
              chartData.options.series[seriesIdx].label : "";
            // GViz handles the stacked and clustered bar charts somehow
            // differently so need to have the if here
            if(chartData.subtype === 'stack' ||
                chartData.subtype === 'pctStack') {
                data[0][seriesIdx+1] = label;
            } else {
                data[0][numOfSeries-seriesIdx] = label;
            }
          }

          var numOfDataPts = chartData.data[seriesIdx].length;
          for(var j = 0; j < numOfDataPts; j++) {
            // add this data point of this series to the data table
            // GViz handles the stacked and clustered bar charts somehow
            // differently so need to have the if here
            if(chartData.subtype === 'stack' ||
                chartData.subtype === 'pctStack') {
                data[numOfDataPts-j][seriesIdx+1]=
                  chartData.data[seriesIdx][j][1];
            } else {
                data[numOfDataPts-j][numOfSeries-seriesIdx]=
                  chartData.data[seriesIdx][j][1];
            }
          }

          // explicitly set the color to use for the series, as without doing
          // this the colors are used in the wrong order for a chart with
          // values on the X axis
          // GViz handles the stacked and clustered bar charts somehow
          // differently so need to have the if here
            if(chartData.subtype !== 'stack' &&
                chartData.subtype !== 'pctStack') {
              colorIdx = (seriesIdx < numOfColors) ?
                seriesIdx : (seriesIdx%numOfColors);
              seriesObj = {};
              seriesObj.color = ChartsModel.colors[colorIdx];
              refChartObj.options.series[numOfSeries-seriesIdx-1] = seriesObj;
            }
        }
      }

      refChartObj.data = data;
    },

    /**
     *
     * Utility method to set the plot data for a chart that has values on the
     * Y-axis
     * for example, a LINE chart or COLUMN chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with
     *                             the data points
     */
    setYValueAxisPlot : function(chartData, refChartObj) {
      // A 2D array is used to contain the chart 'data table'.
      // In this 2D array there is a row for each category and a column for
      // each series. If chart data is empty then to render empty chart, chart
      // library requires atleast two 2D array with default values set so it
      // can renders default axes.
      var data = [
        ['', ''],
        [0, 0]
      ];

      // add the category labels to the data table
      if(chartData.categories) {
        for(var i = 0; i < chartData.categories.length; i++) {
          data[i+1]=[];
          data[i+1][0]=chartData.categories[i];
        }
      }
      // Check if there is any series available before setting category
      // labels based on it
      else if(chartData.data && chartData.data.length > 0) {
        for(var j = 0; j < chartData.data[0].length; j++) {
          data[j+1]=[];
          data[j+1][0]='';
        }
      }

      // iterate over the series
      if(chartData.data) {
        for(var seriesIdx = 0; seriesIdx < chartData.data.length; seriesIdx++) {

          if(chartData.options && chartData.options.series &&
              chartData.options.series[seriesIdx]) {
            // add the label for this series to the data table
            var label = chartData.options.series[seriesIdx].label ?
              chartData.options.series[seriesIdx].label : "";
            data[0][seriesIdx+1] = label;
          }

          for(var y = 0; y < chartData.data[seriesIdx].length; y++) {
            // add this data point of this series to the data table
            data[y+1][seriesIdx+1]=chartData.data[seriesIdx][y][1];
          }
        }
      }

      refChartObj.data = data;
    },

    /**
     *
     * Utility method to set the plot data for a chart that has two value axes
     * (both the X axis and the Y axis), for example, a SCATTER chart.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with the
     *                             data points
     */
    setXYValueAxesPlot : function(chartData, outChartObj) {
      // A 2D array is used to contain the chart 'data table'.
      // If chart data is empty then to render empty chart, chart library
      // requires atleast two 2D array with default values set so it can
      // renders default axes.
      var data = [
        ['', ''],
        [0, 0]
      ];

      // iterate over the series
      var nextRow = 1;
      if(chartData.data) {
        for(var seriesIdx = 0; seriesIdx < chartData.data.length; seriesIdx++) {

          if(chartData.options && chartData.options.series &&
              chartData.options.series[seriesIdx]) {
            // add the label for this series to the data table
            var label = chartData.options.series[seriesIdx].label ?
              chartData.options.series[seriesIdx].label : "";
            data[0][seriesIdx+1] = label;
          }

          for(var y = 0; y < chartData.data[seriesIdx].length; y++) {
            // add this data point of this series to the data table
            data[nextRow] = [];
            for(var z = 0; z <= chartData.data.length; z++) {
              data[nextRow][z] = undefined;
            }
            data[nextRow][0] = chartData.data[seriesIdx][y][0];
            data[nextRow][seriesIdx+1] = chartData.data[seriesIdx][y][1];
            nextRow++;
          }
        }
      }

      outChartObj.data = data;
    },

    /**
     *
     * Utility method to set the visibility and the size of the markers.
     *
     * @param {object} chartData An object containing the chart data
     * @param {object} outChartObj A reference to the object to update with
     *                             the data points
     */
    setMarkerVisibilityAndSize : function(chartData, outChartObj) {
      if(chartData.options && chartData.options.series) {
        var i;
        var numOfSeries = chartData.options.series.length;
        for (i = 0; i < numOfSeries; i++) {
          if(chartData.options.series[i].markerOptions &&
              chartData.options.series[i].markerOptions.show) {
            // we want to display the data point markers of this series, and
            // with the specified diameter size
            // convert size from points units to pixel units
            var size = UnitConversionUtils.
            convertPointToPixel(chartData.options.series[i].markerOptions.size);
            outChartObj.options.series[i] = {pointSize: size};
          }
        }
      }
    }
  };

  var _setExplicitMinAndMaxXValues = function(chartData, refChartObj) {
    if(chartData.options && chartData.options.axes &&
        chartData.options.axes.xaxis) {
      var maxVal = chartData.options.axes.xaxis.max;
      if(maxVal) {
        // if the max value is divisible by 10 then add 1, to get GViz to
        // actually show it
        refChartObj.options.hAxis.viewWindow.max =
          (maxVal%10 === 0 ? maxVal+1 : maxVal);
      }
      var minVal = chartData.options.axes.xaxis.min;
      if(minVal) {
        refChartObj.options.hAxis.viewWindow.min = minVal;
      }
    }
  };

  var _setExplicitMinAndMaxYValues = function(chartData, refChartObj) {
    if(chartData.options && chartData.options.axes &&
        chartData.options.axes.yaxis) {
      var maxVal = chartData.options.axes.yaxis.max;
      if(maxVal) {
        // if the max value is divisible by 10 then add 1, to get GViz to
        // actually show it
        refChartObj.options.vAxis.viewWindow.max =
          (maxVal%10 === 0 ? maxVal+1 : maxVal);
      }
      var minVal = chartData.options.axes.yaxis.min;
      if(minVal) {
        refChartObj.options.vAxis.viewWindow.min = minVal;
      }
    }
  };

  var _extractMinAndMaxDataPoints = function(chartData, refChartObj,
                                             rangeObj) {
    var min = 0, max = 0;
    var row, col, z, seriesMax = 0, accumulatedSeriesMax = 0;
     // subtract 1 for the column that contains the category labels
    var numDataPointsPerSeries =  refChartObj.data.length - 1;
    // subtract 1 for the row that contains the series names
    var numSeries = refChartObj.data[0].length - 1;

    // starts at column 1 because 0 has the category labels
    for(col = 1; col <= numSeries; col++) {
      // starts at row 1 because 0 has the series names
      for(row = 1; row <= numDataPointsPerSeries; row++) {
        z = refChartObj.data[row][col];
        if(z < min) {
          min = z;
        }
        if(z > max) {
          max = z;
        }
        if(max > seriesMax) {
          seriesMax = max;
        }
      }
      accumulatedSeriesMax += seriesMax;
    }

    if(chartData.subtype === 'stack') {
      // for a stacked chart the max is the accumulated max of all of the
      // series
      max = accumulatedSeriesMax;
    }

    // if the min value is +ive then lets use 0 as the min axis value
    // (this is important as GViz sometimes cuts the bottom of a chart
    // below the lowest data point)
    if(min > 0) {
      min = 0;
    }
    // if the max value is -ive then lets use 0 as the max axis value
    if(max < 0) {
      max = 0;
    }

    rangeObj.min = min;
    rangeObj.max = max;
  };

  return _api;
});
