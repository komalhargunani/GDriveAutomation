define([
  'qowtRoot/dcp/seriesHandler',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    SeriesHandler,
    DcpModel,
    ChartsModel) {

  'use strict';


  describe('Series DCP Handler', function() {

    var handler;

    beforeEach(function() {

      handler = SeriesHandler;

      DcpModel.dcpHandlingChart = 'chartId1';
      DcpModel.dcpHandlingSeries = 0;

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
    });

    it('should not store marker options if marker type is none', function() {
      var v = {
        el: {
          etp: 'csr',
          marker: {size: 5, sym: 'none'}
        }
      };
      handler.visit(v);
      assert.isUndefined(ChartsModel[DcpModel.dcpHandlingChart].options.series[
          DcpModel.dcpHandlingSeries].markerOptions, 'marker option should be' +
          ' undefined if marker type is none');
    });
  });
});
