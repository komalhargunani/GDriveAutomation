// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview UT module for drag handler for move slides.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/moveSlideDragHandler'
], function(
    PubSub,
    ThumbnailStripWidget,
    MoveSlideDragHandler) {

  'use strict';

  describe('Move Slide Drag Handler', function() {
    var dummySlide1 = {
      getSlideIndex: function() {
        return 1;
      }
    };

    var dummySlide2 = {
      getSlideIndex: function() {
        return 2;
      }
    };
    var dummySlides = [dummySlide1, dummySlide2];
    var dragHandler;

    beforeEach(function() {
      ThumbnailStripWidget.init();
      var parentDiv = document.createElement('div');
      ThumbnailStripWidget.appendTo(parentDiv);
      ThumbnailStripWidget.createNumOfThumbs(2);
    });
    it('should initialize starting position and slides', function() {
      dragHandler = new MoveSlideDragHandler(dummySlides);
      expect(dragHandler.slides_).toEqual(dummySlides);
      expect(dragHandler.x_).toEqual(null);
      expect(dragHandler.y_).toEqual(null);
    });

    describe('Test Drag behavior', function() {
      var dummyDragStartEvent = {};
      beforeEach(function() {
        dragHandler = new MoveSlideDragHandler(dummySlides);
        var dummyStartThumbnail = {
          getAttribute: function(attr) {
            switch (attr) {
              case 'qowt-divtype':
                return 'thumbnail';
              case 'aria-label':
                return 'slide 1';
            }
          }
        };
        dummyDragStartEvent.target = dummyStartThumbnail;
      });

      afterEach(function() {
        dragHandler.reset();
      });

      it('should start listening for scroll events on onMouseDown', function() {
        var scrollerThumb = ThumbnailStripWidget.node().parentNode;

        spyOn(scrollerThumb, 'addEventListener');
        dragHandler.onMouseDown();
        expect(scrollerThumb.addEventListener.calls[0].args[0]).toBe('scroll');
      });

      it('should stop listening for scroll events on onMouseUp', function() {
        var scrollerThumb = ThumbnailStripWidget.node().parentNode;

        spyOn(scrollerThumb, 'removeEventListener');
        dragHandler.onMouseDown();
        dragHandler.onMouseUp();
        expect(scrollerThumb.removeEventListener.calls[0].args[0]).toBe(
            'scroll');
      });

      it('should create UI elements for dragging on onDragStart', function() {
        dragHandler.onMouseDown();
        dragHandler.onDragStart(dummyDragStartEvent);
        var thumbNode = ThumbnailStripWidget.node();
        expect(thumbNode.classList.contains('qowt-point-move-cursor')).toBe(
            true);
        var thumbs = thumbNode.childNodes;
        var filmStripDiv = thumbs[thumbs.length - 1];
        var scrollerThumbChildren = thumbNode.parentNode.childNodes;
        var tooltipDiv = scrollerThumbChildren[
            scrollerThumbChildren.length - 1];
        expect(filmStripDiv.classList.contains('qowt-point-filmstrip')).toBe(
            true);
        expect(tooltipDiv.classList.contains('qowt-point-tooltip')).toBe(true);
      });

      it('should select the thumbnail being dragged, if not already selected,' +
          ' on onDragStart', function() {
            dragHandler.onMouseDown();
            spyOn(PubSub, 'publish').andCallThrough();
            dragHandler.onDragStart(dummyDragStartEvent);
            expect(PubSub.publish.mostRecentCall.args[0]).toBe(
                'qowt:requestFocus');
            expect(PubSub.publish.mostRecentCall.args[1].contentType).toBe(
                'slideManagement');
          });

      it('should update positions of filmstrip and tooltip on onDrag',
          function() {
            var dummyThumbNode = {
              getAttribute: function() {
                return 'thumbnail';
              },
              getBoundingClientRect: function() {
                return {top: 20, width: 50};
              }
            };
            var dummyEvent = {
              target: dummyThumbNode,
              detail: {
                x: 100,
                y: 0
              }
            };
            var dummyTooltipComputedStyle = {
              height: 40,
              width: 20
            };
            spyOn(window, 'getComputedStyle').andReturn(
                dummyTooltipComputedStyle);
            var thumbNode = ThumbnailStripWidget.node();
            spyOn(thumbNode, 'insertBefore');
            dragHandler.onMouseDown();
            dragHandler.onDragStart(dummyDragStartEvent);
            dragHandler.onDrag(dummyEvent);
            var thumbs = thumbNode.childNodes;
            var filmStripDiv = thumbs[thumbs.length - 1];
            var scrollerThumbChildren = thumbNode.parentNode.childNodes;
            var tooltipDiv = scrollerThumbChildren[
                scrollerThumbChildren.length - 1];
            //check case when slide dragged to end

            expect(tooltipDiv.style.top).toBe('-40px');
            expect(tooltipDiv.style.left).toBe('80px');
            expect(thumbNode.insertBefore).toHaveBeenCalledWith(filmStripDiv,
                undefined);
          });

      it('should hide UI elements and publish doAction for moveSlide on ' +
          'onDragEnd', function() {
            dragHandler.onMouseDown();
            dragHandler.onDragStart(dummyDragStartEvent);
            var thumbNode = ThumbnailStripWidget.node();

            spyOn(thumbNode.classList, 'remove');
            spyOn(PubSub, 'publish');
            dragHandler.onDragEnd();
            expect(thumbNode.classList.remove).toHaveBeenCalledWith(
                'qowt-point-move-cursor');
            var thumbs = thumbNode.childNodes;
            var filmStripDiv = thumbs[thumbs.length - 1];
            var scrollerThumbChildren = thumbNode.parentNode.childNodes;
            var tooltipDiv = scrollerThumbChildren[
                scrollerThumbChildren.length - 1];
            expect(filmStripDiv.style.visibility).toBe('hidden');
            expect(tooltipDiv.style.visibility).toBe('hidden');
            expect(PubSub.publish.calls[0].args[0]).toBe('qowt:requestAction');
            expect(PubSub.publish.calls[0].args[1].action).toBe('moveSlide');
          });
    });
  });
});
