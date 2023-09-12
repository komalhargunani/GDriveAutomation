
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test file for scatter chart builder
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/charts/scatterChartBuilder'
], function(
    UnitConversionUtils,
    Builder) {

  'use strict';

  describe('scatterChartBuilder tests', function() {

    var chartObj;

    beforeEach(function() {
      chartObj = {};
      chartObj.options = {};
    });
    afterEach(function() {
      chartObj = undefined;
    });

    it('should construct ok', function() {
      expect(Builder).toBeDefined();
    });

    it('should build chart with no settings ok', function() {
      var res = Builder.build(chartObj);
      expect(res.options.title).not.toBeDefined();
      expect(res.type).toBe('ScatterChart');
    });

    it('should build chart with title ok', function() {
      chartObj.options.title = {};
      chartObj.options.title.text = "I'm a title.";
      var res = Builder.build(chartObj);
      expect(res.options.title).toBe(chartObj.options.title.text);
    });

    it('should build the correct marker config for the chart', function() {
      chartObj.options.series = [];
      chartObj.options.series[0] = {markerOptions: {show: true, size: 8}};
      var res = Builder.build(chartObj);
      var obj = {};
      // convert the pointSize from point units to pixel units
      obj.pointSize = UnitConversionUtils.
            convertPointToPixel(chartObj.options.series[0].markerOptions.size);
      expect(obj.pointSize).toBeDefined();
      expect(res.options.series[0]).toEqual(obj);
    });

    it('should show major grid lines correctly', function() {
      chartObj.options.axes = {};
      chartObj.options.axes.yaxis = {};
      chartObj.options.axes.xaxis = {};
      chartObj.options.axes.yaxis.showMajorGridline = true;
      chartObj.options.axes.xaxis.showMajorGridline = true;
      var res = Builder.build(chartObj);
      expect(res.options.hAxis.gridlines.color).not.toBe('#FFF');
      expect(res.options.vAxis.gridlines.color).not.toBe('#FFF');
    });
    it('should hide major grid lines correctly', function() {
      chartObj.options.axes = {};
      chartObj.options.axes.yaxis = {};
      chartObj.options.axes.xaxis = {};
      chartObj.options.axes.yaxis.showMajorGridline = false;
      chartObj.options.axes.xaxis.showMajorGridline = false;
      var res = Builder.build(chartObj);
      expect(res.options.hAxis.gridlines.color).toBe('#FFF');
      expect(res.options.vAxis.gridlines.color).toBe('#FFF');
    });

    it('should set Min and Max on Y axis correctly', function() {
      chartObj.options.axes = {};
      chartObj.options.axes.yaxis = {};
      chartObj.options.axes.yaxis.max = 50;
      chartObj.options.axes.yaxis.min = 20;
      var res = Builder.build(chartObj);
      expect(res.options.vAxis.viewWindow.max).toBe(51);
      expect(res.options.vAxis.viewWindow.min).toBe(20);
    });
    it('should set Min and Max on X axis correctly', function() {
      chartObj.options.axes = {};
      chartObj.options.axes.xaxis = {};
      chartObj.options.axes.xaxis.max = 60;
      chartObj.options.axes.xaxis.min = 30;
      var res = Builder.build(chartObj);
      expect(res.options.hAxis.viewWindow.max).toBe(61);
      expect(res.options.hAxis.viewWindow.min).toBe(30);
    });
    it('should set Max which is not divisible by 10 on X axis correctly',
       function() {
         chartObj.options.axes = {};
         chartObj.options.axes.xaxis = {};
         chartObj.options.axes.xaxis.max = 42;
         var res = Builder.build(chartObj);
         expect(res.options.hAxis.viewWindow.max).toBe(42);
         expect(res.options.hAxis.viewWindow.min).toBe(0);
       });
  });
});
