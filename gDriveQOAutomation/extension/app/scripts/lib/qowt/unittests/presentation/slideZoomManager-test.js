/**
 * @fileoverview unit test-cases for slideZoomManager
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/presentation/slideZoomManager',
  'qowtRoot/configs/point'
], function(
    SlidesContainer,
    SlideZoomManager,
    PointConfig) {

  'use strict';

  describe('slideZoomManager test', function() {

    beforeEach(function() {
      SlidesContainer.init();
      PointConfig.ZOOM.current = 6;
    });

    it('should zoom-in', function() {
      spyOn(SlideZoomManager, 'setZoom');
      SlideZoomManager.zoomIn();

      expect(SlideZoomManager.setZoom).toHaveBeenCalledWith(7);
    });

    it('should not zoom-in when current zoom-level is maximum', function() {
      PointConfig.ZOOM.current = PointConfig.ZOOM.levels.length - 1;
      spyOn(SlideZoomManager, 'setZoom');
      SlideZoomManager.zoomIn();

      expect(SlideZoomManager.setZoom).not.toHaveBeenCalled();
    });

    it('should zoom-out', function() {
      spyOn(SlideZoomManager, 'setZoom');
      SlideZoomManager.zoomOut();

      expect(SlideZoomManager.setZoom).toHaveBeenCalledWith(5);
    });

    it('should not zoom-out when current zoom-level is minimum', function() {
      PointConfig.ZOOM.current = 0;
      spyOn(SlideZoomManager, 'setZoom');
      SlideZoomManager.zoomOut();

      expect(SlideZoomManager.setZoom).not.toHaveBeenCalled();
    });

    it('should bring it to actual size', function() {
      spyOn(SlideZoomManager, 'setZoom');
      SlideZoomManager.actualSize();

      expect(SlideZoomManager.setZoom).toHaveBeenCalledWith(
          PointConfig.LAYOUT_DEFAULT_ZOOM_LEVEL);
    });

    it('should set-zoom', function() {
      var slidesZoomContainerNode = {
        style: {}
      };
      var currentSlideNode = {
        style: {}
      };
      var nextSlideNode = {
        style: {}
      };
      var prevSlideNode = {
        style: {}
      };

      var currentSlideWidget = {
        node: function() { return currentSlideNode; },
        width: function() { return 10; },
        height: function() { return 20; }
      };
      var nextSlideWidget = {
        node: function() { return nextSlideNode; }
      };
      var prevSlideWidget = {
        node: function() { return prevSlideNode; }
      };

      spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
          currentSlideWidget);
      spyOn(SlidesContainer, 'getPreviousSlideWidget').andReturn(
          prevSlideWidget);
      spyOn(SlidesContainer, 'getNextSlideWidget').andReturn(nextSlideWidget);
      spyOn(SlidesContainer, 'getSlidesZoomContainerNode').andReturn(
          slidesZoomContainerNode);

      SlideZoomManager.setZoom(9);
      expect(PointConfig.ZOOM.current).toEqual(9);

      expect(slidesZoomContainerNode.style.width).toEqual('25px');
      expect(slidesZoomContainerNode.style.height).toEqual('40px');

      expect(currentSlideNode.style['-webkit-transform-origin']).toEqual(
          '0 0 0');
      expect(currentSlideNode.style['-webkit-transform']).toEqual('scale(1.5)');
      expect(prevSlideNode.style['-webkit-transform-origin']).toEqual('0 0 0');
      expect(prevSlideNode.style['-webkit-transform']).toEqual('scale(1.5)');
      expect(nextSlideNode.style['-webkit-transform-origin']).toEqual('0 0 0');
      expect(nextSlideNode.style['-webkit-transform']).toEqual('scale(1.5)');
    });

    it('should zoom to fit', function() {
      var slidesZoomContainerNode = {
        style: {}
      };
      var currentSlideNode = {
        style: {}
      };
      var nextSlideNode = {
        style: {}
      };
      var prevSlideNode = {
        style: {}
      };
      var slidesContainerNode = {
        offsetWidth: 100,
        offsetHeight: 100
      };

      var currentSlideWidget = {
        node: function() { return currentSlideNode; },
        width: function() { return 10; },
        height: function() { return 20; }
      };
      var nextSlideWidget = {
        node: function() { return nextSlideNode; }
      };
      var prevSlideWidget = {
        node: function() { return prevSlideNode; }
      };

      spyOn(SlidesContainer, 'node').andReturn(slidesContainerNode);
      spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
          currentSlideWidget);
      spyOn(SlidesContainer, 'getPreviousSlideWidget').andReturn(
          prevSlideWidget);
      spyOn(SlidesContainer, 'getNextSlideWidget').andReturn(nextSlideWidget);
      spyOn(SlidesContainer, 'getSlidesZoomContainerNode').andReturn(
          slidesZoomContainerNode);

      SlideZoomManager.zoomToFit();
      expect(PointConfig.ZOOM.current).toEqual(6);

      expect(slidesZoomContainerNode.style.width).toEqual('60px');
      expect(slidesZoomContainerNode.style.height).toEqual('109px');

      expect(currentSlideNode.style['-webkit-transform-origin']).toEqual(
          '0 0 0');
      expect(currentSlideNode.style['-webkit-transform']).toEqual(
          'scale(4.97)');
      expect(prevSlideNode.style['-webkit-transform-origin']).toEqual('0 0 0');
      expect(prevSlideNode.style['-webkit-transform']).toEqual('scale(4.97)');
      expect(nextSlideNode.style['-webkit-transform-origin']).toEqual('0 0 0');
      expect(nextSlideNode.style['-webkit-transform']).toEqual('scale(4.97)');
    });
  });
});
