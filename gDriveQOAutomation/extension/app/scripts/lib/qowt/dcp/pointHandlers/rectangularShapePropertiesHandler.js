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
 * Rectangular shape's properties handler
 *
 *
 * {
 "id":<id>,
 "geom":<Preset Geometry JSON>/<Custom Geometry JSON>,
 "xfrm":<2D Transform JSON>,
 "fill":<solid fill JSON>/<gradient fill JSON>/<noFill>/<blip fill JSON>/
        <grpFill>,
 "ln":<outline JSON>
 }
 */
define([
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/utils/deprecatedUtils',

  'third_party/lo-dash/lo-dash.min'
], function(FillHandler, ThemeStyleRefManager,
            TableStyleManager, shapeEffectsDecorator, DeprecatedUtils) {

  'use strict';

  var _shapeDiv, // Holds shape div
      _shapeFillDiv, // holds shape-fill div
      _shapeProperties, // Holds shape properties
      _groupShapeProperties, // Holds group shape properties
      _fillHandler,// Fill handler, instance of QOWT.DCP.Handler.Fill
      _shapeEffectsDecorator;


  /**
   * Handle fill
   */
  var _handleFill = function() {
    if (!_fillHandler) {
      _fillHandler = FillHandler;
    }

    //handle the fill for table - apply css classes
    if (_shapeProperties.isShapeWithinTable === true) {
      TableStyleManager.applyTblCellStyleClasses(_shapeFillDiv,
          TableStyleManager.styleType.cellFillStyle);
    }

    /*
     * As per cascading of group shape properties, if shapeProperties.fill type
     * is group fill then groupShapeProperties.fill will be applied.
     */
    if (_shapeProperties.fill) {
      //First clear all the styles applied, since in undo operation we need to
      //apply same properties over, without overriding.
      _shapeFillDiv.style.cssText = '';
      if (_shapeProperties.fill.type === 'solidFill' &&
          !_shapeProperties.fill.color) {
        // Refer color from styleFillRef if shape has solidFill applied without
        // any color data.
        var stylefillRef = ThemeStyleRefManager.getCachedFillRefStyle();
        _shapeProperties.fill.color = stylefillRef && stylefillRef.color;
      }

      if (_shapeProperties.fill.type !== 'grpFill') {
        _fillHandler.handleUsingHTML(_shapeProperties.fill, _shapeFillDiv);
      } else if (_shapeProperties.fill.type === 'grpFill' &&
          _groupShapeProperties && _groupShapeProperties.fill &&
          _groupShapeProperties.fill.type !== 'noFill') {
        //checking when shape-fill refers to group-fill, and group-shape
        // properties is either undefined, or group-fill is missing.

        _fillHandler.handleUsingHTML(_groupShapeProperties.fill, _shapeFillDiv);
      }
    } else {
      var fillRefClassName = ThemeStyleRefManager.getFillRefClassName();
      if (fillRefClassName &&
          !_shapeFillDiv.classList.contains(fillRefClassName)) {
        _shapeFillDiv.className += (' ' + fillRefClassName);
      } else {
        //the fill specified in fillRef does not refer to any fill style in
        // theme so treat it as inline style
        var cachedFillRef = ThemeStyleRefManager.getCachedFillRefStyle();
        if (cachedFillRef) {
          _fillHandler.handleUsingHTML(cachedFillRef, _shapeFillDiv);
        }
      }

    }
  };

  /**
   * Handle low level effects
   * It handles low level effects for shape and table
   * low level effects are the ones for which implementation is different for
   * canvas and rectangular shapes
   */
  var _handleLowLevelEffects = function() {
    var resolvedEffects = {};
    DeprecatedUtils.
        appendJSONAttributes(resolvedEffects, _shapeProperties.efstlst);
    if (_groupShapeProperties) {
      DeprecatedUtils.
          appendJSONAttributes(resolvedEffects, _groupShapeProperties.efstlst);
    }

    var outerShadowJSON = resolvedEffects.outSdwEff;
    var shadowStyleForRect =
        outerShadowJSON && _shapeEffectsDecorator.withShadow(outerShadowJSON);
    DeprecatedUtils.appendJSONAttributes(_shapeDiv.style, shadowStyleForRect);

    var effectRefStyleClassName =
        ThemeStyleRefManager.getLowLevelEffectRefClassName();
    if (effectRefStyleClassName &&
        !_shapeDiv.classList.contains(effectRefStyleClassName)) {
      _shapeDiv.className += (' ' + effectRefStyleClassName);
    }
  };


  /**
   * Handles redundant effects of shapes
   */
  var _handleRedundantEffect = function() {
    var effectList = _shapeProperties.efstlst;
    var redundantStyle = _shapeEffectsDecorator.withRedundantEffects(
        _shapeDiv, effectList, false);
    DeprecatedUtils.appendJSONAttributes(_shapeDiv.style, redundantStyle);
  };


  var _api = {

    /**
     * Handle shape properties for rectangular shape.
     * @param {Object} shapeProperties The shape properties for rectangular
     *                                 shape
     * @param {Object} groupShapeProperties The group shape properties for
     *                                      rectangular shape
     * @param {HTMLElement} shapeDiv The shape DIV html element
     * @param {HTMLElement} shapeFillDiv The child div of shape div, to fill
     */
    handle: function(shapeProperties, groupShapeProperties, shapeDiv,
                     shapeFillDiv) {
      // console.log("Inside RectangularShapeProperties handler -- handle");
      _shapeDiv = shapeDiv;
      _shapeProperties = _.cloneDeep(shapeProperties);
      _groupShapeProperties = groupShapeProperties;
      _shapeFillDiv = shapeFillDiv;

      _handleFill();

      if (!_shapeEffectsDecorator) {
        _shapeEffectsDecorator = shapeEffectsDecorator.create();
      }

      _handleLowLevelEffects();

      _handleRedundantEffect();
    }
  };


  return _api;
});
