// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Animation builder for fade animation.
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

        var _fadeAnimation = Animation.create();

        /**
         * Public interface
         */
        var _api = AnimationBuilder.create(_fadeAnimation);

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
