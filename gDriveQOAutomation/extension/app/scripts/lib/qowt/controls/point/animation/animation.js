// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Animation factory to create animation objects.
 * An animation object is created for each animation in the presentation.
 * Animation objects are created by the DCP Handlers when visiting the
 * animation data. Different DCP Handlers contributes to populate each
 * animation object, calling the setter methods.
 * When an animation object has been populated it is added to the animation
 * queue handled by the Animation Queue Manager.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([], function() {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * @private
         * Default options for an animation.
         * Makes sure that the duration is always initialized to some value.
         * The default animation is an entrance fade.
         *
         * durationSet maintains the state of whether the duration was set
         * or not.
         */
        var _animation = {
          start: "onClick",
          type: "entrance",
          effect: "fade",
          duration: 1,
          delay: 0,
          repeatCount: 1,
          durationSet: false
        };

        /**
         * Public interface
         */
        var _api = {

          /**
           * Sets the shape id for an animation.
           * @param {string} shapeId The shape id.
           */
          setAnimationShapeId: function(shapeId) {
            if (shapeId) {
              _animation.shapeId = shapeId;
            }
          },

          /**
           * Sets how an animation starts ("onClick", "afterPrevious" or
           * "withPrevious").
           * @param {string} start The start option.
           */
          setAnimationStart: function(start) {
            if (start) {
              _animation.start = start;
            }
          },

          /**
           * Sets the animation type ("entrance", "emphasis" or "exit").
           * @param {string} type The type option.
           */
          setAnimationType: function(type) {
            if (type) {
              _animation.type = type;
            }
          },

          /**
           * Sets the animation effect ("appear", "fade", "fly", etc).
           * @param {string} effect The effect name.
           */
          setAnimationEffect: function(effect) {
            if (effect) {
              _animation.effect = effect;
            }
          },

          /**
           * Sets the animation duration.
           * Sets the durationSet to true signifying that the duration was set.
           * @param {number} duration The duration of the animation in ms.
           */
          setAnimationDuration: function(duration) {
            if (duration) {
              _animation.duration = duration;
            }
          },

          /**
           * Sets the animation delay.
           * @param {number} delay The delay of the animation in ms.
           */
          setAnimationDelay: function(delay) {
            if (delay) {
              _animation.delay = delay;
            }
          },

          /**
           * Sets the animation repeat count.
           * @param {number|string} repeatCount The animation repeat count
           *                                    (an integer or "infinite")
           */
          setAnimationRepeatCount: function(repeatCount) {
            if (repeatCount) {
              _animation.repeatCount = repeatCount;
            }
          },

          /**
           * Sets the animation repeat end condition.
           * @param {string} condition The repeat end condition ("onNextClick").
           */
          setAnimationRepeatEnd: function(condition) {
            if (condition) {
              _animation.repeatEnd = condition;
            }
          },

          /**
           * Set an effect strategy object.
           * @param {object} effectStrategy The effect strategy object.
           */
          setEffectStrategy: function(effectStrategy) {
            if (effectStrategy) {
              _animation.effectStrategy = effectStrategy;
            }
          },

          /**
           * Set an animBg flag to animate background.
           * @param animBg
           */
          setAnimBg: function(animBg) {
            _animation.animBg = animBg;
          },

          /**
           * set as animTxElm flag to animate text as per paragraph range
           * @param animTxElm
           */
          setAnimatedTxElm: function(txElm) {
            _animation.txElm = txElm;
          },


          /**
           * Returns the shape id for an animation.
           */
          getAnimationShapeId: function() {
            return _animation.shapeId;
          },

          /**
           * Returns how an animation starts ("onClick", "afterPrevious" or
           * "withPrevious").
           */
          getAnimationStart: function() {
            return _animation.start;
          },

          /**
           * Returns the animation type ("entrance", "emphasis" or "exit").
           */
          getAnimationType: function() {
            return _animation.type;
          },

          /**
           * Returns the animation effect ("appear", "fade", "fly", etc).
           */
          getAnimationEffect: function() {
            return _animation.effect;
          },

          /**
           * Returns the animation duration in ms.
           */
          getAnimationDuration: function() {
            return _animation.duration;
          },


          /**
           * Returns the animation delay in ms.
           */
          getAnimationDelay: function() {
            return _animation.delay;
          },

          /**
           * Gets the animation repeat count (number or "infinite").
           */
          getAnimationRepeatCount: function() {
            return _animation.repeatCount;
          },

          /**
           * Gets the animation repeat end condition ("onNextClick").
           */
          getAnimationRepeatEnd: function() {
            return _animation.repeatEnd;
          },

          /**
           * Returns the effect strategy object.
           */
          getEffectStrategy: function() {
            return _animation.effectStrategy;
          },


          /**
           * Return an animBg flag to animate background.
           * @param animBg
           */
          getAnimBg: function() {
            return _animation.animBg;
          },

          /**
           * Return an animTxElm flag to animate text as per paragraph range
           * @param animTxElm
           */
          getAnimatedTxElm: function() {
            return _animation.txElm;
          },

          /**
           * For debugging only - Returns the animation object.
           */
          getAnimationDebug: function() {
            return _animation;
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
