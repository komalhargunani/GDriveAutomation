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
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/models/charts'
], function(
    UnittestUtils,
    ChartRenderer,
    ChartsModel) {

  'use strict';

  describe('ChartRenderer tests', function() {
    var renderer;
    var rootNode;
    var testAppendArea;
    var chartId = 'chartIdN';
    var barChartBuilderStub = {type: 'bar', build: function() {}};
    var columnChartBuilderStub = {
      type: 'col',
      build: function() {}
    };
    var lineChartBuilderStub = {
      type: 'line',
      build: function() {}
    };
    var pieChartBuilderStub = {
      type: 'pie',
      build: function() {}
    };
    var scatterChartBuilderStub = {
      type: 'scat',
      build: function() {}
    };

    beforeEach(function() {
      renderer = ChartRenderer;

      testAppendArea = UnittestUtils.createTestAppendArea();
      rootNode = document.createElement('div');
      testAppendArea.appendChild(rootNode);
    });

    afterEach(function() {
      renderer = undefined;
      delete ChartsModel[chartId];

      testAppendArea.removeChild(rootNode);
      rootNode = undefined;
      testAppendArea = undefined;
    });

    it('should use the Bar Chart Builder when the chart to be rendered ' +
        'is a bar chart', function() {
          renderer.registerChartBuilder(barChartBuilderStub);
          renderer.registerChartBuilder(lineChartBuilderStub);
          expect(renderer.isBuilderRegistered(barChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(lineChartBuilderStub.type)).toBe(
              true);
          ChartsModel[chartId] = {
            type: 'bar'
          };

          spyOn(barChartBuilderStub, 'build');
          spyOn(lineChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(barChartBuilderStub.build).toHaveBeenCalled();
          expect(lineChartBuilderStub.build).not.toHaveBeenCalled();
        });

    it('should use the Column Chart Builder when the chart to be ' +
        'rendered is a column chart', function() {
          renderer.registerChartBuilder(scatterChartBuilderStub);
          renderer.registerChartBuilder(columnChartBuilderStub);
          expect(renderer.isBuilderRegistered(scatterChartBuilderStub.type)).
              toBe(true);
          expect(renderer.isBuilderRegistered(columnChartBuilderStub.type)).
              toBe(true);

          ChartsModel[chartId] = {
            type: 'col'
          };

          spyOn(scatterChartBuilderStub, 'build');
          spyOn(columnChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(scatterChartBuilderStub.build).not.toHaveBeenCalled();
          expect(columnChartBuilderStub.build).toHaveBeenCalled();
        });

    it('should use the Line Chart Builder when the chart to be rendered ' +
        'is a line chart', function() {
          renderer.registerChartBuilder(pieChartBuilderStub);
          renderer.registerChartBuilder(lineChartBuilderStub);
          renderer.registerChartBuilder(barChartBuilderStub);
          expect(renderer.isBuilderRegistered(pieChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(lineChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(barChartBuilderStub.type)).toBe(
              true);

          ChartsModel[chartId] = {
            type: 'line'
          };

          spyOn(pieChartBuilderStub, 'build');
          spyOn(lineChartBuilderStub, 'build');
          spyOn(barChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(pieChartBuilderStub.build).not.toHaveBeenCalled();
          expect(lineChartBuilderStub.build).toHaveBeenCalled();
          expect(barChartBuilderStub.build).not.toHaveBeenCalled();
        });

    it('should use the Pie Chart Builder when the chart to be rendered ' +
        'is a pie chart', function() {
          renderer.registerChartBuilder(pieChartBuilderStub);
          renderer.registerChartBuilder(barChartBuilderStub);
          expect(renderer.isBuilderRegistered(pieChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(barChartBuilderStub.type)).toBe(
              true);

          ChartsModel[chartId] = {
            type: 'pie'
          };

          spyOn(pieChartBuilderStub, 'build');
          spyOn(barChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(pieChartBuilderStub.build).toHaveBeenCalled();
          expect(barChartBuilderStub.build).not.toHaveBeenCalled();
        });

    it('should use the Scatter Chart Builder when the chart to be ' +
        'rendered is a scatter chart', function() {
          renderer.registerChartBuilder(pieChartBuilderStub);
          renderer.registerChartBuilder(barChartBuilderStub);
          renderer.registerChartBuilder(scatterChartBuilderStub);
          expect(renderer.isBuilderRegistered(pieChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(barChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(scatterChartBuilderStub.type)).
              toBe(true);

          ChartsModel[chartId] = {
            type: 'scat'
          };

          spyOn(pieChartBuilderStub, 'build');
          spyOn(barChartBuilderStub, 'build');
          spyOn(scatterChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(pieChartBuilderStub.build).not.toHaveBeenCalled();
          expect(barChartBuilderStub.build).not.toHaveBeenCalled();
          expect(scatterChartBuilderStub.build).toHaveBeenCalled();
        });

    it('should use no Chart Builder when the chart to be rendered is of ' +
        'a type that has no builder', function() {
          renderer.registerChartBuilder(pieChartBuilderStub);
          renderer.registerChartBuilder(barChartBuilderStub);
          renderer.registerChartBuilder(scatterChartBuilderStub);
          expect(renderer.isBuilderRegistered(pieChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(barChartBuilderStub.type)).toBe(
              true);
          expect(renderer.isBuilderRegistered(scatterChartBuilderStub.type)).
              toBe(true);

          ChartsModel[chartId] = {
            type: 'blah'
          };

          spyOn(pieChartBuilderStub, 'build');
          spyOn(barChartBuilderStub, 'build');
          spyOn(scatterChartBuilderStub, 'build');
          renderer.render(rootNode, chartId);
          expect(pieChartBuilderStub.build).not.toHaveBeenCalled();
          expect(barChartBuilderStub.build).not.toHaveBeenCalled();
          expect(scatterChartBuilderStub.build).not.toHaveBeenCalled();
        });
  });
});
