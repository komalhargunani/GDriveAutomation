// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for thumbnailStrip control
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/controls/point/thumbnailStrip',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr',
  'qowtRoot/features/utils',
  'qowtRoot/widgets/point/thumbnailContextMenu',
  'qowtRoot/widgets/contextMenu/contextMenu'
], function(PubSub,
            ThumbnailStripWidget,
            ThumbnailStripControl,
            ThumbnailStripContentMgr,
            Features,
            ThumbnailContextMenu
            /* provides context menu widget */) {

  'use strict';

  describe('ThumbnailStrip Control Tests', function() {

    describe('Test Initialization', function() {
      it('should throw error when ThumbnailStrip.init() called multiple times',
          function() {
            ThumbnailStripControl.init();
            expect(ThumbnailStripControl.init).toThrow(
                'thumbnailStrip.init() called multiple times.');
          });

      it('should create context menu in editor mode', function() {
        Features.enable('edit');
        Features.enable('pointEdit');
        var _contextMenu = {
          setPreExecuteHook: function() {},
          appendTo: function() {}
        };
        spyOn(ThumbnailContextMenu, 'init').andReturn(_contextMenu);
        spyOn(_contextMenu, 'setPreExecuteHook');
        spyOn(_contextMenu, 'appendTo');
        ThumbnailStripControl.init();
        expect(ThumbnailContextMenu.init).toHaveBeenCalled();
        expect(_contextMenu.appendTo).toHaveBeenCalled();
        expect(_contextMenu.setPreExecuteHook).toHaveBeenCalled();
        Features.disable('edit');
        Features.disable('pointEdit');
      });


      it('should select the thumbnail on which the context menu is shown if ' +
          'not already selected in editor mode', function() {
            spyOn(Features, 'isEnabled').andReturn(true);
            ThumbnailStripControl.init();
            ThumbnailStripWidget.createNumOfThumbs(2);
            spyOn(ThumbnailStripWidget.thumbnail(0), 'isHighlighted').andReturn(
                false);
            spyOn(PubSub, 'publish').andCallThrough();
            ThumbnailStripWidget.node().setAttribute(
                'qowt-divtype', 'thumbnail');
            ThumbnailStripWidget.node().setAttribute('aria-label', 'slide 1');
            var evt = document.createEvent('Event');
            evt.initEvent('contextmenu', true, false);

            ThumbnailStripWidget.node().dispatchEvent(evt);
            expect(PubSub.publish.calls[0].args[0]).toBe(
                'qowt:clearSlideSelection');
            expect(PubSub.publish.calls[1].args[0]).toBe('qowt:requestFocus');
            expect(PubSub.publish.calls[1].args[1].index).toBe(0);
          });

      it('should activate thumbnailStrip tool if the thumbnail on which the ' +
          'context menu is shown is already selected in editor mode',
          function() {
            spyOn(Features, 'isEnabled').andReturn(true);
            ThumbnailStripControl.init();
            ThumbnailStripWidget.createNumOfThumbs(2);
            spyOn(ThumbnailStripWidget.thumbnail(0), 'isHighlighted').andReturn(
                true);
            spyOn(PubSub, 'publish').andCallThrough();
            ThumbnailStripWidget.node().setAttribute(
                'qowt-divtype', 'thumbnail');
            ThumbnailStripWidget.node().setAttribute('aria-label', 'slide 1');
            var evt = document.createEvent('Event');
            evt.initEvent('contextmenu', true, false);

            ThumbnailStripWidget.node().dispatchEvent(evt);
            expect(PubSub.publish.calls[0].args[0]).toBe(
                'qowt:clearSlideSelection');
            expect(PubSub.publish.calls[1].args[0]).toBe('qowt:requestFocus');
            // If the thumbnail is already highlighted activate the
            // thumbnailStrip tool without any index
            expect(PubSub.publish.calls[1].args[1].index).not.toBeDefined();
          });
    });

    describe('Test Behavior', function() {
      beforeEach(function() {
        ThumbnailStripControl.init();
        ThumbnailStripContentMgr.init();
      });

      it('should select thumbnail when clicked', function() {
        ThumbnailStripWidget.createNumOfThumbs(5);
        var node = ThumbnailStripWidget.node();
        node.setAttribute('qowt-divtype', 'thumbnail');
        spyOn(PubSub, 'publish').andCallThrough();
        var evt = document.createEvent('Event');
        evt.initEvent('click', true, false);
        node.dispatchEvent(evt);

        expect(PubSub.publish.calls[0].args[0]).toBe(
            'qowt:clearSlideSelection');
        expect(PubSub.publish.calls[1].args[0]).toBe('qowt:requestFocus');
      });
    });
  });
});

