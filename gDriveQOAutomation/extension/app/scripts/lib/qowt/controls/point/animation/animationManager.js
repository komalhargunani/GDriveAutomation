// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview animation manager holds the currnet animation builder object
 * and some of it's properties.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([], function() {

  'use strict';


  var _animationDelay, _animationRepeatEndEvent;
  var _currentAnimationBuilder;

  /**
   * Public interface
   */
  var _api = {

    /**
     * Sets the animation delay.
     * @param {number} delay The delay of the animation in ms.
     */
    setAnimationDelay: function(delay) {
      if (delay) {
        _animationDelay = delay;
      }
    },

    /**
     * Returnd the delay in animation
     */
    getAnimationDelay: function() {
      return _animationDelay;
    },


    /**
     * Sets the animation repeat end condition.
     * @param {string} condition The repeat end condition ("onNextClick").
     */
    setAnimationRepeatEnd: function(condition) {
      if (condition) {
        _animationRepeatEndEvent = condition;
      }
    },

    /**
     *  Returns the animation repeat end event
     */
    getAnimationRepeatEnd: function() {
      return _animationRepeatEndEvent;
    },

    /**
     * Set the current animation builder.
     * @param currentAnimationBuilder
     */
    setCurrentAnimationBuilder: function(currentAnimationBuilder) {
      _currentAnimationBuilder = currentAnimationBuilder;
    },

    /**
     * get the current animation builder.
     */
    getCurrentAnimationBuilder: function() {
      return _currentAnimationBuilder;
    },

    /**
     * Reset the current animation related properties
     */
    resetCurrentAnimationProperties: function() {
      _animationDelay = undefined;
      _animationRepeatEndEvent = undefined;
      _currentAnimationBuilder = undefined;
    }


  };

  return _api;
});