// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Animation builder for fly animation.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/controls/point/animation/animation',
  'qowtRoot/controls/point/animation/animationBuilders/animationBuilder'
], function(Animation, AnimationBuilder) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _flyAnimation = Animation.create();

        /**
         * Public interface
         */
        var _api = AnimationBuilder.create(_flyAnimation);

        /**
         * set the flyin/flyout direction
         */
        _api.setPresetSubtype = function(direction) {
          if (direction) {
            switch (direction) {
              case 1:
                _flyAnimation.direction = "top";
                break;
              case 2:
                _flyAnimation.direction = "right";
                break;
              case 3:
                _flyAnimation.direction = "top-right";
                break;
              case 4:
                _flyAnimation.direction = "bottom";
                break;
              case 6:
                _flyAnimation.direction = "bottom-right";
                break;
              case 8:
                _flyAnimation.direction = "left";
                break;
              case 9:
                _flyAnimation.direction = "top-left";
                break;
              case 12:
                _flyAnimation.direction = "bottom-left";
                break;
              default:
                break;
            }
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
