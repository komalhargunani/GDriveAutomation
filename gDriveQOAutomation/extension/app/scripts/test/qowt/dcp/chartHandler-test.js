define([
  'qowtRoot/dcp/chartHandler',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    ChartHandler,
    DcpModel,
    ChartsModel) {

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

    it('should have scatter style when chart type is scatter chart',
        function() {
      var v = {
        el: {
          etp: 'cht',
          chid: chartId,
          scatStyle: 'lineMarker',
          type: 'scat'
        }
      };
      handler.visit(v);

      assert.strictEqual(ChartsModel[DcpModel.dcpHandlingChart].scattype,
          v.el.scatStyle, 'scatter chart type should have scatter style');
    });

    it('should convert the chart categories to number list if all ' +
        'categories can be converted to number', function() {
      var v = {
        el: {
          etp: 'cht',
          chid: chartId,
          cats: ['1', '2', '3']
        }
      };
      var numericCats = [1, 2, 3];
      handler.visit(v);
      assert.deepEqual(ChartsModel[DcpModel.dcpHandlingChart].categories,
        numericCats);
    });

    it('should keep the original categories if categories cannot be ' +
        'converted to number', function() {
      var v = {
        el: {
          etp: 'cht',
          chid: chartId,
          cats: ['A', '2', '3']
        }
      };
      handler.visit(v);
      assert.deepEqual(ChartsModel[DcpModel.dcpHandlingChart].categories,
        v.el.cats);
    });

    it('should keep the original categories if first category can be ' +
      'converted to number but second category cannot be', function() {
      var v = {
        el: {
          etp: 'cht',
          chid: chartId,
          cats: ['3', 'C', '3']
        }
      };
      handler.visit(v);
      assert.deepEqual(ChartsModel[DcpModel.dcpHandlingChart].categories,
        v.el.cats);
    });

    it('should not update chart categories when categories are undefined',
        function() {
      var v = {
        el: {
          etp: 'cht',
          chid: chartId
        }
      };
      handler.visit(v);
      assert.isUndefined(ChartsModel[DcpModel.dcpHandlingChart].categories);
    });
  });
});
