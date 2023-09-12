// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for thumbnailStripTool
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/behaviours/action/commonActionHandler',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(PubSub, ThumbnailStripTool, CommonActionHandler, ThumbnailStrip) {

  'use strict';

  describe('thumbnail strip tool test', function() {

    describe('Test initialization', function() {
      it('should subscribe to events on init', function() {
        spyOn(PubSub, 'subscribe');
        ThumbnailStripTool.init();
        expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:disable');
      });

      it('should add commonActionHandler behavior on init', function() {
        spyOn(CommonActionHandler, 'addBehaviour');
        ThumbnailStripTool.init();
        expect(CommonActionHandler.addBehaviour).toHaveBeenCalled();
      });

      it('should throw error if thumbnailStripTool.init() ' +
          'called multiple times', function() {
            ThumbnailStripTool.init();
            expect(ThumbnailStripTool.init).toThrow(
                'thumbnailStripTool.init() called multiple times.');
          });
    });

    describe('Test Behavior', function() {
      var _context;

      beforeEach(function() {
        ThumbnailStripTool.init();

        _context = {
          contentType: 'slideManagement',
          index: 0,
          meta: false,
          shift: false,
          type: 'click'
        };

        spyOn(PubSub, 'subscribe').andCallThrough();
        spyOn(PubSub, 'unsubscribe').andCallThrough();
        spyOn(PubSub, 'publish').andCallThrough();
        ThumbnailStripTool.activate(_context);
      });

      afterEach(function() {
        ThumbnailStripTool.deactivate(_context);
      });

      it('should subscribe qowt events on activate', function() {
        expect(PubSub.subscribe).toHaveBeenCalled();
        expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:requestAction');
        expect(PubSub.subscribe.calls[1].args[0]).toEqual(
            'qowt:selectionChanged');
      });

      it('should unsubscibe qowt:requestAction on deactivate', function() {
        ThumbnailStripTool.deactivate(_context);
        expect(PubSub.unsubscribe).toHaveBeenCalled();
      });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "slideSelect" ', function() {
            PubSub.publish('qowt:requestAction', {action: 'slideSelect',
              contentType: 'slideManagement', context: _context});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'slideSelect');
          });

      it('should call common actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action which can not be handled by' +
          ' Thumbnail strip tool. testing with saveAs action', function() {
            var eventData = {action: 'saveAs', contentType: 'common',
              context: _context};

            spyOn(ThumbnailStripTool, 'handleCommonAction');
            PubSub.publish('qowt:requestAction', eventData);

            expect(ThumbnailStripTool.handleCommonAction).
                toHaveBeenCalledWith('qowt:requestAction', eventData);
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:selectionChanged" signal and set slideSelect action if index' +
          ' is specified in the context',
          function() {
            PubSub.publish('qowt:selectionChanged',
                {newSelection: _context});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'slideSelect');
          });

      it('should not set slideSelect action if index is undefined when it ' +
          'receives a "qowt:selectionChanged" signal', function() {
            _context.index = undefined;
            PubSub.publish('qowt:selectionChanged',
                {newSelection: _context});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:selectionChanged');
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "resetSlideSelection" ',
          function() {
            PubSub.publish('qowt:requestAction', {action: 'resetSlideSelection',
              context: {contentType: 'slideManagement'}});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'resetSlideSelection');
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "showSld" ',
          function() {
            PubSub.publish('qowt:requestAction', {action: 'showSld',
              context: {
                contentType: 'slideManagement',
                'command': {
                  showSlide: false
                }
              }
            });

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'showSld');
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "insertSlide" ',
          function() {
            PubSub.publish('qowt:requestAction', {action: 'insertSlide',
              context: {contentType: 'slideManagement'}});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'insertSlide');
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "deleteSlide" ',
          function() {
            PubSub.publish('qowt:requestAction', {action: 'deleteSlide',
              context: {contentType: 'slideManagement'}});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'deleteSlide');
          });

      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "moveSlide" ',
          function() {
            PubSub.publish('qowt:requestAction', {action: 'moveSlide',
              context: {contentType: 'slideManagement'}});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'moveSlide');
          });
      it('should call registered actionHandler when it receives a ' +
          '"qowt:requestAction" signal for action "duplicateSlide" ',
          function() {
            var dummyThumb = {
              getSlideIndex: function() {return 0;}
            };

            var dummyHighlightedThumbs = {
              m_arr: [dummyThumb],
              iterate: function(callback) {
                var totalCount = this.m_arr.length;
                for (var count = totalCount - 1; count >= 0; count--) {
                  if (callback(this.m_arr[count])) {
                  }
                }
              }
            };
            spyOn(ThumbnailStrip, 'getHighlightedThumbs').andReturn(
                dummyHighlightedThumbs);

            PubSub.publish('qowt:requestAction', {action: 'duplicateSlide',
              context: {contentType: 'slideManagement'}});

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
                'qowt:doAction');
            expect(PubSub.publish.mostRecentCall.args[1].action).toEqual(
                'duplicateSlide');
          });
    });
  });
});
