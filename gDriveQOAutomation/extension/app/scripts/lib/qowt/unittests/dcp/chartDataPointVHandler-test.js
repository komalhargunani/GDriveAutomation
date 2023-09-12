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
  'qowtRoot/dcp/chartDataPointVHandler',
  'qowtRoot/fixtures/chart/chartDataPointsFixture',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    ChartDataPointV,
    FIXTURES,
    DcpModel,
    ChartsModel) {

  'use strict';

  describe('chart data point V DCP Handle', function() {

    var handler;

    beforeEach(function() {
      DcpModel.dcpHandlingChart = 'chartId1';
      DcpModel.dcpHandlingSeries = 'seriesIdx1';

      // cache a chart object for the given chart, containing the given
      // series (with no data points)
      var chartObj = {data: []};
      chartObj.data[DcpModel.dcpHandlingSeries] = [];
      ChartsModel[DcpModel.dcpHandlingChart] = chartObj;

      handler = ChartDataPointV;
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

    it('should ignore the DCP if its element-type is not dpV', function() {
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

      var dataPointVDCP = FIXTURES.dataPointV();
      var result = handler.visit({el: dataPointVDCP});

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeUndefined();
    });

    it('should handle an undefined DcpModel.dcpHandlingSeries', function() {
      DcpModel.dcpHandlingSeries = undefined;

      var dataPointVDCP = FIXTURES.dataPointV();
      var result = handler.visit({el: dataPointVDCP});

      expect(result).toBeUndefined();
      var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
      expect(targetChart).toBeDefined();
      var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
      expect(targetSeries).toBeUndefined();
    });

    it('should handle an undefined v.el.val', function() {
      var v = {
        el: {
          etp: 'dpV',
          val: undefined
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

    it('should handle an undefined v.el.label (which is optional)',
        function() {
          var val = 5;
          var label;

          var v = {
            el: {
              etp: 'dpV',
              val: val,
              label: label
            }
          };
          var result = handler.visit(v);

          expect(result).toBeUndefined();
          var targetChart = ChartsModel[DcpModel.dcpHandlingChart];
          expect(targetChart).toBeDefined();
          var targetSeries = targetChart.data[DcpModel.dcpHandlingSeries];
          expect(targetSeries).toBeDefined();
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(1);
          var dataPoint = targetSeries[0];
          expect(dataPoint).toBeDefined();
          expect(dataPoint[0]).toBe(label);
          expect(dataPoint[1]).toBe(val);
        });

    it('should handle a chart id that is not present in ChartsModel',
        function() {
          var chartId = DcpModel.dcpHandlingChart;
          DcpModel.dcpHandlingChart = 'chartId8';

          var dataPointVDCP = FIXTURES.dataPointV();
          var result = handler.visit({el: dataPointVDCP});

          expect(result).toBeUndefined();
          var targetSeries = ChartsModel[chartId].data[
              DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(0);
        });

    it('should handle a cached chart object that has no data property',
        function() {
          ChartsModel[DcpModel.dcpHandlingChart] = {};

          var dataPointVDCP = FIXTURES.dataPointV();
          var result = handler.visit({el: dataPointVDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          expect(chartObj.data).toBeUndefined();
        });

    it('should handle a series idx that is not present in the chart ' +
        'series array', function() {
          DcpModel.dcpHandlingSeries = 'seriesIdx24';

          var dataPointVDCP = FIXTURES.dataPointV();
          var result = handler.visit({el: dataPointVDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          expect(targetSeries).toBeUndefined();
        });

    it('should successfully cache a data point in a series in ChartsModel',
        function() {
          var val = 23;
          var label = 'random value label';
          var dataPointVDCP = FIXTURES.dataPointV(val, label);
          var result = handler.visit({el: dataPointVDCP});

          expect(result).toBeUndefined();
          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(1);
          var dataPoint = targetSeries[0];
          expect(dataPoint).toBeDefined();
          expect(dataPoint[0]).toBe(label);
          expect(dataPoint[1]).toBe(val);
        });

    it('should successfully cache multiple data points in a series in ' +
        'ChartsModel', function() {
          var val1 = 8;
          var label1 = 'blah';
          var dataPointVDCP = FIXTURES.dataPointV(val1, label1);
          var result = handler.visit({el: dataPointVDCP});
          expect(result).toBeUndefined();
          var val2 = 57;
          var label2;
          dataPointVDCP = FIXTURES.dataPointV(val2, label2);
          result = handler.visit({el: dataPointVDCP});
          expect(result).toBeUndefined();
          var val3 = 31;
          var label3 = 'foobar';
          dataPointVDCP = FIXTURES.dataPointV(val3, label3);
          result = handler.visit({el: dataPointVDCP});
          expect(result).toBeUndefined();

          var chartObj = ChartsModel[DcpModel.dcpHandlingChart];
          var targetSeries = chartObj.data[DcpModel.dcpHandlingSeries];
          var numOfDataPoints = targetSeries.length;
          expect(numOfDataPoints).toBe(3);
          var dataPoint1 = targetSeries[0];
          expect(dataPoint1).toBeDefined();
          expect(dataPoint1[0]).toBe(label1);
          expect(dataPoint1[1]).toBe(val1);
          var dataPoint2 = targetSeries[1];
          expect(dataPoint2).toBeDefined();
          expect(dataPoint2[0]).toBe(label2);
          expect(dataPoint2[1]).toBe(val2);
          var dataPoint3 = targetSeries[2];
          expect(dataPoint3).toBeDefined();
          expect(dataPoint3[0]).toBe(label3);
          expect(dataPoint3[1]).toBe(val3);
        });
  });
});
