/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Decorator for Geometry
 * @constructor
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/geometry/geometryManager'
],
function(UnitConversionUtils, ThemeStyleRefManager, GeometryManager) {

  'use strict';


  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;

        /**
           * Computes transform delta
           * @param {Object} shapeProperties Response JSON for -spPr-,
           *                                 shape-properties
           */
        var _computeTransformDelta = function(shapeProperties) {
          var lineWidth;
          if (shapeProperties.ln) {
            lineWidth = shapeProperties.ln.w;
          } else {
            var themeLineStyle =
                ThemeStyleRefManager.getCachedOutlineRefStyle();
            lineWidth = themeLineStyle ? themeLineStyle.w : 0;
          }

          var deltaTransform = _convertEmuToPixel(lineWidth);
          if (deltaTransform === undefined) {
            deltaTransform = 1;
          }

          //deltaTransform is increased to fit in the arrow dimensions into
          // the canvas if shape has arrow dimensions then only deltaTransform
          // value is increased
          if (shapeProperties.ln && shapeProperties.ln.ends !== undefined) {
            deltaTransform = deltaTransform * 5 * Math.sqrt(2);
          }

          return deltaTransform;
        };

        /**
           * Calculates the offsets for canvas for rendering shadow
           * @param {object} shadowEffectBean Shadow properties of shape
           * @return {object} JSON with canvas dimensions
           */
        var _adjustCanvasDimensionsForShadow = function(shadowEffectBean) {
          var dimensions = {};
          var shadowBlurRadius = shadowEffectBean.blurRad;
          dimensions.height =
              Math.abs(shadowEffectBean.delta.y) + (2 * shadowBlurRadius);
          dimensions.width =
              Math.abs(shadowEffectBean.delta.x) + (2 * shadowBlurRadius);

          var deltaXForShadow = shadowEffectBean.delta.x < 0 ?
              shadowEffectBean.delta.x : 0;
          var deltaYForShadow = shadowEffectBean.delta.y < 0 ?
              shadowEffectBean.delta.y : 0;

          dimensions.left = deltaXForShadow + (shadowBlurRadius * -1);
          dimensions.top = deltaYForShadow + (shadowBlurRadius * -1);
          return dimensions;
        };

        var _api = {
          /**
             * Decorates the geometry
             * @param {Object} shapeDiv Shape div to decorate with the
             *                          geometry
             * @return {Object} api object containing decorator functions
             */
          decorate: function(shapeDiv) {

            var _localApi = {

              /**
                 * Creates a new HTML canvas and attaches it to the shape div
                 * @return {Object} local API for the decorator
                 */
              withNewCanvas: function() {
                var shapeCanvas = document.createElement('canvas');
                shapeCanvas.style.position = 'absolute';
                shapeCanvas.id = shapeDiv.id + 'canvas';
                shapeCanvas.style['z-index'] = '0';
                Polymer.dom(shapeDiv).appendChild(shapeCanvas);
                Polymer.dom(shapeDiv).flush();

                return shapeCanvas;
              },

              /**
                 * Sets the position and dimensions of the canvas
                 * @param {Object} shapeProperties Response JSON for -spPr-,
                 *                                 shape-properties
                 * @param {Object} shadowEffectBean Shadow properties of shape
                 * @param {Object} shapeCanvas HTML canvas belonging to the
                 *                             shape
                 * @return {Object} local API for the decorator
                 */
              withCanvasTransforms: function(shapeProperties,
                  shadowEffectBean, shapeCanvas) {

                var deltaTransform = _computeTransformDelta(shapeProperties);

                //deltaTransform is added to canvas height and width so that
                // shape line width wont override with canvas border.
                // Instead of adding just the deltaTransform, adding some
                // extra buffer. (1px on each side)
                var shapeTransformExtents = shapeProperties.xfrm.ext;
                if (shapeTransformExtents &&
                    shapeTransformExtents.cy !== undefined &&
                    shapeTransformExtents.cx !== undefined) {
                  shapeCanvas.height = _convertEmuToPixel(
                      shapeTransformExtents.cy) + (2 * deltaTransform);
                  shapeCanvas.width = _convertEmuToPixel(
                      shapeTransformExtents.cx) + (2 * deltaTransform);

                  var shadowTransforms =
                      _adjustCanvasDimensionsForShadow(shadowEffectBean);

                  shapeCanvas.height += shadowTransforms.height;
                  shapeCanvas.width += shadowTransforms.width;

                  // if canvas dimensions are adjusted with deltaTransform
                  // (line width) then adjust canvas position too with it.
                  shapeCanvas.style.left =
                      shadowTransforms.left + (-1 * deltaTransform) + 'px';
                  shapeCanvas.style.top =
                      shadowTransforms.top + (-1 * deltaTransform) + 'px';
                }

                return _localApi;
              },

              /**
                 * Draws the preset / custom-geometry on the canvas
                 * @param {Object} shapeProperties Response JSON for -spPr-,
                 *                                 shape-properties
                 * @param {Object} groupShapeProperties Response JSON for
                 *                                      -grpSpPr-,
                 *                                      group-shape-properties
                 * @param {Object} fillColorBean Shape Fill properties
                 * @param {Object} effectsBean HTML Shape effects properties
                 * @param {Object} shapeCanvas HTML canvas belonging to the
                 *                                 shape
                 * @return {Object} local API for the decorator
                 */
              withCanvasDrawing: function(shapeProperties, groupShapeProperties,
                  fillColorBean, effectsBean, shapeCanvas) {

                var geomMgrApi = GeometryManager.
                    initialize(shapeProperties, groupShapeProperties);
                //TODO move drawCanvas method here
                geomMgrApi.drawCanvas(fillColorBean, effectsBean,
                    shapeCanvas);

                return _localApi;
              }
            };

            return _localApi;
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
