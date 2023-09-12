// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide selection strategies
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/features/utils',
  'qowtRoot/presentation/strategies/slideSelection',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/utils/dataStructures/stackFactory'
], function(PubSub, Features, SelectionStrategies, ThumbnailStrip,
            StackFactory) {

  'use strict';

  describe('slide selection strategies test', function() {
    var _highlightedThumbs;
    beforeEach(function() {
      _highlightedThumbs = StackFactory.create();
      spyOn(PubSub, 'subscribe').andCallThrough();
      SelectionStrategies.init(_highlightedThumbs);
      ThumbnailStrip.init();
      ThumbnailStrip.createNumOfThumbs(10);
      spyOn(ThumbnailStrip, 'selectItem').andCallThrough();
    });

    it('should subscribe for events on initialization', function() {
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:disable');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual(
          'qowt:updateThumbCount');
    });

    describe('Test getStrategy', function() {
      it('should handle single selection for slide in viewer mode', function() {
        var strategy = SelectionStrategies.getStrategy('click', false, false);
        strategy.select(0);
        expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
        expect(_highlightedThumbs.m_arr.length).toBe(1);
      });

      it('should not allow multiple selection of thumbnails in viewer mode',
          function() {
            var strategy = SelectionStrategies.getStrategy('click', true,
                false);
            strategy.select(0);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(1);
          });
    });

    describe('selection for editor mode', function() {
      beforeEach(function() {
        Features.enable('edit');
        Features.enable('pointEdit');
        SelectionStrategies.getStrategy('click', false, false).select(0);
      });

      afterEach(function() {
        Features.disable('edit');
        Features.disable('pointEdit');
      });

      it('should fire appropriate pubsub events on single slide selection ' +
          'using mouse', function() {
            var strategy = SelectionStrategies.getStrategy('click', false,
                false);
            strategy.select(1);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(1);
          });

      it('should fire appropriate pubsub events on single slide selection ' +
          'using keyboard', function() {
            var strategy = SelectionStrategies.getStrategy('keydown', false,
                false);
            strategy.select(1);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(1);
          });

      it('should handle multiple selection with control pressed with mouse',
          function() {
            var strategy = SelectionStrategies.getStrategy('click', false,
                true);
            strategy.select(1);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(2);
            expect(_highlightedThumbs.m_arr[0].getSlideIndex()).toEqual(0);
            expect(_highlightedThumbs.m_arr[1].getSlideIndex()).toEqual(1);
          });

      it('should not return any selection strategy when control pressed ' +
          'using keyboard', function() {
            var strategy = SelectionStrategies.getStrategy('keydown', false,
                true);
            expect(strategy.select).toBeUndefined();
          });

      it('should not return any selection strategy when control and shift ' +
          'using keyboard', function() {
            var strategy = SelectionStrategies.getStrategy('keydown', true,
                true);
            expect(strategy.select).toBeUndefined();
          });

      it('should set active selected item in Thumbnail strip only once when' +
          ' multiple selection is with shift using mouse', function() {
            var strategy = SelectionStrategies.getStrategy('click', true,
                false);
            strategy.select(2);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(3);
            expect(_highlightedThumbs.m_arr[0].getSlideIndex()).toEqual(2);
            expect(_highlightedThumbs.m_arr[1].getSlideIndex()).toEqual(1);
            expect(_highlightedThumbs.m_arr[2].getSlideIndex()).toEqual(0);
      });

      it('should set active selected item in Thumbnail strip only once when' +
          ' multiple selection is with shift using keyboard', function() {
            spyOn(ThumbnailStrip.thumbnail(1), 'makeVisible');
            var strategy = SelectionStrategies.getStrategy('keydown', true,
                false);
            strategy.select(2);
            expect(ThumbnailStrip.selectItem).toHaveBeenCalled();
            expect(ThumbnailStrip.thumbnail(1).makeVisible).toHaveBeenCalled();
            expect(_highlightedThumbs.m_arr.length).toBe(2);
            expect(_highlightedThumbs.m_arr[0].getSlideIndex()).toEqual(1);
            expect(_highlightedThumbs.m_arr[1].getSlideIndex()).toEqual(0);
          });

      it('should deselect a thumbnail is selected twice', function() {
        var strategy = SelectionStrategies.getStrategy('click', false,
            true);
        strategy.select(1);
        expect(_highlightedThumbs.m_arr.length).toBe(2);
        strategy.select(1);
        expect(_highlightedThumbs.m_arr.length).toBe(1);
        expect(_highlightedThumbs.m_arr[0].getSlideIndex()).toEqual(0);
      });

      it('should correct range and select thumbnails properly when the ' +
          'current thumbnail is in between range', function() {
            var strategy = SelectionStrategies.getStrategy('click', false,
                true);
            strategy.select(3);
            strategy.select(0);
            strategy.select(7);
            strategy.select(5);
            strategy = SelectionStrategies.getStrategy('keydown', true,
                false);
            strategy.select(3);

            expect(_highlightedThumbs.m_arr.length).toBe(4);
            expect(_highlightedThumbs.m_arr[0].getSlideIndex()).toBe(2);
            expect(_highlightedThumbs.m_arr[1].getSlideIndex()).toBe(3);
            expect(_highlightedThumbs.m_arr[2].getSlideIndex()).toBe(4);
            expect(_highlightedThumbs.m_arr[3].getSlideIndex()).toBe(5);
          });
    });
  });
});
