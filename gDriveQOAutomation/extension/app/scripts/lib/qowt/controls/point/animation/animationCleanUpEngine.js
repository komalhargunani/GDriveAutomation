// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview AnimationCleanUpEngine is the engine responsible for
 * cleaning up the css added for the animations and it is called when exiting
 * the slideshow.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/controls/point/animation/initialSetupEngine'
], function(AnimationContainer, InitialSetupEngine) {

  'use strict';

  /**
   * Public interface
   */
  var _api = {
    /**
     * Removes all the css animation rules from every slide. Called when exiting
     * the slideshow.
     */
    cleanUp: function() {
      for (var i = 0, length = AnimationContainer.getAnimatedSlideCount();
           i < length; i++) {
        _cleanUpCssAnimation(i);
      }
      InitialSetupEngine.resetSlidePlayed();
    }
  };

  /**
   * @private
   * Removes all the css animation rules for a slide.
   * @param {number} slideIndex index of the slide.
   */
  var _cleanUpCssAnimation = function(slideIndex) {
    var animation;
    for (var i = 0, length = AnimationContainer.
        getAnimationCountForSlide(slideIndex); i < length; i++) {
      animation = AnimationContainer.getAnimationForSlide(slideIndex, i);
      if (animation && animation.getEffectStrategy()) {
        animation.getEffectStrategy().removeAnimation();
      }
    }
  };

  return _api;
});