/**
 * @fileoverview unit test-cases for slideChartsManager
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/presentation/slideChartsManager',
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/variants/configs/point',
  'qowtRoot/models/point'
], function(
    SlideChartsManager,
    ChartRenderer,
    DeprecatedUtils,
    PointConfig,
    PointModel) {

  'use strict';

  describe('SlideChartsManager test', function() {
    var _chartId1, _parentNode1, _graphicDiv1, _chartId2, _parentNode2,
        _graphicDiv2, _chartId3, _parentNode3, _graphicDiv3;

    beforeEach(function() {
      _parentNode1 = {id: '_parentNode1', removeChild: function() {}};
      _chartId1 = '1';
      _graphicDiv1 = { id: 'firstChartDiv', parentNode: _parentNode1 };

      _parentNode2 = {id: '_parentNode2', removeChild: function() {}};
      _chartId2 = '2';
      _graphicDiv2 = { id: 'secondChartDiv', parentNode: _parentNode2 };

      _parentNode3 = {id: '_parentNode3', removeChild: function() {}};
      _chartId3 = '3';
      _graphicDiv3 = { id: 'thirdChartDiv', parentNode: _parentNode3 };

      PointModel.currentSlideEId = '1111';
      SlideChartsManager.addToChartIdDivMap(_chartId1, _graphicDiv1);
      SlideChartsManager.addToChartIdDivMap(_chartId2, _graphicDiv2);
      PointModel.currentSlideEId = '2222';
      SlideChartsManager.addToChartIdDivMap(_chartId3, _graphicDiv3);
    });

    it('should render chart and clone it on thumb-nail', function() {
      spyOn(_parentNode1, 'removeChild');
      spyOn(_parentNode2, 'removeChild');
      spyOn(_parentNode3, 'removeChild');

      spyOn(ChartRenderer, 'render');
      spyOn(DeprecatedUtils, 'cloneAndAttach');

      PointModel.currentSlideEId = '1111';
      SlideChartsManager.renderThumbnailChart();

      expect(ChartRenderer.render.callCount).toEqual(2);
      expect(ChartRenderer.render.calls[0].args).toEqual(
          [_graphicDiv1, _chartId1]);
      expect(ChartRenderer.render.calls[1].args).toEqual(
          [_graphicDiv2, _chartId2]);

      expect(DeprecatedUtils.cloneAndAttach.callCount).toEqual(2);
      expect(DeprecatedUtils.cloneAndAttach.calls[0].args).toEqual(
          [_graphicDiv1, _parentNode1, undefined]);
      expect(DeprecatedUtils.cloneAndAttach.calls[1].args).toEqual(
          [_graphicDiv2, _parentNode2, undefined]);

      expect(_parentNode1.removeChild).toHaveBeenCalledWith(_graphicDiv1);
      expect(_parentNode2.removeChild).toHaveBeenCalledWith(_graphicDiv2);
      expect(_parentNode3.removeChild).not.toHaveBeenCalled();
    });

    it('should update cloned-charts on slide', function() {
      var slideNode = {
        querySelector: function() {
        }
      };

      var slideChartDivParent1 = {
        appendChild: function() {
        },
        removeChild: function() {
        }
      };
      var slideChartDiv1 = { parentNode: slideChartDivParent1 };
      spyOn(slideChartDivParent1, 'appendChild');
      spyOn(slideChartDivParent1, 'removeChild');

      var slideChartDivParent2 = {
        appendChild: function() {
        },
        removeChild: function() {
        }
      };
      var slideChartDiv2 = { parentNode: slideChartDivParent2 };
      spyOn(slideChartDivParent2, 'appendChild');
      spyOn(slideChartDivParent2, 'removeChild');

      spyOn(slideNode, 'querySelector').andCallFake(function(id) {
        if (id ===
            ('[id=' + PointConfig.kTHUMB_ID_PREFIX + _graphicDiv1.id + ']')) {
          return slideChartDiv1;
        } else if (id ===
            ('[id=' + PointConfig.kTHUMB_ID_PREFIX + _graphicDiv2.id + ']')) {
          return slideChartDiv2;
        } else if (id === '[qowt-divtype="slide"]') {
          return {id: 't-1111'};
        }
        return null;
      });

      SlideChartsManager.updateSlideCharts(slideNode);

      expect(slideChartDivParent1.appendChild).toHaveBeenCalledWith(
          _graphicDiv1);
      expect(slideChartDivParent1.removeChild).toHaveBeenCalledWith(
          slideChartDiv1);

      expect(slideChartDivParent2.appendChild).toHaveBeenCalledWith(
          _graphicDiv2);
      expect(slideChartDivParent2.removeChild).toHaveBeenCalledWith(
          slideChartDiv2);
    });

    it('should not try to clone charts if slide data is not available',
        function() {
          var slideNode = {
            querySelector: function() {
            }
          };
          var slideChartDivParent1 = {
            appendChild: function() {
            },
            removeChild: function() {
            }
          };

          var slideChartDivParent2 = {
            appendChild: function() {
            },
            removeChild: function() {
            }
          };

          spyOn(slideChartDivParent1, 'appendChild');
          spyOn(slideChartDivParent1, 'removeChild');

          spyOn(slideChartDivParent2, 'appendChild');
          spyOn(slideChartDivParent2, 'removeChild');

          SlideChartsManager.updateSlideCharts(slideNode);

          expect(slideChartDivParent1.appendChild).not.toHaveBeenCalled();
          expect(slideChartDivParent1.removeChild).not.toHaveBeenCalled();

          expect(slideChartDivParent2.appendChild).not.toHaveBeenCalled();
          expect(slideChartDivParent2.removeChild).not.toHaveBeenCalled();
        });

    it('should delete slide entry from map on deleteSlideEntryFromChartMap',
        function() {
          var slideNode = {
            querySelector: function() {
              return {id: 't-1111'};
            }
          };
          spyOn(slideNode, 'querySelector').andCallThrough();
          expect(SlideChartsManager.getSlidesContainingChartsCount()).toBe(2);
          SlideChartsManager.deleteSlideEntryFromChartMap(slideNode);
          expect(SlideChartsManager.getSlidesContainingChartsCount()).toBe(1);
        });
  });
});
