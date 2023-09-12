// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide control
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/features/utils',
  'qowtRoot/controls/point/slide',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/drawing/ghostShape'
], function(
    SlidesContainer,
    Features,
    SlideControl,
    PubSub,
    GhostShape) {

  'use strict';

  describe('Slide Control Tests', function() {

    var dummyNode;

    beforeEach(function() {
      Features.enable('edit');
      Features.enable('pointEdit');
      spyOn(PubSub, 'subscribe').andCallThrough();
      spyOn(SlidesContainer, 'init');
      spyOn(GhostShape, 'init');
      spyOn(GhostShape, 'appendTo');
      dummyNode = {
        addEventListener: function() {}
      };
      spyOn(SlidesContainer, 'node').andReturn(dummyNode);
      spyOn(dummyNode, 'addEventListener');
      spyOn(document, 'addEventListener');
      SlideControl.init();
    });
    afterEach(function() {
      Features.disable('edit');
      Features.disable('pointEdit');
    });

    it('should throw error when SlideControl.init() called multiple times',
       function() {
         expect(SlideControl.init).toThrow(
             'slideControl.init() called multiple times.');
        });

    it('should add event listeners, initialize ghost widget on initialization',
        function() {
          expect(SlidesContainer.init).toHaveBeenCalled();
          expect(GhostShape.init).toHaveBeenCalled();
          expect(GhostShape.appendTo).toHaveBeenCalled();
          expect(dummyNode.addEventListener.calls[0].args[0]).
              toBe('mouseenter');
          expect(dummyNode.addEventListener.calls[1].args[0]).
              toBe('mousedown');
          expect(dummyNode.addEventListener.calls[2].args[0]).
              toBe('click');
          expect(document.addEventListener.calls[0].args[0]).
              toBe('keydown');
        });

    it('should subscribe QOWT events on init', function() {
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:disable');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });
  });
});

