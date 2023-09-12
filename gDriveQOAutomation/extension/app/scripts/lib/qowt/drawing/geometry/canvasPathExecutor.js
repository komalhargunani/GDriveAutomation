/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(DeprecatedUtils, FillHandler, LayoutsManager, ColorUtility,
            GradientFillHandler, ResourceLocator, UnitConversionUtils) {

  'use strict';

  var _api;
  var _fillHandler;
  /**
   * applies the shadow properties to context
   * @param context
   * @param effectsBean shadow effect JSON
   */
  var _handleShadow = function(context, effectsBean) {
    if (effectsBean && effectsBean.type === 'outerShdw') {
      //x and y are in pixels.
      context.shadowOffsetX = effectsBean.delta.x;
      context.shadowOffsetY = effectsBean.delta.y;
      context.shadowColor = effectsBean.clr;
      context.shadowBlur = UnitConversionUtils.convertPixelToPoint(
          effectsBean.blurRad);
    }
  };

  /**
   * Returns the dash array for given dash type of outline.
   * @param fillColorBean {Object} the object contains fill properties and
   *                               outline properties.
   */
  var _getOutlineDashArray = function(fillColorBean) {
    var dashArray = [];

    switch (fillColorBean.prstDash) {
      case 'dash':
        // Represent line pattern 1111000
        dashArray[0] = 4;
        dashArray[1] = 3;
        break;
      case 'dashDot':
        // Represent line pattern 11110001000
        dashArray[0] = 4;
        dashArray[1] = 3;
        dashArray[2] = 1;
        dashArray[3] = 3;
        break;
      case 'dot':
        // Represent line pattern 1000
        dashArray[0] = 1;
        dashArray[1] = 3;
        break;
      case 'lgDash':
        // Represent line pattern 11111111000
        dashArray[0] = 8;
        dashArray[1] = 3;
        break;
      case 'lgDashDot':
        // Represent line pattern 111111110001000
        dashArray[0] = 8;
        dashArray[1] = 3;
        dashArray[2] = 1;
        dashArray[3] = 3;
        break;
      case 'lgDashDotDot':
        // Represent line pattern 1111111100010001000
        dashArray[0] = 8;
        dashArray[1] = 3;
        dashArray[2] = 1;
        dashArray[3] = 3;
        dashArray[4] = 1;
        dashArray[5] = 3;
        break;
      case 'sysDash':
        // Represent line pattern 1110
        dashArray[0] = 3;
        dashArray[1] = 1;
        break;
      case 'sysDashDot':
        // Represent line pattern 111010
        dashArray[0] = 3;
        dashArray[1] = 1;
        dashArray[2] = 1;
        dashArray[3] = 1;
        break;
      case 'sysDashDotDot':
        // Represent line pattern 11101010
        dashArray[0] = 3;
        dashArray[1] = 1;
        dashArray[2] = 1;
        dashArray[3] = 1;
        dashArray[4] = 1;
        dashArray[5] = 1;
        break;
      case 'sysDot':
        // Represent line pattern 10
        dashArray[0] = 1;
        dashArray[1] = 1;
        break;
    }

    for (var i = 0; i < dashArray.length; i++) {
      dashArray[i] *= fillColorBean.outlineFill.lineWidth;
    }

    return dashArray;
  };

  /**
   * handles outlines around shapes
   * @param context - context of canvas
   * @param fillColorBean fillInfo
   * @param path path for canvas to draw
   */
  var _drawContextOutline = function(canvas, context, fillColorBean, path) {
    var stroke = path.stroke === undefined ||
        DeprecatedUtils.parseBoolean(path.stroke);

    if (stroke) {
      if (fillColorBean.outlineFill !== undefined &&
          fillColorBean.outlineFill.data !== undefined) {

        if (fillColorBean.outlineFill.lineWidth !== undefined) {
          context.lineWidth = fillColorBean.outlineFill.lineWidth;

          //TODO By default lineJoin is set to round, once DCP provide lineJoin
          // property, need to handle it(miter, bevel, round)
          //context.lineJoin = "round";
        }

        var outlineData = fillColorBean.outlineFill.data;
        if (outlineData.color) {
          var rgbaColor = ColorUtility.getColor(outlineData.color);
          context.strokeStyle = rgbaColor;
        } else if (outlineData.gsLst) {
          GradientFillHandler.fillCanvasContextForBorders(canvas, context,
              outlineData, path.fill);
        }

        if (path.arrowFill !== undefined && path.arrowFill === true) {
          context.fillStyle = context.strokeStyle;
          context.fill();
        }

        var dashArray;

        /*
         * If path has lineEnd attribute that means this path is used for
         * rendering of head end or tail end on the line. Head or tail ends will
         * always rendered with solid border.
         */
        if (path.lineEnd) {
          dashArray = [0];
        } else {
          dashArray = _getOutlineDashArray(fillColorBean);
        }

        context.setLineDash(dashArray);
        context.stroke();
      }
    }
  };

  /**
   * Fills the canvas context
   * @param canvas to fill
   * @param context of the canvas
   * @param fill fill information
   * @param fillPathAttribute fill info in paths.
   * @param img - canvas image element
   */
  var _fillCanvasContext = function(canvas, context, fill, fillPathAttribute,
                                    img) {
    if (!_fillHandler) {
      _fillHandler = FillHandler;
    }

    _fillHandler.fillCanvasContext(canvas, context, fill, fillPathAttribute,
        img);
  };

  _api = {

    /**
     * Draws the paths on canvas
     * @param paths paths to draw
     * @param context context to draw on
     * @param fillColorBean fill data
     * @param canvas canvas to draw
     * @param effectsBean shadow effect bean
     */
    drawPathsOnContext: function(paths, context, fillColorBean, canvas,
                                 effectsBean) {
      canvas.height = canvas.height + paths.topMargin + paths.bottomMargin;
      canvas.width = canvas.width + paths.leftMargin + paths.rightMargin;
      canvas.style.left =
          parseFloat(canvas.style.left) - paths.leftMargin + 'px';
      canvas.style.top =
          parseFloat(canvas.style.top) - paths.topMargin + 'px';
      context.translate(parseFloat(canvas.style.left) * -1,
          parseFloat(canvas.style.top) * -1);

      if (fillColorBean.fill && fillColorBean.fill.type === 'blipFill') {
        var img = document.createElement('img');

        img.src = ResourceLocator.pathToUrl(fillColorBean.fill.blip.src);

        // fillColorBean has to be deep-copied. As CanvasPainter is a
        // singleton, it gets overwritten when multiple shapes are loading.
        var copiedFillCB = JSON.parse(JSON.stringify(fillColorBean));

        // this path executor has to be a NON Singleton. The reason being, if
        // it saves the status of the calls then the status gets overwritten in
        // case of blipFill. This is because blip fill is only done when image
        // is loaded. Load event is triggered asynchronously.
        var loadAction = _api.drawPathsOnCanvasForBlip.bake(_api,paths,
            context, copiedFillCB, canvas, img);

        img.addEventListener('load', function() {
          setTimeout(loadAction, 0);
        }, true);
      } else {
        _api.drawPathsOnCanvas(paths, context, fillColorBean, canvas,
            effectsBean);
      }
    },

    /**
     * Draws the paths on canvas for blip fill
     * @param paths paths to draw
     * @param context context to draw on
     * @param fillColorBean fill data
     * @param canvas canvas to draw
     * @param img image element {DOM}
     */
    drawPathsOnCanvasForBlip: function(paths, context, fillColorBean, canvas,
                                       img) {
      for (var i = 0, len = paths.length; i < len; i++) {
        var path = paths[i];

        for (var j = 0, jl = path.length; j < jl; j++) {
          var command = path[j];
          //TODO This need to be replaced with better path composition in
          // geometry guide evaluator
          var func = command.name;
          var argsArray = command.args;

          var fn = context[func];

          if (typeof fn === 'function') {
            if (argsArray.length === 0) {

              if (func === "beginPath" &&
                  fillColorBean.fill.type === 'blipFill') {
                context.save();
              }

              fn.apply(context);
            } else {
              fn.apply(context, argsArray);
            }
          } else {
            // to set a property onto context
            // Added error check for unit tests "Uncaught TypeError: Cannot
            // call method 'join' of undefined"
            if (argsArray && argsArray.join) {
              context[func] = argsArray.join(',');
            }
          }
        }

        if (path.fill !== "none") {
          _fillCanvasContext(canvas, context, fillColorBean.fill, path.fill,
            img);
        }

        _drawContextOutline(canvas, context, fillColorBean, path);

      }
      _handleShadow(context);

      var thumbnailToSlideCanvasMap =
          LayoutsManager.getThumbnailToSlideCanvasMap();
      var dupSlideCanvas = thumbnailToSlideCanvasMap[canvas.id];
      if (dupSlideCanvas) {
        DeprecatedUtils.cloneCanvasImage(
            context, dupSlideCanvas.getContext('2d'));
      }
    },

    /**
     * Draws the paths on canvas
     * @param paths paths to draw
     * @param context context to draw on
     * @param fillColorBean fill data
     * @param canvas canvas to draw
     * @param effectsBean shadow effect bean
     */
    drawPathsOnCanvas: function(paths, context, fillColorBean, canvas,
                                effectsBean) {
      var path;
      //handle shadow
      _handleShadow(context, effectsBean);
      for (var i = 0, len = paths.length; i < len; i++) {
        path = paths[i];

        for (var pathCommandIndex = 0, pathLength = path.length;
             pathCommandIndex < pathLength; pathCommandIndex++) {
          var command = path[pathCommandIndex];
          //TODO This need to be replaced with better path composition in
          // geometry guide evaluator
          var func = command.name;
          var argsArray = command.args;

          var fn = context[func];

          if (typeof fn === 'function') {
            if (argsArray.length === 0) {
              fn.apply(context);
            } else {
              fn.apply(context, argsArray);
            }
          } else {
            // to set a property onto context
            context[func] = argsArray.join(',');
          }
        }

        if (path.fill !== "none") {
          _fillCanvasContext(canvas, context, fillColorBean.fill, path.fill);
        }

        _drawContextOutline(canvas, context, fillColorBean, path);
      }
    }
  };

  return _api;
});
