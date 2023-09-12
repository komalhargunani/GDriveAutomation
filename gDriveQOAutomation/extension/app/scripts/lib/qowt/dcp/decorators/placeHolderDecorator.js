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
 * JsDoc description
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/dcp/decorators/pointTextBodyPropertiesDecorator',
  'qowtRoot/dcp/pointHandlers/shapePropertiesHandler',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator'
],
  function(
    UnitConversionUtils,
    OutlineDecorator,
    FillHandler,
    PointTextBodyPropertiesDecorator,
    ShapePropertiesHandler,
    DeprecatedUtils,
    PointModel,
    ThemeStyleRefManager,
    shapeEffectsDecorator) {

  'use strict';


    var _factory = {

      create: function() {

        // use module pattern for instance object
        var module = function() {

          var _shapeEffectsDecorator;

          var _api = {
            /**
             * decorates the place-holder
             * @param styleObj {JSON Object} JSON having styleText element, to
             *                               apply
             * @return {Object} api object containing decorator functions
             */
            decorate: function(styleObj) {

              /**
               * appends the css style to the style object
               * @param style the css style property
               * @param styleText the css style value
               */
              var _appendStyle = function(style, styleText) {
                styleObj.styleText += (style + ' : ' + styleText + ';');
              };

              var _localApi = {

                /**
                 * decorates the place holder with the transforms
                 * @param shapeTransform {Object} Shape extents and offsets
                 * @param textBodyProperties {Object} Place-holder text-body
                 *                                    properties
                 * @return {Object} local API for the decorator
                 */
                withShapeTransform: function(shapeTransform,
                                             textBodyProperties) {
                  if (shapeTransform !== undefined) {
                    PointModel.shapeDimensions = shapeTransform;

                    if (shapeTransform.ext !== undefined) {
                      _appendStyle('width', UnitConversionUtils.
                        convertEmuToPixel(shapeTransform.ext.cx) + 'px');
                      _appendStyle('height', UnitConversionUtils.
                        convertEmuToPixel(shapeTransform.ext.cy) + 'px');
                    }

                    if (shapeTransform.off !== undefined) {
                      _appendStyle('left', UnitConversionUtils.
                        convertEmuToPoint(shapeTransform.off.x) + 'pt');
                      _appendStyle('top', UnitConversionUtils.
                        convertEmuToPoint(shapeTransform.off.y) + 'pt');
                    }

                    if (shapeTransform.flipH !== false ||
                      shapeTransform.flipV !== false ||
                      shapeTransform.rot !== "0") {
                      _appendStyle('-webkit-transform', ShapePropertiesHandler.
                        handleFlipAndRotate(shapeTransform.flipH,
                        shapeTransform.flipV, shapeTransform.rot));
                    }
                  }

                  var style = {};
                  var pointTextBodyPropertiesDecorator =
                    PointTextBodyPropertiesDecorator.create();
                  if (textBodyProperties) {
                    pointTextBodyPropertiesDecorator.
                      getContainingShapeBoxAlignProperty(textBodyProperties,
                      style);
                  }
                  styleObj.styleText += DeprecatedUtils.
                    getElementStyleString(style);

                  return _localApi;
                },

                /**
                 * decorates the place holder with the fill
                 * @param shapeFill {Object} Shape fill properties
                 * @param styleClassName {String} name of the style-class to
                 *                       which the style is to be applied.
                 *                       It is required specifically for tiled
                 *                       blip-fill.
                 * @return {Object} local API for the decorator
                 */
                withShapeFill: function(shapeFill, isStyleForPlaceHolder,
                                        styleClassName) {
                  var fillObj;
                  if (shapeFill !== undefined && shapeFill !== 'noFill') {
                    fillObj = shapeFill;
                  }else if(isStyleForPlaceHolder){
                    fillObj =  ThemeStyleRefManager.getCachedFillRefStyle();
                  }
                  if((fillObj !== undefined) && (fillObj !== null)) {
                    var fillStyle = FillHandler.getFillStyle(fillObj,
                      styleClassName);
                    styleObj.styleText += fillStyle;
                  }

                  return _localApi;
                },

                /**
                 * decorates the place holder with the outline properties
                 * @param shapeOutline {Object} Shape outline properties
                 * @return {Object} local API for the decorator
                 */
                withShapeOutline: function(shapeOutline,isStyleForPlaceHolder) {
                  var outlineObj;
                  if (shapeOutline !== undefined) {
                    outlineObj = shapeOutline;
                  }else if(isStyleForPlaceHolder){
                    outlineObj = ThemeStyleRefManager.
                      getCachedOutlineRefStyle();
                  }

                  if ((outlineObj !== undefined ||
                    PointModel.currentPHLevel === 'sldmt')){
                    var outlineStyle = OutlineDecorator.create().
                      getPlaceHolderStyle(outlineObj);
                    styleObj.styleText += outlineStyle;
                  }

                  return _localApi;
                },

                /**
                 * Decorates the place holder with the effect style
                 * @param effectList {Object} Shape effect style properties
                 * @return {Object} local API for the decorator
                 */
                withShapeEffects: function(effectList) {
                  if (effectList !== undefined) {

                    if(!_shapeEffectsDecorator){
                      _shapeEffectsDecorator = shapeEffectsDecorator.create();
                    }

                    var styleString = '';
                    var reflectionEffect = effectList.refnEff;
                    if (reflectionEffect) {
                      styleString += DeprecatedUtils.getElementStyleString(
                        _shapeEffectsDecorator.withReflection(
                          reflectionEffect));
                    }
                    var shadowEffect = effectList.outSdwEff;
                    if (shadowEffect) {
                      styleString += shadowEffect && DeprecatedUtils.
                        getElementStyleString(_shapeEffectsDecorator.
                        withShadow(shadowEffect));
                    }
                    styleObj.styleText += styleString;
                  }

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
