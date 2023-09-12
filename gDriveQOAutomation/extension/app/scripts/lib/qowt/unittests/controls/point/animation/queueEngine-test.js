// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test for queueEngine.js
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/queueEngine'
], function(Animation, AnimationContainer, AnimationState, QueueEngine) {

  'use strict';

  describe('Queue Engine test', function() {

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
          shapeId: '4',
          start: 'afterPrevious',
          type: 'enterance',
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
      AnimationContainer.addAnimation(_animationObj);
      AnimationContainer.setDcpSlideIndex(1);
      AnimationContainer.addAnimation(_animationObj);
    });

    afterEach(function() {
      _animationObj = undefined;
      AnimationContainer.clearAnimationQueue();
    });

    it('should return true if animation ready to be played is an "onClick" ' +
        'animation', function() {
          spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(0);
          spyOn(AnimationState, 'getSlideIndex').andReturn(0);

          expect(QueueEngine.isToBeAnimatedOnClick()).toBe(true);
        });

    it('should return false if animation ready to be played is not ' +
        'an "onClick" animation', function() {
          spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(0);
          spyOn(AnimationState, 'getSlideIndex').andReturn(1);

          expect(QueueEngine.isToBeAnimatedOnClick()).toBe(false);
        });

    it('should return ture if animation ready to be played is ' +
        'an "after previous" animation', function() {
          spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(0);
          spyOn(AnimationState, 'getSlideIndex').andReturn(1);

          expect(QueueEngine.isToBeAnimatedAfterPrevious()).toBe(true);
        });

    it('should return ture if animation ready to be played is not ' +
        'an "after previous" animation', function() {
          spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(0);
          spyOn(AnimationState, 'getSlideIndex').andReturn(0);

          expect(QueueEngine.isToBeAnimatedAfterPrevious()).toBe(false);
        });
  });
});
