/**
 * @fileoverview contains helper methods for zooming presentation.
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/configs/point',
  'qowtRoot/models/point'], function(
  SlidesContainer,
  PointConfig,
  PointModel) {

  'use strict';

  var _slideScale = 1;

  var _api = {

    /**
     * zooms-in the current slide.
     */
    zoomIn: function() {
      if (PointConfig.ZOOM.current < PointConfig.ZOOM.levels.length - 1) {
        _api.setZoom(PointConfig.ZOOM.current + 1);
      }
    },

    /**
     * zooms-out the current slide.
     */
    zoomOut: function() {
      if (PointConfig.ZOOM.current > 0) {
        _api.setZoom(PointConfig.ZOOM.current - 1);
      }
    },

    /**
     * Make the Zoom to default zoom, from the current zoom level.
     * This is called when a user use keyboard shortcut cmd -0
     */
    actualSize: function() {
      _api.setZoom(PointConfig.LAYOUT_DEFAULT_ZOOM_LEVEL);
    },

    /**
     * sets zoom for the current slide.
     * @param {Number} zoomLevel
     */
    setZoom: function(zoomLevel) {
      PointConfig.ZOOM.current = zoomLevel;
      _zoom(PointConfig.ZOOM.levels[zoomLevel]);
    },

    /**
     * Zoom to fit the slides' container.
     */
    zoomToFit: function() {
      var slidesContainerNode = SlidesContainer.node();
      var containerWidth = slidesContainerNode.offsetWidth;
      var containerHeight = slidesContainerNode.offsetHeight;

      var currentSlide = SlidesContainer.getCurrentSlideWidget();
      var slideWidth = currentSlide.width();
      var slideHeight = currentSlide.height();
      var horizontalSlideScale = containerWidth / slideWidth;
      var verticalSlideScale = containerHeight / slideHeight;
      _slideScale =
        (verticalSlideScale < horizontalSlideScale) ?
          verticalSlideScale : horizontalSlideScale;
      // the slide-scale is substracted by 0.03, to make the slide fit into
      // slides' container.
      _slideScale -= 0.03;
      _zoom(PointConfig.ZOOM.levels[PointConfig.ZOOM.current]);
    }
  };

  /**
   * zooms the slides in the carousel, applying scrollbars to the slides'
   * container.
   * @param {Number} scale - The scale value to zoom to
   * @private
   */
  var _zoom = function(scale) {
    scale *= _slideScale;
    PointModel.currentZoomScale = scale;
    var currentSlide = SlidesContainer.getCurrentSlideWidget();
    var slidesZoomContainerNode = SlidesContainer.getSlidesZoomContainerNode();

    slidesZoomContainerNode.style.width =
      Math.round(scale * currentSlide.width() + 10) + "px";
    slidesZoomContainerNode.style.height =
      Math.round(scale * currentSlide.height() + 10) + "px";

    currentSlide.node().style['-webkit-transform-origin'] = '0 0 0';
    currentSlide.node().style['-webkit-transform'] = 'scale(' + scale + ')';

    var previousSlide = SlidesContainer.getPreviousSlideWidget();
    previousSlide.node().style['-webkit-transform-origin'] = '0 0 0';
    previousSlide.node().style['-webkit-transform'] = 'scale(' + scale + ')';

    var nextSlide = SlidesContainer.getNextSlideWidget();
    nextSlide.node().style['-webkit-transform-origin'] = '0 0 0';
    nextSlide.node().style['-webkit-transform'] = 'scale(' + scale + ')';
  };

  return _api;
});
