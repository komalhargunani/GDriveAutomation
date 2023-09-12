// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the handler for a Common Time Node.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/controls/point/animation/animationBuilders/flyAnimationBuilder',
  'qowtRoot/controls/point/animation/animationBuilders/appearAnimationBuilder',
  'qowtRoot/controls/point/animation/animationBuilders/fadeAnimationBuilder',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/animationEffectMap',
  'qowtRoot/controls/point/animation/animationManager'
], function(FlyAnimationBuilder, AppearAnimationBuilder,
            FadeAnimationBuilder, AnimationContainer, AnimationEffectMap,
            AnimationManager) {

  'use strict';

  /**
   * @private
   * Animation object.
   */
  var _animationBuilder;

  /**
   * Public interface
   */
  var _api = {

    /**
     * DCP Type Code.
     * This is used by the DCP Manager to register this handler.
     */
    etp: 'cTn',

    /**
     * Processes a 'cTn' (Common Time Node) element from a DCP response.
     *
     * @param {object} v A cTn element from a DCP response.
     * @return {object} An animation object.
     */
    visit: function(v) {

      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        _animationBuilder = AnimationManager.getCurrentAnimationBuilder();

        // When we meet "presetClass" in the visit means that we have found
        // a new animation in the dcp, so we create a new animation object.

        if (v.el.presetClass) {
          switch (AnimationEffectMap[v.el.presetID]) {
            case "appear":
              _animationBuilder = AppearAnimationBuilder.create();
              _animationBuilder.setAnimationEffect(
                AnimationEffectMap[v.el.presetID]);
              break;
            case "fly":
              _animationBuilder = FlyAnimationBuilder.create();
              _animationBuilder.setAnimationEffect(
                AnimationEffectMap[v.el.presetID]);
              //set the direction
              if (v.el.presetSubtype && parseInt(v.el.presetSubtype, 10)) {
                _animationBuilder.setPresetSubtype(v.el.presetSubtype);
              }
              break;
            case "fade":
              _animationBuilder = FadeAnimationBuilder.create();
              _animationBuilder.setAnimationEffect(
                AnimationEffectMap[v.el.presetID]);
              break;
            default:
              _animationBuilder = FadeAnimationBuilder.create();
              _animationBuilder.setAnimationEffect("fade");
              break;
          }

          switch (v.el.presetClass) {
            case "entr":
              _animationBuilder.setAnimationType("entrance");
              break;
            case "emph":
              _animationBuilder.setAnimationType("emphasis");
              break;
            case "exit":
              _animationBuilder.setAnimationType("exit");
              break;
            default:
              break;
          }

        }

        if (v.el.nodeType && _animationBuilder) {
          switch (v.el.nodeType) {
            case "clickEffect":
              _animationBuilder.setAnimationStart("onClick");
              break;
            case "withEffect":
              _animationBuilder.setAnimationStart("withPrevious");
              break;
            case "afterEffect":
              _animationBuilder.setAnimationStart("afterPrevious");
              break;
            default:
              break;
          }
        }

        if (v.el.repeatCount && _animationBuilder) {
          var repeatCount = v.el.repeatCount;
          if (repeatCount === "indefinite") {
            _animationBuilder.setAnimationRepeatCount("infinite");
          }
          else if (parseInt(repeatCount, 10)) {
            _animationBuilder.setAnimationRepeatCount(
              parseInt(repeatCount, 10) / 1000);
          }
        }
        //accepting duration as a valid integer and value is not equal to 0 or 1
        if (v.el.dur && parseInt(v.el.dur, 10) &&
          parseInt(v.el.dur, 10) !== 1 && _animationBuilder) {
          _animationBuilder.setAnimationDuration(parseInt(v.el.dur, 10));
        }

        // set currnet animation builder in animation manager to make it
        // available across all animation handler.
        AnimationManager.setCurrentAnimationBuilder(_animationBuilder);
      }
    },

    /**
     * Called after all of the child elements have been processed.
     * Adds an animation object to the animation queue.
     *
     * @param {object} v A cTn element from a DCP response.
     */
    postTraverse: function(v) {
      // When we meet "presetClass" in the postTraverse means that we have
      // finished with the current animation, so we add the animation object
      // to the animation queue manager.
      if (v.el.presetClass && _animationBuilder) {

        var _animation = _animationBuilder.getAnimation();

        if (AnimationManager.getAnimationDelay()) {
          _animation.setAnimationDelay(AnimationManager.getAnimationDelay());
        }

        if (AnimationManager.getAnimationRepeatEnd()) {
          _animation.setAnimationRepeatEnd(
            AnimationManager.getAnimationRepeatEnd());
        }

        AnimationContainer.addAnimation(_animation);

        AnimationManager.resetCurrentAnimationProperties();
      }
    }
  };

  return _api;
});
