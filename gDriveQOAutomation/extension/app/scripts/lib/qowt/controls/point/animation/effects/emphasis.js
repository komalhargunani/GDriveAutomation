// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview It creates the css for a default emphasis effect.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/controls/point/animation/effects/effectBase'
], function(EffectBase) {

  'use strict';

  var _factory = {

    /**
     * Creates an default Emphasis Effect object.
     * @param {object} animation The animation object.
     */
    create: function(animation) {

      // use module pattern for instance object
      var module = function() {

        /**
         * @constant
         * The effect name.
         */
        var _kEffectName = 'emphasis';

        /**
         * Extend the effect base object.
         */
        var _api = EffectBase.create(_kEffectName, animation);

        /**
         * We override the effectBase api with empty methods because at the
         * moment we don't support any emphasis effects.
         * TODO: When adding support for emphasis effects remove this file.
         */
        _api.addKeyframesRule = function() {
        };

        _api.addAnimationRule = function() {
        };

        _api.removeAnimationRule = function() {
        };

        /**
         * @private
         * Constructor for the Emphasis effect object.
         */
        function _init() {
          if (animation === undefined) {
            throw new Error('Emphasis effect - missing constructor parameter!');
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
