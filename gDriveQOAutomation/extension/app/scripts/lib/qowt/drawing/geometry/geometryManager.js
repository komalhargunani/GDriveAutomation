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
 * Geometry Manager
 * @constructor
 */
define([
  'qowtRoot/drawing/geometry/geometryGuideEvaluator',
  'qowtRoot/drawing/geometry/presetMap',
  'qowtRoot/drawing/geometry/canvasPainter',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator'
], function(GuideEvaluator,
            PresetMap,
            CanvasPainter,
            UnitConversionUtils,
            ThemeStyleRefManager,
            DeprecatedUtils,
            ShapeEffectsDecorator) {

  'use strict';


  var _shapeEffectsDecorator = ShapeEffectsDecorator.create();

  var _api = {

    /**
     * initializes the geometry manager
     * @param shapeProperties {Object} response JSON for -spPr-,
     *                        shape-properties
     * @param groupShapeProperties {Object} response JSON for -grpSpPr-,
     *                             group-shape-properties
     * @return {Object} api object containing geometry-manager functions
     */
    initialize: function(shapeProperties, groupShapeProperties) {

      /**
       * Gets the outline from theme line styles using index and color from
       * shape style.
       */
      var _getThemeOutline = function() {
        return ThemeStyleRefManager.getCachedOutlineRefStyle();
      };

      /**
       * returns the fill style
       */
      var _getThemeFill = function() {
        return ThemeStyleRefManager.getCachedFillRefStyle();
      };

      /**
       * returns the theme effect lst style
       */
      var _getThemeEffects = function() {
        return ThemeStyleRefManager.getCachedEffectRefStyle();
      };

      /**
       * populates the fill-color bean with required shape-fill properties
       * @param fillColorBean {Object} bean for fill-color, to populate with
       *                      required shape-fill properties
       */
      var _updateWithShapeFillProperties = function(fillColorBean) {
        // console.log("Inside Geometry Manager - _updateWithShapeFillProperties
        // function");

        fillColorBean.fill = shapeProperties.fill ? shapeProperties.fill :
          _getThemeFill();

        /*
         * As per cascading of group shape properties, if shapeProperties.fill
         * type is group fill then groupShapeProperties.fill will be applied.
         */
        if (fillColorBean.fill) {
          if (fillColorBean.fill.type === 'noFill') {
            fillColorBean.fill = undefined;
          } else if (groupShapeProperties && groupShapeProperties.fill &&
            fillColorBean.fill.type === 'grpFill') {
            if (groupShapeProperties.fill.type === "noFill") {
              fillColorBean.fill = undefined;
            } else {
              fillColorBean.fill = groupShapeProperties.fill;
            }
          } else if (fillColorBean.fill.type === 'solidFill' &&
              !fillColorBean.fill.color) {
            // Refer color from styleFillRef if shape has solidFill applied
            // without any color data.
            var styleFillRef = ThemeStyleRefManager.getCachedFillRefStyle();
            fillColorBean.fill.color = styleFillRef && styleFillRef.color;
          }
        }
      };

      /**
       * populates the fill-color bean with required outline/border fill and
       * ends properties
       * @param fillColorBean {Object} bean for fill-color, to populate with
       *                      required outline/border fill and ends properties
       */
      var _updateWithShapeOutlineFillProperties = function(fillColorBean) {
        // console.log("Inside Geometry Manager -
        // _updateWithShapeOutlineFillProperties function");

        var outlineProperties = {};
        var themeOutlineProperties = _getThemeOutline() || {};
        for (var themeProp in themeOutlineProperties) {
          outlineProperties[themeProp] = themeOutlineProperties[themeProp];
        }

        for (var lnProp in shapeProperties.ln) {
          if (shapeProperties.ln[lnProp] !== undefined) {
            outlineProperties[lnProp] = shapeProperties.ln[lnProp];
          }
        }

        if (outlineProperties) {
          //if line width is undefined then set it to 1
          fillColorBean.outlineFill.lineWidth =
            UnitConversionUtils.convertEmuToPixel(outlineProperties.w) || 1;

          //arrow related properties
          for (var arrowOutlineProp in outlineProperties.ends) {
            if (arrowOutlineProp !== undefined) {
              fillColorBean.ends[arrowOutlineProp] =
                outlineProperties.ends[arrowOutlineProp];
            }
          }
          if (outlineProperties.fill &&
            outlineProperties.fill.type !== "noFill") {
            if (outlineProperties.fill.type === "gradientFill") {
              if (outlineProperties.prstDash &&
                outlineProperties.prstDash !== 'solid') {
                _handleSolidFillBorder(fillColorBean,
                  outlineProperties.fill.gsLst[0].color);
              } else {
                _handleGradientFillBorder(fillColorBean,
                  outlineProperties.fill);
              }
            } else if(outlineProperties.fill.type === "solidFill"){
              _handleSolidFillBorder(fillColorBean,
                outlineProperties.fill.color);
            } else if(outlineProperties.fill.type === "patternFill") {
              _handleSolidFillBorder(fillColorBean,
                outlineProperties.fill.fgClr);
            }
            fillColorBean.prstDash =
                (outlineProperties.prstDash === undefined) ? 'solid' :
                    outlineProperties.prstDash;
          }
        }
      };

      /**
       * Handle solid fill border rendering
       *
       * @param fillColorBean - {Object} bean for fill-color
       * @param fill - outline fill JSON
       */
      var _handleSolidFillBorder = function(fillColorBean, color) {
        fillColorBean.outlineFill.type = "solidFill";
        fillColorBean.outlineFill.data = { "color": color };
      };

      /**
       * Handle gradient fill border rendering
       *
       * @param fillColorBean - {Object} bean for fill-color
       * @param fill - outline fill JSON
       */
      var _handleGradientFillBorder = function(fillColorBean, fill) {
        fillColorBean.outlineFill.type = "gradientFill";
        fillColorBean.outlineFill.data = fill;
      };

      /**
       * updates the effectsBean with required shadow effect properties
       * @return effectsBean - with all shadow properties computed
       */
      var _updateWithShapeEffectProperties = function() {
        var shadowProperties = {};
        //if shadow is applied to groupShape, apply the group shadow, else apply
        // indivudual shape shadow
        var resolvedEffects = {};
        DeprecatedUtils.appendJSONAttributes(
            resolvedEffects, shapeProperties.efstlst);
        if (groupShapeProperties) {
          DeprecatedUtils.appendJSONAttributes(
              resolvedEffects, groupShapeProperties.efstlst);
        }

        if(!resolvedEffects.isEmpty) {
          var themeEffect = _getThemeEffects();
          var themeOuterShadowEffects = themeEffect && themeEffect.outSdwEff;
          DeprecatedUtils.appendJSONAttributes(
              shadowProperties, themeOuterShadowEffects);
          var explicitOuterShadowEffects = resolvedEffects.outSdwEff;
          DeprecatedUtils.appendJSONAttributes(
              shadowProperties, explicitOuterShadowEffects);
        }
        return _shapeEffectsDecorator.computeShadowEffects(shadowProperties);
      };

      var _localApi = {

        /**
         * generates and returns the fill-color bean, containing shape-fill and
         * outline-fill properties
         * @return {Object} bean for fill-color
         */
        generateFillColorBean: function() {
          var fillColorBean = {
            fill: undefined,
            outlineFill: {
              type: undefined,
              lineWidth: undefined,
              data: undefined
            },
            ends: {
              headendtype: "none",
              headendlength: "medium",
              headendwidth: "medium",
              tailendtype: "none",
              tailendlength: "medium",
              tailendwidth: "medium"
            }
          };

          _updateWithShapeFillProperties(fillColorBean);
          _updateWithShapeOutlineFillProperties(fillColorBean);

          return fillColorBean;
        },

        /**
         * generates and returns the effects bean, containing shadow offsets and
         * color and blur
         * @return {Object} bean for effects
         */
        generateEffectsBean: function() {
          var effectsBean = _updateWithShapeEffectProperties();
          effectsBean.delta.x =
            UnitConversionUtils.convertPointToPixel(effectsBean.delta.x);
          effectsBean.delta.y =
            UnitConversionUtils.convertPointToPixel(effectsBean.delta.y);
          return effectsBean;
        },

        /**
         * evaluates the preset / custom-geometry and calls the paint-canvas
         * @param fillColorBean {Object} fill-color bean, containing shape-fill
         *                      and outline-fill properties
         * @param effectsBean shadow effect bean
         * @param shapeCanvas canvas
         */
        drawCanvas: function(fillColorBean, effectsBean, shapeCanvas) {
          // console.log("Inside Geometry Manager - drawCanvas function");
          var shapeTransformExtents = shapeProperties.xfrm.ext;
          var width = shapeTransformExtents.cx;
          var height = shapeTransformExtents.cy;
          var geometryProperties = shapeProperties.geom;

          var pathList, preDefinedGuide;

          // making the custom geometry not depend on evaluation of pre-defined
          // guide-map, guide-list and av-list
          if (geometryProperties.prst === undefined) {
            // --- handling custom geometry ---
            pathList = geometryProperties.pathLst;
          } else {
            // --- handling preset geometry ---
            //evaluate pre-defined guide
            preDefinedGuide =
              GuideEvaluator.evaluatePreDefinedGuide(height, width);

            //handling preset shapes
            var preset = PresetMap.getPresetData(geometryProperties.prst);

            //evaluate preset adjust values
            var adjustValueList = (geometryProperties.avLst === undefined) ?
              preset.avLst : geometryProperties.avLst;
            GuideEvaluator.evaluateGuideList(preDefinedGuide, adjustValueList);

            //evaluate preset guide
            GuideEvaluator.evaluateGuideList(preDefinedGuide, preset.gdLst);

            pathList = preset.pathLst;
          }

          //compute path list
          var paths = GuideEvaluator.
            evaluatePathList(preDefinedGuide, pathList, height, width);

          //paint the canvas
          CanvasPainter.
            paintCanvas(shapeCanvas, paths, fillColorBean, effectsBean);
        }
      };

      return _localApi;
    }
  };


  return _api;
});
