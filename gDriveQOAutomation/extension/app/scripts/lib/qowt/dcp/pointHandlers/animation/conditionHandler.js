// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the handler for a Condition Time Node.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationManager'
], function(AnimationManager) {

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
    etp: 'cond',

    /**
     * Processes a 'cond' (Condition Time Node) element from a DCP response.
     *
     * @param {object} v A cTn element from a DCP response.
     * @return {object} An animation object.
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        _animationBuilder = AnimationManager.getCurrentAnimationBuilder();

        // check if the delay value is a valid integer (not zero)
        if (v.el.delay && parseInt(v.el.delay, 10)) {
          if (_animationBuilder) {
            _animationBuilder.setAnimationDelay(parseInt(v.el.delay, 10));
          } else {
            AnimationManager.setAnimationDelay(parseInt(v.el.delay, 10));
          }

        }

        // Set repeatEnd for animation with the repeat until next click option.
        if (v.el.evt && v.el.evt === "onNext") {
          if (_animationBuilder) {
            _animationBuilder.setAnimationRepeatEnd("onNextClick");
          } else {
            AnimationManager.setAnimationRepeatEnd("onNextClick");
          }

        }
      }
    }
  };

  return _api;
});
