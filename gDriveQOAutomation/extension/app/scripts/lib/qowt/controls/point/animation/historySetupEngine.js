// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview HistorySetupEngine is the animation engine responsible for
 * setting up the animation history.
 * Executed by the AnimationRequestHandler interface when moving to a previous
 * slide in slideshow mode.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationQueryContainer',
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/initialSetupEngine'
], function(AnimationContainer, AnimationQueryContainer, AnimationState,
            InitialSetupEngine) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {

    /**
     * Called by slide container widget via the AnimationRequesthandler
     * when going back to a previous slide in slideshow mode.
     *
     * If the slide has been played before we start from the last animation of
     * the slide we run through all animation objects and remove all the
     * CSS animation properties and reset to final state.
     *
     * If the slide has already been played before we set it up to the
     * initial state by calling the setupAnimations.
     *
     * @see setupAnimations
     * @param {number} slideIndex index to the current slide.
     * @param {object} slideSize size of the slide (width and height).
     */
    setupAnimationHistory: function(slideIndex, slideSize) {
      var animation;

      if (AnimationQueryContainer.hasAnimationForSlide(slideIndex)) {
        AnimationState.setSlideIndex(slideIndex);

        // If we go back to a slide that has already been played
        // we start from the last animation of the slide.
        if (InitialSetupEngine.isSlidePlayed()) {
          // We are moving to a previous slide so we need to start from one past
          // the end of the queue.
          var animationQueueLength = AnimationContainer.
              getAnimationCountForSlide(slideIndex);
          AnimationState.startFromEndAnimation(animationQueueLength);
          // Removes all the animations from the slide we are going back to
          // and setups the final state of the animations.
          // Doesn't remove animation with repeat count infinite.
          for (var i = 0, length = animationQueueLength;
               i < length; i++) {
            animation = AnimationContainer.getAnimationForSlide(slideIndex, i);
            if (animation && animation.getEffectStrategy() &&
                animation.getAnimationRepeatCount() !== "infinite") {
              animation.getEffectStrategy().removeAnimation();
              animation.getEffectStrategy().setupFinalState();
            }
          }
        }
        // If we go back to a slide that hasn't been played yet
        // we start from the first animation of the slide.
        else {
          InitialSetupEngine.setupAnimations(slideIndex, slideSize);
        }
      }
    }
  };

  return _api;
});