
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test file for pie chart builder
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/utils/charts/pieChartBuilder'
], function(
    Builder) {

  'use strict';

  describe('pieChartBuilder tests', function() {

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

    it('should build chart without title ok', function() {
      var res = Builder.build(chartObj);
      expect(res.options.title).not.toBeDefined();
    });

    it('should build chart with title ok', function() {
      chartObj.options.title = {};
      chartObj.options.title.text = "I'm a title.";
      var res = Builder.build(chartObj);
      expect(res.options.title).toBe(chartObj.options.title.text);
    });

    it('should build default values correctly', function() {
      var res = Builder.build(chartObj);
      expect(res.options.pieSliceText).toBe('value');
      expect(res.type).toBe('PieChart');
    });
  });
});

