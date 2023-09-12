
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Chart Renderer uses the Google Charts API to render
 * charts. It uses various 'chart builder' modules (which register themselves
 * with the Chart Renderer and thus act as plugins to it) to gather the
 * information that is required by the Google Charts API to render different
 * types of charts.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

 define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/models/charts',
  'qowtRoot/third_party/gviz/gviz_corechart_module'
  ], function(
    ErrorCatcher,
    ChartsModel) {

  'use strict';

    var kPlot_Node = {
      Tag:'div',
      Class:'qowt-chart-plot-container'
    };

    var _builders = {};

    var _api = {

      /*
       * Allows a Chart Builder to register itself with the Chart Renderer
       *
       * @param {object} builder A chart builder api object
       */
      registerChartBuilder : function(builder) {
        if(builder && builder.type) {
          _builders[builder.type] = builder;
        }
        else {
          console.error('Could not register Chart Builder because it does ' +
                        'not have a type property');
        }
      },

      /*
       * Checks whether there is a registered Chart Builder for the specified
       * chart type
       *
       * @param {string} type A chart type, for example, 'line'
       */
      isBuilderRegistered : function(type) {
        return (type && _builders[type]) ? true : false;
      },

      /*
       * Renders the given chart to the given location in the HTML DOM
       *
       * @param {object} containerDiv The container where the chart is to be
       *                              rendered
       * @param {string} chartId The id of the chart that is to be rendered
       */
      render : function(containerDiv, chartId) {
        var chartData = ChartsModel[chartId];

        if(chartData && containerDiv) {

          // initialise the plot div
          var plotDiv;
          if (containerDiv.children.length === 0) {
            plotDiv = document.createElement(kPlot_Node.Tag);
            plotDiv.id = 'plot_' + chartId;
            plotDiv.classList.add(kPlot_Node.Class);
            containerDiv.appendChild(plotDiv);
          }
          else {
            plotDiv = containerDiv.children[0];
          }

          // ask the relevant chart builder to build the information for this
          // chart
          var chartObj;
          var builder = _builders[chartData.type];
          if (builder && builder.build) {
            chartObj = builder.build(chartData);

            try {
/*jsl:ignore*/

              // now use the gViz library to render the chart
              var dataTable =
                google.visualization.arrayToDataTable(chartObj.data);
              var chart;
              switch(chartObj.type) {
                case 'BarChart':
                  chart = new google.visualization.BarChart(plotDiv);
                  break;
                case 'ColumnChart':
                  chart = new google.visualization.ColumnChart(plotDiv);
                  break;
                case 'LineChart':
                  chart = new google.visualization.LineChart(plotDiv);
                  break;
                case 'AreaChart':
                  // area charts are only used as a workaround for stacked
                  // line charts
                  chart = new google.visualization.AreaChart(plotDiv);
                  break;
                case 'PieChart':
                  chart = new google.visualization.PieChart(plotDiv);
                  break;
                case 'ScatterChart':
                  chart = new google.visualization.ScatterChart(plotDiv);
                  break;
              }
              if(chart) {
                chart.draw(dataTable, chartObj.options);
                chartData.rendered = true;
              }
/*jsl:END*/
            }
            catch(ex) {
              console.log(ex);
              ex.silent = true;
              ex.fatal = false;
              ErrorCatcher.handleError(ex);
            }
          }
        }
      }
    };

    return _api;
  });
