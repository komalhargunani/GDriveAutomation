// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview The responsibility of the Query Container is to run various
 * complex queries on the Animation Container. All access to the Animation
 * Container happens through the Query Container and animation engines need to
 * run complex queries on the Animation Container.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationState'
], function(AnimationContainer, AnimationState) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {

    /**
     * Returns true if _toBeAnimatedIndex is pointing to the first animation
     * of the queue.
     */
    isFirstAnimation: function() {
      if (AnimationState.getToBeAnimatedIndex() === 0) {
        return true;
      }
      return false;
    },

    /**
     * Returns true if the animation queue is defined.
     */
    isQueueDefined: function() {
      var _slideIndex = AnimationState.getSlideIndex();
      return AnimationContainer.getAllAnimationsForSlide(_slideIndex) !==
          undefined;
    },

    /**
     * Returns true if the animation queue for the current slide is empty.
     */
    isQueueEmpty: function() {
      var _slideIndex = AnimationState.getSlideIndex();
      if (AnimationContainer.getAnimationCountForSlide(_slideIndex) === 0) {
        return true;
      }
      return false;
    },

    /**
     * Returns true if we have reached the end of the animation queue for
     * the current slide.
     */
    isEndOfQueue: function() {
      var _toBeAnimatedIndex = AnimationState.getToBeAnimatedIndex();
      var _slideIndex = AnimationState.getSlideIndex();
      if (_toBeAnimatedIndex === AnimationContainer.getAnimationCountForSlide(
          _slideIndex)) {
        return true;
      }
      return false;
    },

    /**
     * Returns true if there are animations for the given slide.
     * @param {number} slideIndex index of the slide.
     */
    hasAnimationForSlide: function(slideIndex) {
      var _animationQueue = AnimationContainer.getAllAnimationsForSlide(
          slideIndex);
      if (_animationQueue && _animationQueue.length > 0) {
        return true;
      }

      return false;
    },

    /**
     * Returns true if there is an animation to be played in the queue.
     * @param {number} slideIndex index of the slide.
     */
    isAnimationToBePlayed: function(slideIndex) {
      var _toBeAnimatedIndex = AnimationState.getToBeAnimatedIndex();
      var _animationQueue = AnimationContainer.getAllAnimationsForSlide(
          slideIndex);

      if (_api.hasAnimationForSlide(slideIndex) &&
          _toBeAnimatedIndex < AnimationContainer.getAnimationCountForSlide(
              slideIndex) && _animationQueue[_toBeAnimatedIndex]) {
        return true;
      }
      return false;
    },

    /**
     * Returns true if there is an animation in the queue before the one that
     * has been played.
     * @param {number} slideIndex index of the slide.
     */
    isPreviousAnimationToBePlayed: function(slideIndex) {
      var _toBeAnimatedIndex = AnimationState.getToBeAnimatedIndex();
      var _animationQueue = AnimationContainer.getAllAnimationsForSlide(
          slideIndex);

      if (_api.hasAnimationForSlide(slideIndex) &&
        _toBeAnimatedIndex > 0 &&
        _animationQueue[_toBeAnimatedIndex - 1]) {
        return true;
      }
      return false;
    },

    /**
     * Returns the animation in the queue ready to be animated.
     */
    getToBeAnimation: function() {
      var _toBeAnimatedIndex = AnimationState.getToBeAnimatedIndex();
      var _animationQueue = AnimationContainer.getAllAnimationsForSlide(
          AnimationState.getSlideIndex());

      if (_api.isQueueDefined() && !_api.isQueueEmpty() &&
          _toBeAnimatedIndex < AnimationContainer.getAnimationCountForSlide(
              AnimationState.getSlideIndex())) {
        return _animationQueue[_toBeAnimatedIndex];
      }
      return undefined;
    },

    /**
     * Returns the previous animation in the queue.
     */
    getPreviousAnimation: function() {
      var _toBeAnimatedIndex = AnimationState.getToBeAnimatedIndex();
      var _animationQueue = AnimationContainer.getAllAnimationsForSlide(
          AnimationState.getSlideIndex());

      if (_api.isQueueDefined() && !_api.isQueueEmpty() &&
        _toBeAnimatedIndex > 0) {
        return _animationQueue[_toBeAnimatedIndex - 1];
      }
      return undefined;
    }

  };

  return _api;
});