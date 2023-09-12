// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview InitialSetupEngine is the animation engine responsible for
 * the initial setup of animations (ie. -webkit-keyframes and visibility).
 * Executed by the AnimationRequestHandler interface when moving to the next
 * slide in slideshow mode.
 * It creates an Effect Strategy object for each animation object in the
 * animation queue for that slide.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationQueryContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/effectStrategy',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/widgets/shape/shape'
], function(AnimationContainer, AnimationQueryContainer, AnimationState,
            EffectStrategy, ErrorCatcher, QOWTSilentError, ShapeWidget) {

  'use strict';

  /**
   * @private
   * keeps track if a slide has been played or not.
   */
  var _slidePlayed = [];

  /**
   * Public interface
   */
  var _api = {
    /**
     * Called by slide container widget via the AnimationRequestHandler
     * when moving to a new slide in slideshow mode.
     * Getting ready to play the animations
     * Create the effect strategy for each animation object.
     * Set up the initial state (entrance animations: hidden and
     * exit animations: visible) before starting animations.
     *
     * @param {number} slideIndex index to the current slide.
     * @param {object} slideSize size of the slide (width and height).
     */
    setupAnimations: function(slideIndex, slideSize) {
      var animation,
          shapeAnimation = {};//animations on the same shape(multiple animation)

      if (AnimationQueryContainer.hasAnimationForSlide(slideIndex)) {

        // save the slide index and the slide size
        AnimationState.setSlideIndex(slideIndex);

        //update the shape id of animation applied to text Element
        _updateAnimationObjShapeId();

        // We are moving to a new slide
        AnimationState.startFromFirstAnimation();

        // We are playing the slide so set slidePlayed
        _setSlidePlayed();

        // Creates an Effect Strategy object for each animation.
        // Adds a reference to the Effect Strategy object to each corresponding
        // animation in the queue.
        for (var i = 0, length = AnimationContainer.
            getAnimationCountForSlide(slideIndex);
             i < length; i++) {
          animation = AnimationContainer.getAnimationForSlide(slideIndex, i);

          // create the Effect Strategy
          if (animation.getEffectStrategy() === undefined) {
            animation.setEffectStrategy(
              EffectStrategy.create(animation, slideSize));
          }
          // if we don't encounter animations on the same shape we set up
          // the initial state
          if (shapeAnimation[animation.getAnimationShapeId()] !== true) {
            shapeAnimation[animation.getAnimationShapeId()] = true;
            if (animation.getEffectStrategy()) {
              animation.getEffectStrategy().setupInitialState();
            }
          }
        }
      }
    },

    /**
     * Returns true if the current slide has been played already.
     * Used by the History Setup Engine to decide how going back should work.
     */
    isSlidePlayed: function() {
      return _slidePlayed[AnimationState.getSlideIndex()];
    },

    /**
     * Resets slidePlayed.
     * Used by the the Animation CleanUp Engine when exiting the slideshow.
     */
    resetSlidePlayed: function() {
      _slidePlayed = [];
    }
  };

  /**
   * @private
   * Set slidePlayed for the current slide to true.
   */
  var _setSlidePlayed = function() {
    _slidePlayed[AnimationState.getSlideIndex()] = true;
  };

  /**
   * updates animation shape ID with paragrpah id and parantNode id of table to
   * animate paragraph and table
   */
  var _updateAnimationObjShapeId = function() {
    var animations = AnimationContainer.
        getAllAnimationsForSlide(AnimationState.getSlideIndex());

    if (!animations) {
      return;
    }

    for (var i = 0; i < animations.length; i++) {
      var animation = animations[i];

      var shapeWidget = ShapeWidget.create({
        fromId: animation.getAnimationShapeId()
      });

      if (!shapeWidget) {
        continue;
      }

      var shapeNode = shapeWidget.getWidgetElement();
      if (shapeNode.tagName === 'TABLE') {
        animation.setAnimationShapeId(shapeNode.parentNode.id);
      }

      // for animation applied to paragraph
      var animatedTextElement = animation.getAnimatedTxElm();
      // Ignore if animation is not specified for Text element.
      // Paragraph Text Range is optional as per ooxml specs.
      if (!animatedTextElement || !animatedTextElement.pRg) {
        continue;
      }
      if (!animatedTextElement.pRg.st) {
        // start and end must be specified for PRg
        var silentError = new QOWTSilentError('Start not specified for ' +
            'Paragraph Text Range');
        ErrorCatcher.handleError(silentError);
        continue;
      }
      var shapeTextBodyWidget = shapeWidget.getShapeTextBodyWidget();
      var animationStartPara = shapeTextBodyWidget &&
          shapeTextBodyWidget.getParagraphNode(animatedTextElement.pRg.st);
      // Ignore animation specified for non exiting paragraph.
      if (!animationStartPara) {
        continue;
      }
      animation.setAnimationShapeId(animationStartPara.id);
    }

  };

  return _api;
});