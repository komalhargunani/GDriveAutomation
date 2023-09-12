define([
  'qowtRoot/dcp/chartHandler',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts',
  'qowtRoot/variants/configs/common'
], function(
    ChartHandler,
    DcpModel,
    ChartsModel,
    CommonConfig) {

  'use strict';

  describe('Chart DCP Handler', function() {

    var handler, chartId = 'chartId1';

    beforeEach(function() {
      handler = ChartHandler;
    });

    afterEach(function() {
      handler = undefined;
      delete ChartsModel[chartId];
    });

    it('should handle undefined passed to its visit() method', function() {
      handler.visit(undefined);

      expect(DcpModel.dcpHandlingChart).toBeUndefined();
    });

    it('should handle an undefined element in the chart DCP', function() {
      var v = {el: undefined};
      handler.visit(v);

      expect(DcpModel.dcpHandlingChart).toBeUndefined();
    });

    it('should handle an undefined element-type in the chart DCP',
        function() {
          var v = {
            el: {
              etp: undefined
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeUndefined();
        });

    it('should ignore the chart DCP if its element-type is not cht',
        function() {
          var v = {
            el: {
              etp: 'blah'
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeUndefined();
        });

    it('should ignore the chart DCP if it contains no chart id',
        function() {
          var v = {
            el: {
              etp: 'cht'
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeUndefined();
        });

    it('should store the chart information from the DCP in the Charts ' +
        'Model', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart]).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart].data).toEqual([]);
          expect(ChartsModel[DcpModel.dcpHandlingChart].options).toEqual(
              {series: []});
          expect(ChartsModel[DcpModel.dcpHandlingChart].type).toBe(v.el.type);
          expect(ChartsModel[DcpModel.dcpHandlingChart].subtype).toBe(
              v.el.subt);
          expect(ChartsModel[DcpModel.dcpHandlingChart].categories).toBe(
              v.el.cats);
        });

    it('should store the specified chart colors if some are specified in' +
        ' the DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId,
              clrArr: ['#81504D', '#4F81BD']
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel.colors).toBe(v.el.clrArr);
        });

    it('should fallback to default chart colors if none are specified in' +
        ' the DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel.colors).toBe(CommonConfig.DEFAULT_COLORS);
        });

    it('should store the specified chart title if one is specified in the' +
        ' DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId,
              title: ['Share Performance']
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart].options.title.text).
              toBe(v.el.title.join('<br/>'));
        });

    it('should store the specified chart type if one is specified in ' +
        'the DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId,
              type: 'foobar'
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart].type).toBe(v.el.type);
        });

    it('should store the specified chart subtype if one is specified in' +
        ' the DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId,
              subt: 'woohoo'
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart].subtype).toBe(
              v.el.subt);
        });

    it('should store the specified chart categories if some are specified' +
        ' in the DCP', function() {
          var v = {
            el: {
              etp: 'cht',
              chid: chartId,
              cats: ['one', 'two', 'three']
            }
          };
          handler.visit(v);

          expect(DcpModel.dcpHandlingChart).toBeDefined();
          expect(ChartsModel[DcpModel.dcpHandlingChart].categories).toBe(
              v.el.cats);
        });
  });
});

