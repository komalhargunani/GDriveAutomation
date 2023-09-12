// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The responsibility of this module is to maintain the animation
 * state on behalf of the Animation Container. As the Engines drive the
 * animation and gets access to the Animation Container via the various Query
 * Containers, the slideIndex and the toBeAnimatedIndex is maintained by the
 * Animation State module.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([], function() {

  'use strict';


  /**
   * @private
   * _slideIndex: The slide index.
   * _toBeAnimatedIndex: The index of the animation object to be animated.
   */
  var _slideIndex = 0,
    _toBeAnimatedIndex = 0;

  /**
   * Public interface
   */
  var _api = {

    /**
     * Returns the _toBeAnimatedIndex (index of the animation object to be
     * animated)
     */
    getToBeAnimatedIndex: function() {
      return _toBeAnimatedIndex;
    },

    /**
     * Returns the slide index used when playing animations.
     */
    getSlideIndex: function() {
      return _slideIndex;
    },

    /**
     * Sets the slide index used when playing animations.
     * @param {number} slideIndex The slide index to set.
     */
    setSlideIndex: function(slideIndex) {
      _slideIndex = slideIndex;
    },

    /**
     * Sets _toBeAnimatedIndex (index of the animation object to be animated)
     * to zero, i.e. to the start of the animation queue.
     */
    startFromFirstAnimation: function() {
      _toBeAnimatedIndex = 0;
    },

    /**
     * Sets _toBeAnimatedIndex to the end of the animation queue.
     * We go one past the end of the queue to signify we have played all the
     * animations.
     */
    startFromEndAnimation: function(animationQueueLength) {
      _toBeAnimatedIndex = animationQueueLength;
    },

    /**
     * Increments _toBeAnimatedIndex by one.
     */
    incrementToBeAnimatedIndex: function() {
      _toBeAnimatedIndex += 1;
    },

    /**
     * Decrements _toBeAnimatedIndex by one.
     */
    decrementToBeAnimatedIndex: function() {
      _toBeAnimatedIndex -= 1;
    },

    /**
     * Clears the animation queue are resets the indexes (used by unit tests).
     */
    clearAnimationQueue: function() {
      _slideIndex = 0;
      _toBeAnimatedIndex = 0;
    }

  };


  return _api;
});