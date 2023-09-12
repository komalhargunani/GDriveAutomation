// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview QueueEngine provides methods used by the other engines to query
 * the animation queue.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationQueryContainer'
], function(AnimationQueryContainer) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {

    /**
     * Returns true if the animation ready to be played is
     * an "on click" animation. Returns false otherwise.
     */
    isToBeAnimatedOnClick: function() {
      if (AnimationQueryContainer.getToBeAnimation() &&
          AnimationQueryContainer.getToBeAnimation().getAnimationStart() ===
              'onClick') {
        return true;
      }
      return false;
    },

    /**
     * Returns true if the animation ready to be played is
     * an "after previous" animation. Returns false otherwise.
     */
    isToBeAnimatedAfterPrevious: function() {
      if (AnimationQueryContainer.getToBeAnimation() &&
          AnimationQueryContainer.getToBeAnimation().getAnimationStart() ===
              'afterPrevious') {
        return true;
      }
      return false;
    },

    /**
     * Returns true if there are 2 consecutive animations on the same shape
     * of the given type.
     *
     * When playing aniamtions, if the current animation and the previous
     * animation are both exit and are applied to the same shape,
     * we don't want to show any animation.
     *
     * @param {string} animationType The type of the animation.
     */
    twoConsecutiveAnimationsSameShape: function(animationType) {
      var toBeAnimated = AnimationQueryContainer.getToBeAnimation();
      var previousAnimation = AnimationQueryContainer.getPreviousAnimation();
      return (toBeAnimated.getAnimationType() === animationType &&
          previousAnimation !== undefined &&
          previousAnimation.getAnimationType() === animationType &&
          toBeAnimated.getAnimationShapeId() === previousAnimation.
              getAnimationShapeId());
    }
  };

  return _api;
});