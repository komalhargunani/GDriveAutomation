/**
 * Presentation Layout Manager, to manage the rendering of master, layout and
 * slides.
 */
define([
  'qowtRoot/presentation/slideCloneManager',
  'qowtRoot/presentation/slideChartsManager',
  'qowtRoot/models/point'
], function(SlideCloneManager, SlideChartsManager, PointModel) {

  'use strict';

  /**
   * For color-map override, we have to take care of following scenarios:
   * Scenario 1. When color-map override is at SLIDE level, then all the shapes
   * in Master and Layout should adapt to the SLIDE level color-map override.
   * [QP-1972]
   * Scenario 2. When color-map override is at SLIDE-LAYOUT level, and there is
   * no color-map override at SLIDE level, then all the shapes in Master and
   * Slide as well, should adapt to the SLIDE-LAYOUT level color-map override.
   * [QP-2130]
   *
   * In both of the above scenarios, we will have to re-render the slide, which
   * is why the flag "_reRenderSlidesMap".
   */
  var _reRenderSlidesMap = {};

  /*
   * Keeps track of all the canvases in thumbnail-div, that were cloned into the
   * slide-div.
   * In case of blip-fill in a canvas, the background image is applied once when
   * the image is loaded.
   * When the image gets loaded, it fills the original canvas inside the
   * thumbnail-div, but knows nothing about the slide-div canvas. Hence, this
   * map.
   */
  var _thumbnailToSlideCanvasMap = {};

  /*
   * Keeps track of all the shape-fill divs in the slide-div, that were cloned
   * from the thumbnail-div.
   * In case of blip-fill of a shape, the background image is applied once when
   * the image is loaded.
   * When the image gets loaded, it fills the original shape-fill div inside the
   * thumbnail-div, but knows nothing about the slide-div's shape-fill divs.
   * Hence, this map.
   */
  var _thumbnailToSlideShapeFillMap = {};

  var _api = {

    /**
     * sets the re-render flag for the current slide
     * @param flag {Boolean}
     */
    setSlideReRenderingFlag: function(flag) {
      _reRenderSlidesMap[PointModel.SlideId] = flag;
    },

    /**
     * returns the re-render flag for the current slide
     * @return {Boolean}
     */
    isReRenderingCurrentSlide: function() {
      return _reRenderSlidesMap[PointModel.SlideId] === true;
    },

    /**
     * appends / updates the map of chart-id to graphic-div
     * @param {String} chartId Id of teh chart to render
     * @param {HTMLElement} chartDiv The container where the chart is to be
     *                               rendered
     * @param {HTMLElement} slideNode Node in which chart is rendered
     */
    cacheChartInfo: function(chartId, chartDiv, slideNode) {
      SlideChartsManager.addToChartIdDivMap(chartId, chartDiv, slideNode);
    },

    /**
     * takes care of the slide rendering options, which need to be performed
     * after slide had been rendered, its doc-fragment has been attached to the
     * main document, but it has not yet been cloned.
     */
    preSlideClone: function() {
      SlideChartsManager.renderThumbnailChart();
    },

    /**
     * clones thumbnail onto the slide, and takes care of all the consecutive
     * operations.
     * @param {HTML} thumbNode - thumb node
     * @param {HTML} slideNode - slide node
     * @param {Number} slideIndex - slide-index, which starts from 0.
     */
    cloneSlide: function(thumbNode, slideNode /* slideIndex */) {
      SlideCloneManager.cloneChildNodes(thumbNode, slideNode);
      SlideCloneManager.cloneSmartArtJSON(thumbNode, slideNode);
      SlideCloneManager.mapClonedCanvas(slideNode, _thumbnailToSlideCanvasMap);
      SlideCloneManager.
        mapClonedShapeFills(slideNode, _thumbnailToSlideShapeFillMap);
      SlideCloneManager.handleShapesWithHyperlink(slideNode);

      SlideChartsManager.updateSlideCharts(slideNode);
    },

    /**
     * resets the thumb-to-slide maps
     */
    resetThumbToSlideMaps: function() {
      _thumbnailToSlideCanvasMap = {};
      _thumbnailToSlideShapeFillMap = {};
    },

    /**
     * @return {JSON} thumb-to-slidecanvas map
     */
    getThumbnailToSlideCanvasMap: function() {
      return _thumbnailToSlideCanvasMap;
    },

    /**
     * @return {JSON} thumb-to-slide-shape-fill map
     */
    getThumbnailToSlideShapeFillMap: function() {
      return _thumbnailToSlideShapeFillMap;
    }
  };

  return _api;
});
