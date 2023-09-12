// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview It is the engine responsible for playing animations and deals
 * with the different options, for example on Click, With Previous and After
 * Previous animations and animations with Repeat Count. Handles playOnClick,
 * called on click and on key down events and playAutomatic, called when the
 * first animation of a slide needs to be played automatically
 * (if it is a with previous or after previous animation).
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationState',
  'qowtRoot/controls/point/animation/animationQueryContainer',
  'qowtRoot/controls/point/animation/queueEngine'
], function(AnimationState, AnimationQueryContainer, QueueEngine) {

  'use strict';

  /**
   * @constant
   * We don't set timeout less than _kMIN_DURATION
   */
  var _kMIN_DURATION = 4;

  /**
   * @private
   */
  var _animationTimeout;

  /**
   * Public interface
   */
  var _api = {
    /**
     * Play animations automatically.
     * Called when the first animation is not onClick.
     */
    playAutomatic: function() {
      // Making sure the first animation of a slide is not onClick
      if (AnimationQueryContainer.isFirstAnimation() &&
          !QueueEngine.isToBeAnimatedOnClick()) {
        _playAnimationFrame();
      }
    },

    /**
     * Returns true if there is an animation in the queue ready to be executed.
     * @param {number} slideIndex The slide index.
     */
    isAnimationToBePlayed: function(slideIndex) {
      return AnimationQueryContainer.isAnimationToBePlayed(slideIndex);
    },

    /**
     * Play animations when a click or mouse down event occurs.
     * Before calling this function isAnimationToBePlayed() must be called.
     * Called by presentation layout or thumbnail strip widget when we have a
     * mouse click or a key down event (down, right, space or enter).
     */
    playOnClick: function() {
      _stopAnimationFrame();
      _playAnimationFrame();
    }
  };

  /**
   * @private
   * Plays all consecutive animations until "afterPrevious" or "onClick".
   * Processes the first animation in the queue. Keep playing animations
   * until we have "onClick" or "afterPrevious" animations.
   */
  var _playAnimationFrame = function() {
    while (true) {
      if (AnimationQueryContainer.isQueueEmpty() ||
          AnimationQueryContainer.isEndOfQueue()) {
        break;
      }

      _playCssAnimation();
      AnimationState.incrementToBeAnimatedIndex();

      if (AnimationQueryContainer.isEndOfQueue() ||
          QueueEngine.isToBeAnimatedOnClick()) {
        break;
      }

      // if the animation is after previous we have to respect the
      // delay, duration and repeat count of the previous animation
      // we simply wait for previous animation's
      // (delay + duration) * repeat count
      if (QueueEngine.isToBeAnimatedAfterPrevious() &&
          (AnimationQueryContainer.getPreviousAnimation().
              getAnimationDelay() !== 0 ||
              AnimationQueryContainer.getPreviousAnimation().
                  getAnimationDuration() > _kMIN_DURATION)) {
        var waitMultiplier = _getWaitMultiplier();
        var waitFor = AnimationQueryContainer.getPreviousAnimation().
            getAnimationDelay() + AnimationQueryContainer.
            getPreviousAnimation().getAnimationDuration();
        _wait(waitFor * waitMultiplier);
        break;
      }
    }
  };

  /**
   * @private
   * Plays the CSS animation. Called by _playAnimationFrame().
   */
  var _playCssAnimation = function() {
    var toBeAnimated = AnimationQueryContainer.getToBeAnimation();
    if (toBeAnimated && toBeAnimated.getEffectStrategy() &&
        !QueueEngine.twoConsecutiveAnimationsSameShape("exit")) {
      toBeAnimated.getEffectStrategy().play(); // play the animation
    }
  };

  /**
   * @private
   * Returns the wait multiplier. Called by _playAnimationFrame().
   * For animation with a repeat count not infinite, the wait multiplier is the
   * repeat count. For animation with a repeat count infinite, the wait
   * multiplier is 1.
   */
  var _getWaitMultiplier = function() {
    var previousAnimationRepeatCount;
    if (AnimationQueryContainer.getPreviousAnimation()) {
      previousAnimationRepeatCount =
          AnimationQueryContainer.getPreviousAnimation().
              getAnimationRepeatCount();
    }
    if (previousAnimationRepeatCount &&
        previousAnimationRepeatCount !== "infinite") {
      return previousAnimationRepeatCount;
    }
    return 1;
  };

  /**
   * @private
   * Calls _playAnimationFrame() on a timeout.
   * Called by _playAnimationFrame().
   *
   * @param {number} totalWait The total wait in ms passed to setTimeout.
   */
  var _wait = function(totalWait) {
    _animationTimeout = setTimeout(_playAnimationFrame, totalWait);
  };

  /**
   * @private
   * Stops all the animations that are still animating if a click occurs.
   * Called by playOnClick().
   */
  var _stopAnimationFrame = function() {
    window.clearTimeout(_animationTimeout);
    while (true) {
      if (AnimationQueryContainer.isQueueEmpty()) {
        break;
      }
      _clearCssPreviousAnimation();
      if (QueueEngine.isToBeAnimatedOnClick() ||
          AnimationQueryContainer.isEndOfQueue()) {
        break;
      }
      AnimationState.incrementToBeAnimatedIndex();
    }
  };

  /**
   * @private
   * Clears the css rule for the previous animation.
   */
  var _clearCssPreviousAnimation = function() {
    // If this is the first animation of a slide, we can't clear the previous
    // animation, so we return.
    if (AnimationQueryContainer.isFirstAnimation()) {
      return;
    }
    if (AnimationQueryContainer.getPreviousAnimation().
            getAnimationRepeatCount() === 'infinite' &&
        AnimationQueryContainer.getPreviousAnimation().
            getAnimationRepeatEnd() !== 'onNextClick') {
      return;
    }
    var animatingObject = AnimationQueryContainer.getPreviousAnimation();
    if (animatingObject && animatingObject.getEffectStrategy()) {
      animatingObject.getEffectStrategy().removeAnimation();
      animatingObject.getEffectStrategy().setupFinalState();
    }
  };

  return _api;
});