// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview AnimationRequestHandler acts as the sole interface to the
 * Animation Engines.
 * The AnimationRequestHandler liaises with the Animation Engines to perform
 * Animation related tasks.
 *
 * The following components access the Animation Request Handler:
 * 1) Slide Container Widget to set up Animations and play animations
 *    automatically. Also to set up the Animation History and going back in the
 *    animation playlist.
 * 2) Presentation Control and Thumbnail Strip to check if the
 *    slide has animations and play the animations.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/historySetupEngine',
  'qowtRoot/controls/point/animation/animationCleanUpEngine',
  'qowtRoot/controls/point/animation/goBackEngine',
  'qowtRoot/controls/point/animation/initialSetupEngine',
  'qowtRoot/controls/point/animation/playEngine'
], function(HistorySetupEngine, AnimationCleanUpEngine, GoBackEngine,
    InitialSetupEngine, PlayEngine) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {
    /**
     * Called by slide container widget when moving to a new slide in slideshow
     * mode.
     * Set up the initial state (entrance animations: hidden and exit
     * animations: visible) before starting animations.
     *
     * Acts as entry point before starting animations.
     *
     * @param {number} slideIndex index to the current slide.
     * @param {object} slideSize size of the slide (width and height).
     */
    setupAnimations: function(slideIndex, slideSize) {
      InitialSetupEngine.setupAnimations(slideIndex, slideSize);
    },

    /**
     * Called by slide container widget when going back to a previous slide in
     * slideshow mode.
     *
     * If the slide has not been played before we use setupAnimations to
     * to set up the animations to the initial state.
     *
     * If the slide has been played before we start from the last animation
     * in the slide.
     * Also resets the state of all the animation objects to final state
     * (as if the animation had already been played).
     *
     * Acts as entry point before going back in animation history.
     *
     * @param {number} slideIndex index to the current slide.
     * @param {object} slideSize size of the slide (width and height).
     */
    setupAnimationHistory: function(slideIndex, slideSize) {
      HistorySetupEngine.setupAnimationHistory(slideIndex, slideSize);
    },

    /**
     * Play animations automatically.
     * Used when the first animation of a slide is not onClick.
     * Called by the slide container widget as soon as the slide is loaded.
     *
     * Before calling this function isAnimationToBePlayed() must be called.
     * @see isAnimationToBePlayed()
     */
    playAutomatic: function() {
      PlayEngine.playAutomatic();
    },

    /**
     * Play animations when a click or mouse down event occurs.
     *
     * Called by the Presentation Control on mouse click event in
     * the slideshow mode.
     * Called by the Thumbnail Strip on key down, right arrow, space bar
     * and enter key events in the slideshow mode.
     *
     * Before calling this function isAnimationToBePlayed() must be called.
     * @see isAnimationToBePlayed()
     */
    playOnClick: function() {
      PlayEngine.playOnClick();
    },

    /**
     * Goes back in the animation history without showing animations.
     *
     * Called by thumbnail strip widget when we have a up, left or backspace
     * key down events.
     * Before calling this function isPreviousAnimationToBePlayed()
     * must be called.
     */
    goBackInAnimationHistory: function() {
      GoBackEngine.goBackInAnimationHistory();
    },

    /**
     * Returns true if there is an animation in the queue ready to be executed.
     * In other words there is an animation in the queue that has not been
     * animated yet.
     *
     * Called by the Presentation Control or by the Thumbnail Strip
     * to check if the slide has animation(s) before calling 
     * playOnClick and playAutomatic.
     *
     * Acts as an Entry point before calling playing (forward) animations.
     *
     * @param {number} slideIndex index to the current slide.
     * 
     * @see playOnClick 
     * @see playAutomatic
     */
    isAnimationToBePlayed: function(slideIndex) {
      return PlayEngine.isAnimationToBePlayed(slideIndex);
    },

    /**
     * Returns true if there is an animation in the queue before the current
     * one. Called by the Thumbnail Strip before calling the
     * goBackInAnimationHistory.
     *
     * Acts as an Entry point before calling playing (backward) animations.
     *
     * @param {number} slideIndex index to the current slide.
     * 
     * @see goBackInAnimationHistory
     */
    isPreviousAnimationToBePlayed: function(slideIndex) {
      return GoBackEngine.isPreviousAnimationToBePlayed(slideIndex);
    },

    /**
     * Removes all the css animation rules from every slide. Called when exiting
     * the slideshow.
     */
    cleanUp: function() {
      AnimationCleanUpEngine.cleanUp();
    }
  };

  return _api;
});
