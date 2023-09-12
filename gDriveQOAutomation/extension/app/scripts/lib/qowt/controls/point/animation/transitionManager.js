/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Transition manager for presentation
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/point'
  ], function(PubSub, DomListener, PointModel) {

  'use strict';



  // variables to hold animation data relative to a given slide index
  var _slideShowMode;


  var _wingSlideAnimValues = {
    effect: undefined,
    delay: undefined,
    advanceTime: undefined,
    advanceClick: false
  };

  var _onStageSlideAnimValues = {
    effect: undefined,
    advanceTime: undefined,
    advanceClick: false
  };

  var _animationDoneCallBack;

  // on stage and wing widget
  var _onStageSlide,
      _wingSlide;

  // Holds layer values (z-index values) for slide widgets.
  var layer = {
    bottom: 1,
    middle: 2,
    top: 3
  };

  var _animationTimer;
  var _animationPaused = false;

  /**
   * Stage strategies.
   * For various animation effects, we need to set up stage strategically.
   * e.g. for cover we need previous slide to be on stage and new slide to come
   * from wing where as for pull effect we need previous slide and new slide to
   * be on stage where new slide is behind previous slide and animate previous
   * slide to go in wing
   *
   * This stage strategies are clubbed together in strategy pattern way.
   * Every strategy provides one methods - play()
   *
   * play() method will play actual slide animation for the strategy
   */
  var _stageStrategies = {

    /**
     * Default strategy. (wing to on stage strategy)
     * Characteristics -
     * 1. Previous slide is on stage
     * 2. New slide is in wing
     * 3. Animate new slide to come on stage
     *
     * Note: slides container widget gives control to transition manager as per
     * this strategy's requirement so we don't need to do anything apart form
     * displaying animation
     */
    defaultStrategy: {
      /**
       * Setup and Animate new slide to come on stage
       */
      play: function(speed) {

        //set wing slide animation
        if (_wingSlideAnimValues.effect) {
          _wingSlide.setAnimationValues(_wingSlideAnimValues.effect, speed);
        }

        if (_wingSlideAnimValues.delay) {
          window.setTimeout(function() {
            _wingSlide.showSlide(true);
          }, _wingSlideAnimValues.delay);

        } else {
          _wingSlide.showSlide(true);
        }
      }

    },

    /**
     * On stage to wing strategy
     * Wing slide on stage strategy.
     * Characteristics -
     * 1. Previous slide is on stage.
     * 2. New slide is also on stage but behind previous slide
     * 3. Animate previous slide to go in wing
     */
    onStageToWingStrategy: {
      /**
       * Setup and Animate previous slide to go in wing
       *
       * Here we don't get setup from slides container as per requirement.
       * So we need to setup stage accordingly.
       */
      play: function(speed) {

        _onStageSlide.setLayer(layer.top);
        _wingSlide.setLayer(layer.middle);
        _wingSlide.showSlide(true);

        //set on stage slide animation
        if (_onStageSlideAnimValues.effect) {
          _onStageSlide.setAnimationValues(_onStageSlideAnimValues.effect,
              speed);
        }
      }

    }

  };

  /**
   * Schedules next slide transition animation
   */
  var _scheduleNextSlideTransition = function() {
      var doneIndex = _wingSlide.getSlideIndex();
      var nextIndex = doneIndex + 1;

      // Clear previous animation timer, if any.
      _clearTimer();

      // Set animation timer for next slide transition
      if (nextIndex !== PointModel.numberOfSlidesInPreso && !_animationPaused) {
        var doneTransition = PointModel.slideTransitions[doneIndex];
        if (doneTransition && doneTransition.advTm) {
          _animationTimer = window.setTimeout(function() {
            PubSub.publish("qowt:selectSlide", {
              'slide': nextIndex
            });
          }, doneTransition.advTm);
        }
      }
    };

  /**
   * Toggles animation between play and pause states
   */
  var _toggleAnimationPlayPause = function() {
      if (_animationPaused) {
        _animationPaused = false;
        // schedule next slide transition animation
        _scheduleNextSlideTransition();
      } else {
        _clearTimer();
        _animationPaused = true;
      }
    };

  /**
   * Animation done handler.
   * After every animation effect done, this function should get called as
   * transition manager will decide next animation to take place after previous
   * animation.
   *
   * @param event The event with details about animation done
   */
  var _handleAnimationDone = function(event) {
      var type = event.detail.type;

      switch (type) {
      case "transition":
        // slide transition
        if (_animationDoneCallBack) {
          _animationDoneCallBack(event.detail);
        }
        _onStageSlide.showSlide(false);
        /**
         * TODO here we are deciding next animation.
         * it may be object animation on current slide, if any; otherwise
         * next slide transition, if  advance time is available.
         * Right now object animation is not in scope, but handle it when in
         * scope
         */
        //TODO for valentine we don't want slide show menu and its functionality
        // so disabling it for now. Don't push it to main while merging
        // _scheduleNextSlideTransition();
        break;
      case "object":
        // object animation
        break;
      default:
        break;

      }
    };

  /**
   * Explicitly clear animation timer
   */
  var _clearTimer = function() {
      if (_animationTimer) {
        window.clearTimeout(_animationTimer);
        _animationTimer = undefined;
      }
    };

  var _api = {

    /**
     * initialise this singleton - should be called by the layout control
     * which initialises everything (eg presentation layout control)
     */
    init: function() {
      _init();
    },

    /**
     * Set the slide show mode API.
     * This method is used by presentation control only. Do not call it from any
     * where else.
     * Note: This must be the first method call for transition manager before
     * using any other api method
     * @param slideShowMode the slide show mode api provided by presentation
     * control
     */
    setSlideShowAPI: function(slideShowMode) {
      _slideShowMode = slideShowMode;
    },

    /**
     * Get ready for animation.
     * Ask slide show mode api to enter in slide show mode.
     * Prepare for animation
     */
    ready: function() {
      _slideShowMode.enter();
      //TODO prepare for animation
    },

    /**
     * Explicitly clear animation timer
     */
    clearTimer: _clearTimer,

    /**
     * Display the animation effect when slide is rendered in slide show mode
     *
     * @param onStageSlide previous slide widget
     * @param wingSlide current slide widget
     * @param index slide index
     */
    displaySlideAnimation: function(onStageSlide, wingSlide,
                                    animationDoneCallBack) {
      _animationDoneCallBack = animationDoneCallBack;
      _onStageSlide = onStageSlide;
      _wingSlide = wingSlide;
      var index = wingSlide.getSlideIndex();
      var currentTransition = PointModel.slideTransitions[index] || undefined;
      // use default stage strategy and override wherever applicable

      // wing slide to come on stage
      var stageStrategy = _stageStrategies.defaultStrategy;
      var speed = "fast";
      /**
       * Note: if transition is of type 'none' then DCP don't put effect in
       * JSON. so we need to play stage strategy anyway
       */
      if (currentTransition && currentTransition.effect) {

        switch (currentTransition.effect.type) {
        case "cover":
          // using default stage strategy
          switch (currentTransition.effect.dir) {
          case "d":
            _wingSlideAnimValues.effect = "coverDown";
            break;
          case "l":
            _wingSlideAnimValues.effect = "coverLeft";
            break;
          case "r":
            _wingSlideAnimValues.effect = "coverRight";
            break;
          case "u":
            _wingSlideAnimValues.effect = "coverUp";
            break;
          case "ld":
            _wingSlideAnimValues.effect = "coverLeftDown";
            break;
          case "rd":
            _wingSlideAnimValues.effect = "coverRightDown";
            break;
          case "lu":
            _wingSlideAnimValues.effect = "coverLeftUp";
            break;
          case "ru":
            _wingSlideAnimValues.effect = "coverRightUp";
            break;
          default:
            // coverLeft is default
            _wingSlideAnimValues.effect = "coverLeft";
            break;
          }
          break;
        case "fade":
          // using default stage strategy
          if (currentTransition.effect.thruBlk === "1") {
            //fade thru black
            _onStageSlideAnimValues.effect = "fadeTBReverse";
            onStageSlide.showSlide(false);
            _wingSlideAnimValues.effect = "fadeNormal";
            _wingSlideAnimValues.delay = 100;
          } else {
            _wingSlideAnimValues.effect = "fadeNormal";
          }
          break;
        case "wipe":
          // using default stage strategy
          switch (currentTransition.effect.dir) {
          case "d":
            _wingSlideAnimValues.effect = "wipeDown";
            break;
          case "r":
            _wingSlideAnimValues.effect = "wipeRight";
            break;
          case "u":
            // using on stage to wing strategy
            stageStrategy = _stageStrategies.onStageToWingStrategy;
            _onStageSlideAnimValues.effect = "wipeUp";
            break;
          default:
            // wipeLeft is default
            // using on stage to wing strategy
            stageStrategy = _stageStrategies.onStageToWingStrategy;
            _onStageSlideAnimValues.effect = "wipeLeft";
            break;
          }
          break;
        case "cut":
          // using default stage strategy
          _wingSlideAnimValues.effect = undefined;
          _onStageSlideAnimValues.effect = undefined;
          if (currentTransition.effect.thruBlk === "1") {
            //cut thru black
            onStageSlide.showSlide(false);
            _wingSlideAnimValues.delay = 200;
          } else {
            // here we are not applying any animation effect to slide
            // hence callback animation done
            _animationDoneCallBack(index);
          }
          break;
        case "pull":
          // using on stage to wing strategy
          stageStrategy = _stageStrategies.onStageToWingStrategy;
          switch (currentTransition.effect.dir) {
          case "d":
            _onStageSlideAnimValues.effect = "pullDown";
            break;
          case "r":
            _onStageSlideAnimValues.effect = "pullRight";
            break;
          case "u":
            _onStageSlideAnimValues.effect = "pullUp";
            break;
          case "ld":
            _onStageSlideAnimValues.effect = "pullLeftDown";
            break;
          case "rd":
            _onStageSlideAnimValues.effect = "pullRightDown";
            break;
          case "lu":
            _onStageSlideAnimValues.effect = "pullLeftUp";
            break;
          case "ru":
            _onStageSlideAnimValues.effect = "pullRightUp";
            break;
          default:
            // includes dir == 'l'
            _onStageSlideAnimValues.effect = "pullLeft";
            break;
          }
          break;
        case "zoom":
          // using default stage strategy
          if (currentTransition.effect.dir === "in") {
            _wingSlideAnimValues.effect = "zoomIn";
          } else {
            _wingSlideAnimValues.effect = "zoomOut";
          }
          break;
        default:
          // if we are not handling effect then fallback to cover down
          _wingSlideAnimValues.effect = "coverDown";
          break;
        } // end currentTransition.effect.type switch
        speed = currentTransition.spd || speed;
        switch (speed) {
        case "slow":
          speed = "1.5s";
          break;
        case "med":
          speed = "1s";
          break;
        case "fast":
          speed = "0.5s";
          break;
        default:
          //fast is default
          speed = "0.5s";
          break;
        } // end speed switch
      }
      // we are playing stage strategy if we are having transition effect or not
      // (i.e. transition with type none)
      stageStrategy.play(speed);
    },

    /**
     * Stop animation.
     * Ask slide show mode api to exit from slide show mode
     */
    stop: function() {
      _clearTimer();
      _slideShowMode.exit();
    }

  };

  function _init() {
    DomListener.addListener(document, 'qowt:animationDone',
        _handleAnimationDone);
    PubSub.subscribe("qowt:animationPlayPause", _toggleAnimationPlayPause);
  }

  return _api;
});
