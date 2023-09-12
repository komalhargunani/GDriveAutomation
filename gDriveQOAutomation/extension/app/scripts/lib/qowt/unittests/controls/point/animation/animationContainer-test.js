// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for animation container
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */


define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationContainer'
], function(
    Animation,
    AnimationContainer) {

  'use strict';

  describe('Animation Container', function() {

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

    it('Should return proper count of animated Slide - getAnimatedSlideCount',
       function() {
         expect(AnimationContainer.getAnimatedSlideCount()).toEqual(2);
       });

    it('should return proper count of animation in ' +
        'slide - getAnimationCountForSlide', function() {
          expect(AnimationContainer.getAnimationCountForSlide(0)).toEqual(1);
        });

    it('Should return proper animation object if given slideIndex and ' +
        'animationIndex - getAnimationForSlide', function() {
          _animationObj = AnimationContainer.getAnimationForSlide(0, 0);
          expect(_animationObj.getAnimationType()).toEqual(_animation1.type);
        });

    it('Should return all animation for slide - getAllAnimationsForSlide',
       function() {
         var _animationsForSlide =
             AnimationContainer.getAllAnimationsForSlide(0);
         expect(_animationsForSlide.length).toEqual(1);
       });
  });
});
