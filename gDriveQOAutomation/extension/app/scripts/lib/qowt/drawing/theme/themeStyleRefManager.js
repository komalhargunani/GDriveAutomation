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
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/drawing/theme/themeLineStyleManager',
  'qowtRoot/drawing/theme/themeEffectStyleManager'
], function(
    PointModel,
    ThemeFontManager,
    ThemeFillStyleManager,
    ThemeLineStyleManager,
    ThemeEffectStyleManager) {

  'use strict';

  var _api;

  var _shapeStyle;

  /**
   * returns the line ref color
   */
  var _getlnRefColor = function() {
    return _shapeStyle.lnRef.color;
  };

  /**
   * returns the effect ref color
   */
  var _getEffectRefColor = function() {
    return _shapeStyle.effectRef.color;
  };

  /**
   * returns the theme fill style for gradient fill, with appropriate scheme
   * colors
   * @param colorStopList - {JSON} for gradient color stops
   * @param type - indicates if color is to be taken from fill or outline fill
   *        Ref JSON.
   */
  var _getGradientColorStops = function(colorStopList, type) {
    var refFetchColorMap = {
      fillRef: _getFillRefColor,
      lnRef: _getlnRefColor
    };
    for (var i = 0; i < colorStopList.gsLst.length; i++) {
      if (PointModel.currentTable.isProcessingTable === true) {
        colorStopList.gsLst[i].color.scheme = type.color.scheme || undefined;
      } else {
        colorStopList.gsLst[i].color.scheme = refFetchColorMap[type] ?
            refFetchColorMap[type]().scheme : undefined;
      }
    }
    return colorStopList;
  };

  /**
   * returns the fill ref color
   */
  var _getFillRefColor = function() {
    return _shapeStyle.fillRef.color;
  };

  _api = {

    /**
     * Caches the shape style.
     * @param {Object} shapeStyleObject - the shape style JSON object.
     */
    cacheShapeStyle: function(shapeStyleObject) {
      _shapeStyle = shapeStyleObject;
    },

    /**
     * resets the shape style.
     */
    resetShapeStyle: function() {
      _shapeStyle = undefined;
    },

    /**
     * returns the cached font-ref for non-rectangular shapes
     * @return {Object} font and color JSON object
     */
    getCachedFontRefStyle: function() {
      var fontStyleJson = {};
      if (_shapeStyle && _shapeStyle.fntRef) {
        var index = _shapeStyle.fntRef.idx;
        fontStyleJson.color = _shapeStyle.fntRef.color;
        fontStyleJson.font = ThemeFontManager.getFontRefFontFace(index);
      }
      return fontStyleJson;
    },

    /**
     * returns the resolved font-ref for table cell text run props
     * @return {Object} font and color JSON object
     */
    getFontRefStyle: function(fontRef) {
      var fontStyleJson = {};
      var index = fontRef.idx;
      fontStyleJson.color = fontRef.color;
      fontStyleJson.font = ThemeFontManager.getFontRefFontFace(index);
      return fontStyleJson;
    },

    /**
     * returns the fill-ref CSS class for rectangular shapes
     * @return {Object} fill color JSON object
     */
    getFillRefClassName: function() {
      var themeFillStyleCSSClass;
      if (_shapeStyle && _shapeStyle.fillRef &&
          _shapeStyle.fillRef.idx !== 0) {
        themeFillStyleCSSClass = ThemeFillStyleManager.
            getFillStyleCSSClass(_shapeStyle.fillRef.idx,
              _getFillRefColor().scheme);
      }
      return themeFillStyleCSSClass;
    },

    /**
     * returns the outline-ref CSS class for rectangular shapes
     * @return {Object} outline color CSS class
     */
    getOutlineRefStyleClassName: function() {
      var themeOutlineStyleCSSClass;
      if (_shapeStyle && _shapeStyle.lnRef && _shapeStyle.lnRef.idx !== 0) {
        themeOutlineStyleCSSClass = ThemeLineStyleManager.
            getLineStyleCSSClass(_shapeStyle.lnRef.idx,
              _getlnRefColor().scheme);
      }
      return themeOutlineStyleCSSClass;
    },

    /**
     * returns the cached outline-ref style for non-rectangular shapes
     * @return {Object} outline color JSON object
     */
    getCachedOutlineRefStyle: function() {
      var themeLineStyle;
      if (_shapeStyle && _shapeStyle.lnRef) {
        themeLineStyle =
            ThemeLineStyleManager.getLineStyle(_shapeStyle.lnRef.idx);
        if (themeLineStyle && themeLineStyle.fill.type !== 'noFill') {
          if (themeLineStyle.fill.type === 'solidFill') {
            themeLineStyle.fill.color = _getlnRefColor();
          }
          else if (themeLineStyle.fill.type === 'gradientFill') {
            themeLineStyle.fill =
                _getGradientColorStops(themeLineStyle.fill, "lnRef");
          }
        }
      }
      return themeLineStyle;
    },

    /**
     * Return the outline style for table
     * @param lnRef
     */
    getOutlineRefStyleForTable: function(lnRef) {
      var lineStyle = ThemeLineStyleManager.getLineStyle(lnRef.idx);
      if (lineStyle && lineStyle.fill.type !== 'noFill') {
        if (lineStyle.fill.type === 'solidFill') {
          lineStyle.fill.color = lnRef.color;
        }
        else if (lineStyle.fill.type === 'gradientFill') {
          lineStyle.fill = _getGradientColorStops(lineStyle.fill, "lnRef");
        }
      }
      return lineStyle;
    },

    /**
     * returns the cached fill-ref style
     * @return {Object} fill color JSON object
     */
    getCachedFillRefStyle: function() {
      var themeFillStyle;
      if (_shapeStyle && _shapeStyle.fillRef) {
        themeFillStyle =
            ThemeFillStyleManager.getFillStyle(_shapeStyle.fillRef.idx);
        if (themeFillStyle && themeFillStyle.type !== 'noFill') {
          if (themeFillStyle.type === 'solidFill') {
            themeFillStyle.color = _getFillRefColor();
          }
          else if (themeFillStyle.type === 'gradientFill') {
            themeFillStyle = _getGradientColorStops(themeFillStyle, "fillRef");
          }
        }
      }
      return themeFillStyle;
    },

    /**
     * returns the fill-ref style for table
     * @return {Object} fill color JSON object
     */
    getFillRefStyleForTable: function(fillRef) {
      var fillStyle = ThemeFillStyleManager.getFillStyle(fillRef.idx);
      if (fillStyle && fillStyle.type !== 'noFill') {
        if (fillStyle.type === 'solidFill') {
          fillStyle.color = fillRef.color;
        } else if (fillStyle.type === 'gradientFill') {
          fillStyle = _getGradientColorStops(fillStyle, fillRef);
        }
      }
      return fillStyle;
    },

    /**
     * returns the high level effect-ref CSS class
     * @return {String} effects style string
     */
    getHighLevelEffectRefClassName: function() {
      var themeEffectHighLevelStyleCSSClass;

      if (_shapeStyle && _shapeStyle.effectRef &&
          _shapeStyle.effectRef.idx !== 0) {
        themeEffectHighLevelStyleCSSClass = ThemeEffectStyleManager.
            getHighLevelEffectStyleCSSClass(_shapeStyle.effectRef.idx,
              _getEffectRefColor().scheme);
      }

      return themeEffectHighLevelStyleCSSClass;
    },

    /**
     * returns the high level effect-ref CSS class
     * @return {String} effects style string
     */
    getLowLevelEffectRefClassName: function() {
      var themeEffectLowLevelStyleCSSClass;

      if (_shapeStyle && _shapeStyle.effectRef &&
          _shapeStyle.effectRef.idx !== 0) {
        themeEffectLowLevelStyleCSSClass = ThemeEffectStyleManager.
            getLowLevelEffectStyleCSSClass(_shapeStyle.effectRef.idx,
              _getEffectRefColor().scheme);
      }

      return themeEffectLowLevelStyleCSSClass;
    },

    /**
     * returns the cached effect-ref style
     * @return {Object} effect JSON object
     */
    getCachedEffectRefStyle: function() {
      var themeEffectStyle;
      if (_shapeStyle && _shapeStyle.effectRef &&
          _shapeStyle.effectRef.idx !== 0) {

          themeEffectStyle =
              ThemeEffectStyleManager.getEffectStyle(_shapeStyle.effectRef.idx);
          var shadowEffect = themeEffectStyle && themeEffectStyle.outSdwEff;
          if (shadowEffect) {
            shadowEffect.color.scheme = _getEffectRefColor().scheme;
          }
        }
      return themeEffectStyle;
    },

    /**
     * Fetches resolved font-ref of the shape being rendered.
     * @param {Object} textRun - text run js object
     * @return {Object} font-ref js object
     */
    getResolvedFontRefStyle: function(textRun) {
      if (PointModel.currentTable.isProcessingTable &&
        textRun.fontRef) {
          return _api.getFontRefStyle(textRun.fontRef);
      }
      return _api.getCachedFontRefStyle();
    }
  };

  return _api;
});
