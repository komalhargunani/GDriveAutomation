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
  'qowtRoot/dcp/chartDataPointXYHandler',
  'qowtRoot/fixtures/chart/chartDataPointsFixture',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    ChartDataPointXY,
    FIXTURES,
    DcpModel,
    ChartsModel) {

  'use strict';

  describe('chart data point XY DCP Handler', function() {

    var handler;

    beforeEach(function() {
      DcpModel.dcpHandlingChart = 'chartId1';
      DcpModel.dcpHandlingSeries = 'seriesIdx1';

      // cache a chart object for the given chart, containing the given
      // series (with no data points)
      var chartObj = {data: []};
      chartObj.data[DcpModel.dcpHandlingSeries] = [];
      ChartsModel[DcpModel.dcpHandlingChart] = chartObj;

      handler = ChartDataPointXY;
    });

    afterEach(function() {
      handler = undefined;
      ChartsModel[DcpModel.dcpHandlingChart] = undefined;
      DcpModel.dcpHandlingChart = undefined;
      DcpModel.dcpHandlingSeries = undefined;
    });

    it('should handle undefined', function() {
      var result = handler.visit(undefined);

      expect(result).toBeUndefined();
      var targetSeries = ChartsModel[DcpModel.dcpHandlingChart].data[
          DcpModel.dcpHandlingSeries];
      var numOfDataPoints = targetSeries.length;
      expect(numOfDataPoints).toBe(0);
    });

    it('should handle an undefined element in the data point DCP',
        function() {
          var v = {el: undefined};
          var result = handler.visit(v);

          expect(result).toBeUndefined();
          var targetSeries = ChartsModel[DcpModel.dcpHandlingChart].data[
              DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(0);
        });

    it('should handle an undefined element-type in the data point DCP',
        function() {
          var v = {
            el: {
              etp: undefined
            }
          };
          var result = handler.visit(v);

          expect(result).toBeUndefined();
          var targetSeries = ChartsModel[DcpModel.dcpHandlingChart].data[
              DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(0);
        });

    it('should ignore the DCP if its element-type is not dpXY', function() {
      var v = {
        el: {
          etp: 'blah'
        }
      };
      var result = handler.visit(v);

      expect(result).toBeUndefined();
      var targetSeries = ChartsModel[DcpModel.dcpHandlingChart].data[
          DcpModel.dcpHandlingSeries];
      var numOfDataPoints = targetSeries.length;
      expect(numOfDataPoints).toBe(0);
    });

    it('should handle an undefined DcpModel.dcpHandlingChart', function() {
      DcpModel.dcpHandlingChart = undefined;

      var dataPointXYDCP = FIXTURES.dataPointXY();
      var result = handler.visit({el: dataPointXYDCP});

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeUndefined();
    });

    it('should handle an undefined DcpModel.dcpHandlingSeries', function() {
      DcpModel.dcpHandlingSeries = undefined;

      var dataPointXYDCP = FIXTURES.dataPointXY();
      var result = handler.visit({el: dataPointXYDCP});

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeDefined();
      var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
      expect(targetSeries).toBeUndefined();
    });

    it('should handle an undefined v.el.x', function() {
      var v = {
        el: {
          etp: 'dpXY',
          x: undefined,
          y: 14
        }
      };
      var result = handler.visit(v);

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeDefined();
      var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
      expect(targetSeries).toBeDefined();
      var numOfDataPoints = targetSeries.length;
      expect(numOfDataPoints).toBe(0);
    });

    it('should handle an undefined v.el.y', function() {
      var v = {
        el: {
          etp: 'dpXY',
          x: 8,
          y: undefined
        }
      };
      var result = handler.visit(v);

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeDefined();
      var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
      expect(targetSeries).toBeDefined();
      var numOfDataPoints = targetSeries.length;
      expect(numOfDataPoints).toBe(0);
    });

    it('should handle an undefined v.el.x and an undefined v.el.y',
        function() {
          var v = {
            el: {
              etp: 'dpXY',
              x: undefined,
              y: undefined
            }
          };
          var result = handler.visit(v);

          expect(result).toBeUndefined();
          var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
          expect(targetChart).toBeDefined();
          var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
          expect(targetSeries).toBeDefined();
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(0);
        });

    it('should handle a chart id that is not present in ChartsModel',
        function() {
          var chartId = DcpModel.dcpHandlingChart;
          DcpModel.dcpHandlingChart = 'chartId8';

          var dataPointXYDCP = FIXTURES.dataPointXY();
          var result = handler.visit({el: dataPointXYDCP});

          expect(result).toBeUndefined();
          var targetSeries = ChartsModel[chartId].data[
              DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(0);
        });

    it('should handle a cached chart object that has no data property',
        function() {
          ChartsModel[DcpModel.dcpHandlingChart] = {};

          var dataPointXYDCP = FIXTURES.dataPointXY();
          var result = handler.visit({el: dataPointXYDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          expect(chartObj.data).toBeUndefined();
        });

    it('should handle a series idx that is not present in the chart ' +
        'series array', function() {
          DcpModel.dcpHandlingSeries = 'seriesIdx24';

          var dataPointXYDCP = FIXTURES.dataPointXY();
          var result = handler.visit({el: dataPointXYDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          expect(targetSeries).toBeUndefined();
        });

    it('should successfully cache a data point in a series in ChartsModel',
        function() {
          var xVal = 9;
          var yVal = 43;
          var dataPointXYDCP = FIXTURES.dataPointXY(xVal, yVal);
          var result = handler.visit({el: dataPointXYDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(1);
          var dataPoint = targetSeries[0];
          expect(dataPoint).toBeDefined();
          expect(dataPoint[0]).toBe(xVal);
          expect(dataPoint[1]).toBe(yVal);
        });

    it('should successfully cache multiple data points in a series in ' +
        'ChartsModel', function() {
          var xVal1 = 94;
          var yVal1 = 41;
          var dataPointXYDCP = FIXTURES.dataPointXY(xVal1, yVal1);
          var result = handler.visit({el: dataPointXYDCP});
          expect(result).toBeUndefined();
          var xVal2 = 68;
          var yVal2 = 12;
          dataPointXYDCP = FIXTURES.dataPointXY(xVal2, yVal2);
          result = handler.visit({el: dataPointXYDCP});
          expect(result).toBeUndefined();
          var xVal3 = 33;
          var yVal3 = 97;
          dataPointXYDCP = FIXTURES.dataPointXY(xVal3, yVal3);
          result = handler.visit({el: dataPointXYDCP});
          expect(result).toBeUndefined();

          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(3);
          var dataPoint1 = targetSeries[0];
          expect(dataPoint1).toBeDefined();
          expect(dataPoint1[0]).toBe(xVal1);
          expect(dataPoint1[1]).toBe(yVal1);
          var dataPoint2 = targetSeries[1];
          expect(dataPoint2).toBeDefined();
          expect(dataPoint2[0]).toBe(xVal2);
          expect(dataPoint2[1]).toBe(yVal2);
          var dataPoint3 = targetSeries[2];
          expect(dataPoint3).toBeDefined();
          expect(dataPoint3[0]).toBe(xVal3);
          expect(dataPoint3[1]).toBe(yVal3);
        });
  });
});

