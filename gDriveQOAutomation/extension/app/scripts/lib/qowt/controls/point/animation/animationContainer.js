// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the container of Animations. A sort of a matrix, where
 * each row contains Animation objects for each slide.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([], function() {

  'use strict';

  /**
   * @private
   * Holds animation data against slide index.
   */
  var _animationQueue = [];

  /**
   * @private
   * _dcpSlideIndex and _dcpAnimationIndex are used when the DCP Handlers
   * visit the DCP for animations.
   */
  var _dcpSlideIndex = 0,
      _dcpAnimationIndex = 0;


  /**
   * Public interface
   */
  var _api = {

    /**
     * Adds to the queue the animation object passed as argument and increments
     * the animation index to be ready when addAnimation is called again by the
     * DCP handlers.
     * @param {object} animation The animation object to be added.
     */
    addAnimation: function(animation) {
      _initializeAnimationQueue(_dcpSlideIndex, _dcpAnimationIndex);
      _animationQueue[_dcpSlideIndex][_dcpAnimationIndex] = animation;
      _dcpAnimationIndex += 1;
    },

    /**
     * Sets the slide index used when extracting animation data from the DCP.
     * Also sets the animation index to 0 because when we change DCP slide index
     * it means we are processing animation data for a different slide.
     * @param {number} dcpSlideIndex The slide index to set.
     */
    setDcpSlideIndex: function(dcpSlideIndex) {
      _dcpSlideIndex = dcpSlideIndex;
      _dcpAnimationIndex = 0;
    },


    /**
     * Returns the number of slides in the animation queue.
     */
    getAnimatedSlideCount: function() {
      return _animationQueue.length;
    },

    /**
     * Returns the number of animations for the passed slide index.
     * @param {number} slideIndex The slide index of the slide we want to know
     *                             the number of animations.
     */
    getAnimationCountForSlide: function(slideIndex) {
      if (_animationQueue[slideIndex] !== undefined) {
        return _animationQueue[slideIndex].length;
      }
      return 0;
    },

    /**
     * Returns the animation object for the given slide index and animation
     * index
     * @param {number} slideIndex index of the slide.
     * @param {number} animationIndex index of the animation.
     */
    getAnimationForSlide: function(slideIndex, animationIndex) {
      return _animationQueue[slideIndex][animationIndex];
    },

    /**
     * Returns the all animations in the slide
     * @param slideIndex {number} slideIndex  index of the slide
     */
    getAllAnimationsForSlide : function (slideIndex){
      return _animationQueue[slideIndex];
    },


    /**
     * Clears the animation queue are resets the indexes (used by unit tests).
     */
    clearAnimationQueue: function() {
      _animationQueue = [];
      _dcpSlideIndex = 0;
      _dcpAnimationIndex = 0;
    },

    /**
     * For debugging only - Provides access to the private data _animationQueue.
     */
    animationQueue: _animationQueue
  };

  /**
   * @private
   * Initialize the animation queue.
   * @param {number} slideIndex index of the slide.
   * @param {number} animationIndex index of the animation.
   */
  var _initializeAnimationQueue = function(slideIndex, animationIndex) {
    if (_animationQueue[slideIndex] === undefined) {
      _animationQueue[slideIndex] = [];
    }
    if (_animationQueue[slideIndex][animationIndex] === undefined) {
      _animationQueue[slideIndex][animationIndex] = {};
    }
  };

  return _api;
});