/**
 * @fileoverview unit test-cases for layoutsManager
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/presentation/slideCloneManager',
  'qowtRoot/presentation/slideChartsManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/presentation/layoutsManager'
], function(
    SlideCloneManager,
    SlideChartsManager,
    DeprecatedUtils,
    LayoutsManager) {

  'use strict';

  describe('layouts Manager test', function() {
    it('should return true, when re-render flag is marked true', function() {
      LayoutsManager.setSlideReRenderingFlag(true);
      expect(LayoutsManager.isReRenderingCurrentSlide()).toEqual(true);
    });

    it('should return false, when re-render flag is marked false', function() {
      LayoutsManager.setSlideReRenderingFlag(false);
      expect(LayoutsManager.isReRenderingCurrentSlide()).toEqual(false);
    });

    it('should return false, when re-render flag is marked anything other ' +
        'than true', function() {
          LayoutsManager.setSlideReRenderingFlag('hello');
          expect(LayoutsManager.isReRenderingCurrentSlide()).toEqual(false);
        });

    it('should render charts on slide on -preSlideClone-', function() {
      spyOn(SlideChartsManager, 'renderThumbnailChart');
      LayoutsManager.preSlideClone();
      expect(SlideChartsManager.renderThumbnailChart).toHaveBeenCalled();
    });

    it('should add chart-id to div map on -cacheChartInfo-', function() {
      var chartId = 'someChartId';
      var chartDiv = 'some chart DIV';
      var slideDiv = 'some slide DIV';

      spyOn(SlideChartsManager, 'addToChartIdDivMap');
      LayoutsManager.cacheChartInfo(chartId, chartDiv, slideDiv);

      expect(SlideChartsManager.addToChartIdDivMap).toHaveBeenCalledWith(
          chartId, chartDiv, slideDiv);
    });

    it('should call SlideCloneManager and SlideChartsManager on -cloneSlide-',
       function() {
         spyOn(SlideCloneManager, 'cloneChildNodes');
         spyOn(SlideCloneManager, 'cloneSmartArtJSON');
         spyOn(SlideCloneManager, 'mapClonedCanvas');
         spyOn(SlideCloneManager, 'mapClonedShapeFills');
         spyOn(SlideCloneManager, 'handleShapesWithHyperlink');
         spyOn(SlideChartsManager, 'updateSlideCharts');

         var thumbNode = 'some thumb node';
         var slideNode = 'some slide node';

         LayoutsManager.resetThumbToSlideMaps();
         LayoutsManager.cloneSlide(thumbNode, slideNode, 1);

         expect(SlideCloneManager.cloneChildNodes).toHaveBeenCalledWith(
             thumbNode, slideNode);
         expect(SlideCloneManager.cloneSmartArtJSON).toHaveBeenCalledWith(
             thumbNode, slideNode);
         expect(SlideCloneManager.mapClonedCanvas).toHaveBeenCalledWith(
             slideNode, {});
         expect(SlideCloneManager.mapClonedShapeFills).toHaveBeenCalledWith(
             slideNode, {});
         expect(SlideCloneManager.handleShapesWithHyperlink).
             toHaveBeenCalledWith(slideNode);

         expect(SlideChartsManager.updateSlideCharts).toHaveBeenCalledWith(
             slideNode);
       });

    it('should return thumbnail-SlideCanvas map, on ' +
        '-getThumbnailToSlideCanvasMap-', function() {
          spyOn(SlideCloneManager, 'cloneChildNodes');
          spyOn(SlideCloneManager, 'cloneSmartArtJSON');
          spyOn(SlideCloneManager, 'mapClonedShapeFills');
          spyOn(SlideCloneManager, 'handleShapesWithHyperlink');
          spyOn(SlideCloneManager, 'handleTextWithHyperlink');
          spyOn(SlideChartsManager, 'updateSlideCharts');

          var thumbnailToSlideCanvasMap = {
            a: '1',
            b: '2'
          };

          var oriMapClonedCanvas = SlideCloneManager.mapClonedCanvas;
          SlideCloneManager.mapClonedCanvas = function(slideNode, map) {
            slideNode = slideNode || {};
            DeprecatedUtils.appendJSONAttributes(map,
                thumbnailToSlideCanvasMap);
          };

          LayoutsManager.resetThumbToSlideMaps();
          LayoutsManager.cloneSlide('some thumb node', 'some slide node');

          expect(LayoutsManager.getThumbnailToSlideCanvasMap()).toEqual(
              thumbnailToSlideCanvasMap);

          SlideCloneManager.mapClonedCanvas = oriMapClonedCanvas;
        });

    it('should return thumbnail-SlideShapeFill map, on ' +
        '-getThumbnailToSlideShapeFillMap-', function() {
          spyOn(SlideCloneManager, 'cloneChildNodes');
          spyOn(SlideCloneManager, 'cloneSmartArtJSON');
          spyOn(SlideCloneManager, 'mapClonedCanvas');
          spyOn(SlideCloneManager, 'handleShapesWithHyperlink');
          spyOn(SlideCloneManager, 'handleTextWithHyperlink');
          spyOn(SlideChartsManager, 'updateSlideCharts');

          var thumbnailToSlideShapeFillMap = {
            a: '1',
            b: '2'
          };

          var oriMapClonedShapeFills = SlideCloneManager.mapClonedShapeFills;
          SlideCloneManager.mapClonedShapeFills = function(slideNode, map) {
            slideNode = slideNode || {};
            DeprecatedUtils.appendJSONAttributes(map,
                thumbnailToSlideShapeFillMap);
          };

          LayoutsManager.resetThumbToSlideMaps();
          LayoutsManager.cloneSlide('some thumb node', 'some slide node');

          expect(LayoutsManager.getThumbnailToSlideShapeFillMap()).toEqual(
              thumbnailToSlideShapeFillMap);

          SlideCloneManager.mapClonedShapeFills = oriMapClonedShapeFills;
        });

    it('should reset thumbnail-SlideShapeFill and thumbnail-SlideCanvas ' +
        'maps, on -resetThumbToSlideMaps-', function() {
          spyOn(SlideCloneManager, 'cloneChildNodes');
          spyOn(SlideCloneManager, 'cloneSmartArtJSON');
          spyOn(SlideCloneManager, 'mapClonedCanvas');
          spyOn(SlideCloneManager, 'handleShapesWithHyperlink');
          spyOn(SlideCloneManager, 'handleTextWithHyperlink');
          spyOn(SlideChartsManager, 'updateSlideCharts');

          var dummyThumbnailToSlideMap = {
            a: '1',
            b: '2'
          };

          var oriMapClonedShapeFills = SlideCloneManager.mapClonedShapeFills;
          SlideCloneManager.mapClonedShapeFills = function(slideNode, map) {
            slideNode = slideNode || {};
            DeprecatedUtils.appendJSONAttributes(map, dummyThumbnailToSlideMap);
          };

          var oriMapClonedCanvas = SlideCloneManager.mapClonedCanvas;
          SlideCloneManager.mapClonedCanvas = function(slideNode, map) {
            slideNode = slideNode || {};
            DeprecatedUtils.appendJSONAttributes(map, dummyThumbnailToSlideMap);
          };

          LayoutsManager.cloneSlide('some thumb node', 'some slide node');
          LayoutsManager.resetThumbToSlideMaps();

          expect(LayoutsManager.getThumbnailToSlideShapeFillMap()).toEqual({});
          expect(LayoutsManager.getThumbnailToSlideCanvasMap()).toEqual({});

          SlideCloneManager.mapClonedCanvas = oriMapClonedCanvas;
          SlideCloneManager.mapClonedShapeFills = oriMapClonedShapeFills;
        });
  });
});
