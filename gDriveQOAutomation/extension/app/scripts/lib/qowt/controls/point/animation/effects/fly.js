// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview It creates the css for the Fly in and out effects,
 * using css animation. Extends the effectBase object.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/cssManager',
  'qowtRoot/controls/point/animation/effects/effectBase',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(CssManager, EffectBase, UnitConversionUtils) {

  'use strict';

  var _factory = {

    /**
     * Creates a Fade Effect object.
     * @param {object} animation The animation object.
     * @param {object} slideSize The slide size (width, height).
     */
    create: function(animation, slideSize) {

      // use module pattern for instance object
      var module = function() {

        /**
         * @private
         */
        var _effectName, _slideSize;
        var _fromTop, _toTop, _fromLeft, _toLeft;

        /**
         * @private
         */
        var _shapeId = animation.getAnimationShapeId();

        /**
         * @constant
         * The entrance and exit name of the Fly effect.
         *
         * We append _shapeId to the effect name because each shape
         * will have a different keyframes rule based on its position.
         */
        var _entranceEffectName = 'flyIn' + '-' + _shapeId,
          _exitEffectName = 'flyOut' + '-' + _shapeId;

        _effectName = (animation.getAnimationType() === 'exit') ?
            _exitEffectName : _entranceEffectName;

        /**
         * Extend the effect base object.
         */
        var _api = EffectBase.create(_effectName, animation);

        /**
         * Overrides the addKeyframesRule method.
         */
        _api.addKeyframesRule = function() {

          // webkit-transform doesn't seem to work very well together with
          // webkit-animation so we have to use positioning instead (top)
          // that is less smooth.

          if (animation.getAnimationType() === 'exit') {
            CssManager.addRule('@-webkit-keyframes ' + _exitEffectName,
                'from { top: ' + _toTop + 'pt; left: ' +
                    _toLeft + 'pt; visibility: visible; }' +
                'to { top: ' + _fromTop + 'pt; left: ' +
                    _fromLeft + 'pt; visibility: hidden; }', 100);
          } else {
            CssManager.addRule('@-webkit-keyframes ' + _entranceEffectName,
                'from { top: ' + _fromTop + 'pt; left: ' +
                    _fromLeft + 'pt; visibility: hidden; } ' +
                'to { top: ' + _toTop + 'pt; left: ' +
                    _toLeft + 'pt; visibility: visible; }', 100);
          }

        };


        /**
         * set the fly direction
         * @param fromLeft
         * @param fromTop
         * @param toLeft
         * @param toTop
         */
        function _setFlyDirection(fromLeft, fromTop, toLeft, toTop) {
          _fromLeft = fromLeft;
          _fromTop = fromTop;
          _toLeft = toLeft;
          _toTop = toTop;
        }

        /**
         *  generate css as per direction
         */
        function _computeFlyDirection() {
          // top is in pt so we convert the slideHeight to use the same unit
          var slideHeight = UnitConversionUtils.convertPixelToPoint(
              _slideSize.height);
          var slideWidth = UnitConversionUtils.convertPixelToPoint(
              _slideSize.width);
          var shapeElement = document.getElementById(_shapeId);

          // get the direction for animation. If animation applied to shape then
          // set default direction as 'bottom'.
          var direction = animation.getAnimatedTxElm() ? 'bottom' :
              animation.direction;

          if (shapeElement) {
            var shapeTop =  parseInt(shapeElement.style.top, 10);
            var shapeLeft = parseInt(shapeElement.style.left, 10);

            switch (direction) {
              case 'right':
                _setFlyDirection(slideWidth, shapeTop, shapeLeft, shapeTop);
                break;
              case 'left':
                _setFlyDirection(0, shapeTop, shapeLeft, shapeTop);
                break;
              case 'bottom':
                _setFlyDirection(shapeLeft, slideHeight, shapeLeft, shapeTop);
                break;
              case 'top':
                _setFlyDirection(shapeLeft, 0, shapeLeft, shapeTop);
                break;
              case 'top-left':
                _setFlyDirection(0, 0, shapeLeft, shapeTop);
                break;
              case 'top-right':
                _setFlyDirection(slideHeight, 0, shapeLeft, shapeTop);
                break;
              case 'bottom-left':
                _setFlyDirection(0, slideWidth, shapeLeft, shapeTop);
                break;
              case 'bottom-right':
                _setFlyDirection(slideHeight, slideWidth, shapeLeft, shapeTop);
                break;
              default:
                break;
            }
          }
        }

        /**
         * @private
         * Constructor for the Fly effect object.
         */
        function _init() {
          if (animation === undefined || slideSize === undefined) {
            throw new Error('Fly effect - missing constructor parameters!');
          }
          _slideSize = slideSize;
          _computeFlyDirection();
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
