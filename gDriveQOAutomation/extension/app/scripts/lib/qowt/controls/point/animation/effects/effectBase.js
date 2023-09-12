// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview EffectBase is the base object for all the animation effects.
 *
 * It defines the interface to add and remove css rules for animations and
 * the effect objects that extend EffectBase can override its methods.
 * In particular each effect object need to implement the addKeyframesRule
 * method that is specific to each effect.
 *
 * It provided the implementation of addAnimationRule that add the css for
 * animations using webkit-animation rules and removeAnimationRule
 *
 * To handle the CSS, it uses the addRuleNow method of the CssManager that
 * add rules just in time.
 *
 * The CSS rules use as selector the shape id.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/cssManager'
], function(CssManager) {

  'use strict';

  var _factory = {

    /**
     * Creates an Appear Effect object.
     * @param {string} effectName The effect name.
     * @param {object} animation The animation object.
     */
    create: function(effectName, animation) {

      // use module pattern for instance object
      var module = function() {

        /**
         * @private
         * Private data
         */
        var _shapeIdSelector;

        /**
         * Public interface
         */
        var _api = {

          /**
           * Add the keyframes rule that describes each animation.
           * This method must be implemented by each Effect object.
           */
          addKeyframesRule: function() {
          },

          /**
           * Add the webkit-animation rule that displays each animation.
           * This method is generally the same for each Effect object.
           */
          addAnimationRule: function() {
            var visibility;
            if (animation.getAnimationType() === "entrance") {
              visibility = "hidden";
            }
            else if (animation.getAnimationType() === "exit") {
              visibility = "visible";
            }

            // Position absolute is needed for tables for effects using
            // positioning in the keyframes (ie. fly).
            // All the other shapes already have position absolute.
            CssManager.addRuleNow(_shapeIdSelector,
                'position: relative;' +
                'visibility: ' + visibility + ';' +
                '-webkit-animation-name: ' + effectName + ';' +
                '-webkit-animation-delay: ' +
                    animation.getAnimationDelay() + 'ms;' +
                '-webkit-animation-duration: ' +
                    animation.getAnimationDuration() + 'ms;' +
                '-webkit-animation-iteration-count: ' +
                    animation.getAnimationRepeatCount() + ';' +
                '-webkit-animation-timing-function: linear;' +
                '-webkit-animation-fill-mode: forwards;');
          },

          /**
           * Remove the webkit-animation rule that displays each animation.
           * This method is generally the same for each Effect object.
           */
          removeAnimationRule: function() {
            CssManager.removeRuleNow(_shapeIdSelector);
          }
        };

        /**
         * @private
         * Constructor of the Effect Base object.
         */
        function _init() {
          if (animation === undefined || effectName === undefined) {
            throw new Error('EffectBase - missing constructor parameters!');
          }

          if (animation.getAnimationShapeId()) {
            _shapeIdSelector = "#" + animation.getAnimationShapeId();
          }

        }

        _init();
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

