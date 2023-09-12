// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview It creates the css for the Appear and Disappear effects
 * using css animation. Extends the effectBase object.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/cssManager',
  'qowtRoot/controls/point/animation/effects/effectBase'
], function(CssManager, EffectBase) {

  'use strict';

  var _factory = {

    /**
     * Creates an Appear Effect object.
     * @param {object} animation The animation object.
     */
    create: function(animation) {

      // use module pattern for instance object
      var module = function() {

        /**
         * @constant
         * The entrance and exit name of the Appear effect
         */
        var _kEntranceEffectName = 'appear',
            _kExitEffectName = 'disappear';

        /**
         * @private
         */
        var  _effectName;

        if (animation.getAnimationType() === "exit") {
          _effectName = _kExitEffectName;
        }
        else {
          _effectName = _kEntranceEffectName;
        }

        /**
         * Extend the effect base object.
         */
        var _api = EffectBase.create(_effectName, animation);

        /**
         * Overrides the addKeyframesRule method.
         */
        _api.addKeyframesRule = function() {
          CssManager.addRule("@-webkit-keyframes " + _kEntranceEffectName,
              "from { visibility: hidden; } to { visibility: visible; }", 100);
          CssManager.addRule("@-webkit-keyframes " + _kExitEffectName,
              "from { visibility: visible; } to { visibility: hidden; }", 100);
        };

        /**
         * @private
         * Constructor for the Appear effect object.
         */
        function _init() {
          if (animation === undefined) {
            throw new Error('Appear/disappear effect - missing constructor' +
                ' parameter!');
          }
          _api.addKeyframesRule();
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
