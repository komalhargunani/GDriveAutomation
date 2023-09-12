// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview GoBackEngine is the engine responsible for going back in the
 * animation history. Handles goBackInAnimationHistory, called on key down
 * events.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/animationQueryContainer',
  'qowtRoot/controls/point/animation/queueEngine'
], function(AnimationState, AnimationQueryContainer,
            QueueEngine) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {
    /**
     * Returns true if there is an animation in the queue before the current
     * one.
     * @param {number} slideIndex index of the slide.
     */
    isPreviousAnimationToBePlayed: function(slideIndex) {
      return AnimationQueryContainer.isPreviousAnimationToBePlayed(slideIndex);
    },

    /**
     * Called by thumbnail strip widget when we have a up, left or backspace
     * key down events.
     * Goes back in the animation history without showing animations.
     * Before calling this function we must call
     * isPreviousAnimationToBePlayed().
     */
    goBackInAnimationHistory: function() {
      var toBeAnimated;
      var isThereAnOnClickAnimation = false;

      do {
        AnimationState.decrementToBeAnimatedIndex();
        toBeAnimated = AnimationQueryContainer.getToBeAnimation();
        if (toBeAnimated && toBeAnimated.getAnimationStart() === "onClick") {
          isThereAnOnClickAnimation = true;
        }
        // When going back do not set up the initial state if there are two
        // consecutive entrance or exit animations
        if (toBeAnimated && toBeAnimated.getEffectStrategy() &&
            !QueueEngine.twoConsecutiveAnimationsSameShape("exit") &&
            !QueueEngine.twoConsecutiveAnimationsSameShape("entrance")) {
          toBeAnimated.getEffectStrategy().setupInitialState();
        }
      }
      while (!AnimationQueryContainer.isFirstAnimation() &&
          !isThereAnOnClickAnimation);
    }
  };

  return _api;
});