// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for goBackEngine.js
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/animationQueryContainer',
  'qowtRoot/controls/point/animation/initialSetupEngine',
  'qowtRoot/controls/point/animation/playEngine',
  'qowtRoot/controls/point/animation/goBackEngine'
], function(
    Animation,
    AnimationContainer,
    AnimationState,
    AnimationQueryContainer,
    InitialSetupEngine,
    PlayEngine,
    GoBackEngine) {

  'use strict';

  describe('goBackEngine test', function() {

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
      AnimationContainer.addAnimation(_animationObj);
    });

    afterEach(function() {
      _animationObj = undefined;
      AnimationContainer.clearAnimationQueue();
    });

    it('check whether previous animation to be played or not', function() {
      var slideIndex = 0;
      spyOn(AnimationState, 'getToBeAnimatedIndex').andReturn(1);
      expect(AnimationQueryContainer.isPreviousAnimationToBePlayed(slideIndex)).
          toBe(true);
    });

    it('Should decerement toBeAnimated index while going Back', function() {
      InitialSetupEngine.setupAnimations();
      PlayEngine.playOnClick();
      GoBackEngine.goBackInAnimationHistory();
      expect(AnimationState.getToBeAnimatedIndex()).toEqual(0);
    });
  });
});
