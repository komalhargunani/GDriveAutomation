// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Base Animation builder object. DCP handlers would pass
 * animation builder objects among each other and feed the animation builder
 * with dcp data and animation builder build the appropriate animation object
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([], function() {

  'use strict';

  var _factory = {

    create: function(_animationObj) {

      // use module pattern for instance object
      var module = function() {


        /**
         * Public interface
         */
        var _api = {

          /**
           * Sets the shape id for an animation.
           * @param {string} shapeId The shape id.
           */
          setAnimationShapeId: function(shapeId) {
            _animationObj.setAnimationShapeId(shapeId);
          },

          /**
           * Sets how an animation starts ("onClick", "afterPrevious" or
           * "withPrevious").
           * @param {string} start The start option.
           */
          setAnimationStart: function(start) {
            _animationObj.setAnimationStart(start);
          },

          /**
           * Sets the animation type ("entrance", "emphasis" or "exit").
           * @param {string} type The type option.
           */
          setAnimationType: function(type) {
            _animationObj.setAnimationType(type);
          },

          /**
           * Sets the animation effect ("appear", "fade", "fly", etc).
           * @param {string} effect The effect name.
           */
          setAnimationEffect: function(effect) {
            _animationObj.setAnimationEffect(effect);
          },

          /**
           * Sets the animation duration.
           * Sets the durationSet to true signifying that the duration was set.
           * @param {number} duration The duration of the animation in ms.
           */
          setAnimationDuration: function(duration) {
            if (duration) {
              _animationObj.setAnimationDuration(duration);
            }
          },

          /**
           * Sets the animation delay.
           * @param {number} delay The delay of the animation in ms.
           */
          setAnimationDelay: function(delay) {
            _animationObj.setAnimationDelay(delay);
          },

          /**
           * Sets the animation repeat count.
           * @param {number|string} repeatCount The animation repeat count
           *                                    (an integer or "infinite")
           */
          setAnimationRepeatCount: function(repeatCount) {
            _animationObj.setAnimationRepeatCount(repeatCount);
          },

          /**
           * Sets the animation repeat end condition.
           * @param {string} condition The repeat end condition ("onNextClick").
           */
          setAnimationRepeatEnd: function(condition) {
            _animationObj.setAnimationRepeatEnd(condition);
          },


          /**
           * Set an animBg flag to animate background.
           * @param animBg
           */
          setAnimBg: function(animBg) {
            _animationObj.setAnimBg(animBg);
          },

          /**
           * set as animTxElm flag to animate text as per paragraph range
           * @param animTxElm
           */
          setAnimatedTxElm: function(animTxElm) {
            _animationObj.setAnimatedTxElm(animTxElm);
          },

          /**
           * Gets the flyin animation object
           */
          getAnimation: function() {
            return _animationObj;
          }
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };


  return _factory;
});
