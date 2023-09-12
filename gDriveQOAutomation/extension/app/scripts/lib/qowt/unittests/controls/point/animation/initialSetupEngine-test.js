// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for InitialSetupEngine.js
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/initialSetupEngine',
  'qowtRoot/utils/cssManager',
  'qowtRoot/widgets/shape/shape'
], function(
    Animation,
    AnimationContainer,
    AnimationState,
    InitialSetupEngine,
    CssManager,
    ShapeWidget) {

  'use strict';

  describe('InitialSetupEngine test', function() {

    var _animationObj;

    var _getSlideSize = function() {
      return {
        width: 700,
        height: 600
      };
    };

    beforeEach(function() {
      _animationObj = Animation.create();
      _animationObj.setAnimatedTxElm({pRg: {st: 2}});
      spyOn(AnimationContainer, 'getAllAnimationsForSlide').
          andReturn([_animationObj]);
      spyOn(AnimationContainer, 'getAnimationForSlide').
          andReturn(_animationObj);
      spyOn(AnimationContainer, 'getAnimationCountForSlide').andReturn(1);
    });

    afterEach(function() {
      _animationObj = undefined;
    });

    it('should set proper slideIndex and toBeAnimatedindex before animation ' +
        'start to play', function() {
          var slideIndex = 0;
          InitialSetupEngine.setupAnimations(slideIndex, _getSlideSize());

          //Check value from animationstate are proper or not.
          expect(AnimationState.getSlideIndex()).toEqual(0);
          expect(AnimationState.getToBeAnimatedIndex()).toEqual(0);
        });

    it('should call create proper css for Animation before animation start ' +
        'to play', function() {
          var slideIndex = AnimationState.getSlideIndex();

          spyOn(CssManager, 'addRuleNow');
          InitialSetupEngine.setupAnimations(slideIndex, _getSlideSize());
          expect(CssManager.addRuleNow).toHaveBeenCalled();
        });

    it('should set specified animations only for existing paragraph',
        function() {
          var slideIndex = AnimationState.getSlideIndex();
          var paragraphNode;
          spyOn(_animationObj, 'setAnimationShapeId');
          // Create a shapeWidget without paragraph
          spyOn(ShapeWidget, 'create').andReturn(
              {
                getWidgetElement: function() {return {};},
                getShapeTextBodyWidget: function() {
                  return {
                    // Return undefined paragraph.
                    getParagraphNode: function() {return paragraphNode;}
                  };
                }
              });
          InitialSetupEngine.setupAnimations(slideIndex, _getSlideSize());
          expect(_animationObj.setAnimationShapeId).not.toHaveBeenCalled();
          // paragraphNode is defined, we should set animations.
          paragraphNode = {};
          InitialSetupEngine.setupAnimations(slideIndex, _getSlideSize());
          expect(_animationObj.setAnimationShapeId).toHaveBeenCalled();
        });
  });
});
