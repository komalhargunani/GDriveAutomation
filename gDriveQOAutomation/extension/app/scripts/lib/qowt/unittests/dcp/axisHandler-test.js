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
  'qowtRoot/dcp/axisHandler',
  'qowtRoot/fixtures/chart/AxisFixture',
  'qowtRoot/models/dcp',
  'qowtRoot/models/charts'
], function(
    axisHandler,
    FIXTURES,
    DcpModel,
    ChartsModel) {

  'use strict';

  describe('Axis DCP Handler', function() {
    FIXTURES = FIXTURES || {};

    var handler;

    beforeEach(function() {

      handler = axisHandler;

      DcpModel.dcpHandlingChart = 'chartId1';

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
    });

    it('should handle an axis without pos, min and max', function() {

      var axisDCP = FIXTURES.axisWithoutMinMaxPos();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).not.toBeDefined();
    });

    it('should handle an axis without pos', function() {

      var axisDCP = FIXTURES.axisWithMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).not.toBeDefined();
    });

    it('should handle an axis with just pos', function() {

      var axisDCP = FIXTURES.axisWithPosWithoutMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).not.toBeDefined();
    });

    it('should handle an axis with pos and min', function() {

      var axisDCP = FIXTURES.axisWithPosMin();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis.min).toBe('12');
    });

    it('should handle an axis with pos and max', function() {

      var axisDCP = FIXTURES.axisWithPosMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis.max).toBe('65');
    });

    it('should handle an axis with pos and neg min', function() {

      var axisDCP = FIXTURES.axisWithPosNegMin();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis.min).toBe('-65');
    });

    it('should handle an axis with pos L and min and max', function() {

      var axisDCP = FIXTURES.axisWithPosLMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.xaxis).toBeUndefined();
      expect(result.yaxis).toBeDefined();
      expect(result.yaxis.min).toBe('35');
      expect(result.yaxis.max).toBe('90');
    });

    it('should handle an axis with pos R and min and max', function() {

      var axisDCP = FIXTURES.axisWithPosRMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.xaxis).toBeUndefined();
      expect(result.yaxis).toBeDefined();
      expect(result.yaxis.min).toBe('21');
      expect(result.yaxis.max).toBe('87');
    });

    it('should handle an axis with pos T and min and max', function() {

      var axisDCP = FIXTURES.axisWithPosTMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis).toBeUndefined();
      expect(result.xaxis).toBeDefined();
      expect(result.xaxis.min).toBe('25');
      expect(result.xaxis.max).toBe('99');
    });

    it('should handle an axis with pos B and min and max', function() {

      var axisDCP = FIXTURES.axisWithPosBMinMax();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis).toBeUndefined();
      expect(result.xaxis).toBeDefined();
      expect(result.xaxis.min).toBe('23');
      expect(result.xaxis.max).toBe('76');
    });

    it('should handle an axis with incorrect pos and min and max',
        function() {

          var axisDCP = FIXTURES.axisWithMinMaxIncorrectPos();

          var v = {el: axisDCP};
          handler.visit(v);

          var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
          expect(result).toBeDefined();
          expect(result.xaxis).toBeUndefined();
          expect(result.yaxis).toBeUndefined();
        });

    it('should handle an axis with major unit but without pos', function() {

      var axisDCP = FIXTURES.axisWithMajorUnitNoPos();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).not.toBeDefined();
    });

    it('should handle an axis with pos and major unit', function() {

      var axisDCP = FIXTURES.axisWithPosMajorUnit();

      var v = {el: axisDCP};
      handler.visit(v);

      var result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.xaxis.major).toBe('10');
    });

    it('should handle an x-axis with major grid lines', function() {

      var axisDCP = FIXTURES.axisWithMajorGridLinesForXaxis(),
          dcpObject = {el: axisDCP},
          result;

      handler.visit(dcpObject);

      result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.xaxis.showMajorGridline).toBe(true);
    });

    it('should handle an y-axis with major grid lines', function() {

      var axisDCP = FIXTURES.axisWithMajorGridLinesForYaxis(),
          dcpObject = {el: axisDCP},
          result;

      handler.visit(dcpObject);

      result = ChartsModel[DcpModel.dcpHandlingChart].options.axes;
      expect(result).toBeDefined();
      expect(result.yaxis.showMajorGridline).toBe(true);
    });
  });
});
