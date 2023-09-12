/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/dcp/seriesHandler',
  'qowtRoot/fixtures/chart/chartSeriesFixture',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    SeriesHandler,
    Fixtures,
    DcpModel,
    ChartsModel) {

  'use strict';


  describe('Series DCP Handler', function() {

    var handler;

    beforeEach(function() {

      handler = SeriesHandler;

      DcpModel.dcpHandlingChart = 'chartId1';
      DcpModel.dcpHandlingSeries = 0;
      ChartsModel.markersInUse = [];

      // cache a chart object for the given chart, containing an empty
      // array of series
      ChartsModel[DcpModel.dcpHandlingChart] = {
        options: {
          series: [],
          title: {text: 'Title'}
        }
      };
    });

    afterEach(function() {
      handler = undefined;
      ChartsModel[DcpModel.dcpHandlingChart] = undefined;
      DcpModel.dcpHandlingChart = undefined;
      DcpModel.dcpHandlingSeries = undefined;
      ChartsModel.markersInUse = undefined;
    });

    it('should handle undefined passed to its visit() method', function() {
      var result = handler.visit(undefined);

      expect(result).toBeUndefined();
    });

    it('should handle an undefined element in the series DCP', function() {
      var v = {el: undefined};
      var result = handler.visit(v);

      expect(result).toBeUndefined();
    });

    it('should handle an undefined element-type in the series DCP',
        function() {
          var v = {
            el: {
              etp: undefined
            }
          };
          var result = handler.visit(v);

          expect(result).toBeUndefined();
        });

    it('should ignore the series DCP if its element-type is not csr',
        function() {
          var v = {
            el: {
              etp: 'blah'
            }
          };
          var result = handler.visit(v);

          expect(result).toBeUndefined();
        });

    it('should ignore the series DCP if the series idx that it belongs ' +
        'to is not known', function() {
          var v = {
            el: {
              etp: 'csr'
            }
          };

          DcpModel.dcpHandlingSeries = undefined;

          var result = handler.visit(v);

          expect(result).toBeUndefined();
        });

    it('should prepare the store for the data points of this series in ' +
        'the Charts Model', function() {
          // mimic what the ChartHandler would already have done
          ChartsModel[DcpModel.dcpHandlingChart].data = [];

          var v = {
            el: {
              etp: 'csr'
            }
          };
          handler.visit(v);

          expect(ChartsModel[DcpModel.dcpHandlingChart].data[
              DcpModel.dcpHandlingSeries]).toEqual([]);
        });

    it('should store the specified series label if one is specified in ' +
        'the DCP', function() {
          var v = {
            el: {
              etp: 'csr',
              label: 'Series1'
            }
          };
          handler.visit(v);

          expect(ChartsModel[DcpModel.dcpHandlingChart].options.series[
              DcpModel.dcpHandlingSeries].label).toBe(v.el.label);
        });

    it('should store the specified series marker info if one is specified' +
        ' in the DCP', function() {
          var v = {
            el: {
              etp: 'csr',
              marker: {size: 5}
            }
          };
          handler.visit(v);

          expect(ChartsModel[DcpModel.dcpHandlingChart].options.series[
              DcpModel.dcpHandlingSeries].markerOptions.show).toBe(true);
          expect(ChartsModel[DcpModel.dcpHandlingChart].options.series[
              DcpModel.dcpHandlingSeries].markerOptions.size).toBe(5);
        });

    it('should handle a series without label', function() {

      var seriesDCP = Fixtures.seriesWithoutLabel();

      var v = {el: seriesDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.series[
          DcpModel.dcpHandlingSeries];
      expect(result).toBeDefined();
      expect(result.label).not.toBeDefined();
    });

    it('should handle a series without marker', function() {

      var seriesDCP = Fixtures.seriesWithoutMarkers();

      expect(DcpModel.dcpHandlingChart).toBeDefined();
      expect(ChartsModel[DcpModel.dcpHandlingChart]).toBeDefined();

      var v = {el: seriesDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.series[
          DcpModel.dcpHandlingSeries];
      expect(result).toBeDefined();
      expect(result.label).toBe('North');
      expect(result.markerOptions).toBe(undefined);
    });
  });
});
