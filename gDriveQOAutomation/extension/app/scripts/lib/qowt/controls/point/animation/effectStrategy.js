// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Effect strategy factory to create effect strategy objects.
 * An EffectStrategy object is created by the Animation Engines
 * for each Animation object.
 * It takes care of setting up the initial state of an animation,
 * creating effect objects and setting up the final state of an animation.
 * To handle the CSS, it uses the addRuleNow method of the CssManager that
 * add rules just in time.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/cssManager',
  'qowtRoot/controls/point/animation/effects/appear',
  'qowtRoot/controls/point/animation/effects/fade',
  'qowtRoot/controls/point/animation/effects/fly',
  'qowtRoot/controls/point/animation/effects/emphasis'
], function(CssManager, AppearEffect, FadeEffect, FlyEffect, EmphasisEffect) {

  'use strict';

  var _factory = {

    /**
     * Creates an Effect Strategy object.
     *
     * @param {object} animation The animation object.
     * @param {object} slideSize The slide size (width, height).
     */
    create: function(animation, slideSize) {

      // Use module pattern for instance object
      var module = function() {

        /**
         * @private
         * Private data
         */
        var _animation,
            _shapeIdSelector,
            _effect;

        /**
         * Public interface
         */
        var _api = {

          /**
           * Plays an animation.
           */
          play: function() {
            _play();
          },

          /**
           * Sets up the initial state of an animation.
           * Called at the beginning when going to a new slide and also when
           * going back of an animation in the animation history,
           * to reset the effects and styles applied to the shape.
           */
          setupInitialState: function() {
            _setupInitialState();
          },

          /**
           * Sets up the final state of an animation.
           * Called when going back to a slide.
           */
          setupFinalState: function() {
            _setupFinalState();
          },

          /**
           * Removes the css animation rule.
           */
          removeAnimation: function() {
            _effect.removeAnimationRule();
          }
        };

        /**
         * @private
         * Builds and shows the css animation.
         */
        var _play = function() {
          _effect.addAnimationRule();
        };

        /**
         * @private
         * Sets up the initial state of an object with animation.
         */
        var _setupInitialState = function() {
          switch (_animation.getAnimationType()) {
            case "exit":
              CssManager.addRuleNow(_shapeIdSelector, {visibility: "visible"});
              break;
            case "entrance":
              CssManager.addRuleNow(_shapeIdSelector, {visibility: "hidden"});
              break;
            default:
              break;
          }
        };

        /**
         * @private
         * Sets up the final state of an object with animation.
         * Makes an object with exit animation hidden.
         */
        var _setupFinalState = function() {
          switch (_animation.getAnimationType()) {
            case "exit":
              CssManager.addRuleNow(_shapeIdSelector, {visibility: "hidden"});
              break;
            case "entrance":
              break;
            default:
              break;
          }
        };

        /**
         * @private
         * Constructor of the Effect Strategy object.
         * Creates also an Effect object for the animation.
         */
        var _init = function() {
          if (animation === undefined || slideSize === undefined) {
            throw new Error('EffectStrategy - missing constructor parameters!');
          }
          _animation = animation;
          if (_animation.getAnimationShapeId()) {
            _shapeIdSelector = "#" + _animation.getAnimationShapeId();
          }

          // TODO: At the moment we don't support emphasis animations, so we
          // create a default emphasis effect object. When we add support for
          // emphasis animations remove this if.
          if (_animation.getAnimationType() === "emphasis") {
            _effect = EmphasisEffect.create(_animation);
          }
          else {
            switch (_animation.getAnimationEffect()) {
              case "fade":
                _effect = FadeEffect.create(_animation);
                break;
              case "fly":
                _effect = FlyEffect.create(_animation, slideSize);
                break;
              case "appear":
                _effect = AppearEffect.create(_animation);
                break;
              default:
                break;
            }
          }
        };

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
