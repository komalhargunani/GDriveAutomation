// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for animationQueryContainer.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/animationQueryContainer'
], function(
    Animation,
    AnimationContainer,
    AnimationState,
    AnimationQueryContainer) {

  'use strict';

  describe('Animation Query Container', function() {
    var _animationObj,
        _animation1 = {
          shapeId: '4',
          start: 'onClick', // "onClick", "afterPrevious", "withPrevious"
          type: 'entrance', // "entrance", "emphasis", "exit"
          effect: 'appear', // "appear", "fade", "fly", etc
          duration: 2000,
          delay: 0
        },
        _animation2 = {
          shapeId: '5',
          start: 'afterPrevious',
          type: 'entrance',
          effect: 'appear',
          duration: 2000,
          delay: 0
        };

    beforeEach(function() {
      _animationObj = Animation.create();
      _animationObj.setAnimationShapeId(_animation1.shapeId);
      _animationObj.setAnimationStart(_animation1.start);
      _animationObj.setAnimationType(_animation1.type);
      _animationObj.setAnimationEffect(_animation1.effect);
      _animationObj.setAnimationDuration(_animation1.duration);
      _animationObj.setAnimationDelay(_animation1.delay);
      AnimationContainer.addAnimation(_animationObj);

      _animationObj = Animation.create();
      _animationObj.setAnimationShapeId(_animation2.shapeId);
      _animationObj.setAnimationStart(_animation2.start);
      _animationObj.setAnimationType(_animation2.type);
      _animationObj.setAnimationEffect(_animation2.effect);
      _animationObj.setAnimationDuration(_animation2.duration);
      _animationObj.setAnimationDelay(_animation2.delay);
      AnimationContainer.setDcpSlideIndex(1);
      AnimationContainer.addAnimation(_animationObj);
    });

    afterEach(function() {
      _animationObj = undefined;
      AnimationContainer.clearAnimationQueue();
    });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - isQueueEmpty', function() {
          spyOn(AnimationState, 'getSlideIndex').andReturn('0');
          expect(AnimationQueryContainer.isQueueEmpty()).toBe(false);
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - getToBeAnimation', function() {
          expect(AnimationQueryContainer.getToBeAnimation()).toBeDefined();
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - isAnimationToBePlayed', function() {
          expect(AnimationQueryContainer.isAnimationToBePlayed(0)).toBe(true);
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - getPreviousAnimation', function() {
          AnimationState.incrementToBeAnimatedIndex();
          expect(AnimationQueryContainer.getPreviousAnimation()).toBeDefined();
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - isPreviousAnimationToBePlayed',
       function() {
         spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(1);
         expect(AnimationQueryContainer.isPreviousAnimationToBePlayed(0)).
             toBe(true);
       });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation valid data - isEndOfQueue', function() {
          spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(1);
          expect(AnimationQueryContainer.isEndOfQueue()).toBe(true);
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation invalid data - isQueueDefined', function() {
          AnimationState.setSlideIndex(2);
          expect(AnimationQueryContainer.isQueueDefined()).toBe(false);
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation invalid data - getToBeAnimation', function() {
          AnimationState.setSlideIndex(AnimationState.getSlideIndex() + 1);
          expect(AnimationQueryContainer.getToBeAnimation()).not.toBeDefined();
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation invalid data - isAnimationToBePlayed', function() {
          expect(AnimationQueryContainer.isAnimationToBePlayed(1)).toBe(false);
        });

    it('should allow AnimationQueryContainer methods to be called after ' +
        'adding animation invalid data - isPreviousAnimationToBePlayed',
       function() {
         spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(0);
         expect(AnimationQueryContainer.isPreviousAnimationToBePlayed(1)).
             toBe(false);
       });
  });
});
