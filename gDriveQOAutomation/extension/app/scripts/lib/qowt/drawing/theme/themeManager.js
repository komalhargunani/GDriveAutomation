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
 * caches theme definitions.
 * @constructor
 */
define([
  'qowtRoot/models/point'
], function(PointModel) {

  'use strict';

  var _api;

  /**
   * cache the line and fill styles
   * @param {String} schemeData - theme scheme-type info to cache.
   * @param {String} schemeType - theme scheme-type to cache.
   * @param {String} index - theme scheme-type index.
   */
  var _cacheLineAndFillStyle = function(schemeData, schemeType, index) {
    if (_themes[PointModel.ThemeId] [_schemeTypeMap[schemeType].type] ===
        undefined) {
          _themes[PointModel.ThemeId] [_schemeTypeMap[schemeType].type] = {};
    }
    _themes[PointModel.ThemeId] [_schemeTypeMap[schemeType].type][index] =
        schemeData;
  };

  /**
   * cache the font style
   * @param {String} schemeData - theme scheme-type info to cache.
   */
  var _cacheFontStyle = function(schemeData) {
    _themes[PointModel.ThemeId][_schemeTypeMap.fntSchm.type] = schemeData;
  };

  /**
   * cache the color schemes
   * @param {String} schemeData - theme scheme-type info to cache.
   */
  var _cacheColorScheme = function(schemeData) {
    var colorSchemeCache = {};

    for (var i = 0; i < schemeData.length; i++) {
      var colorData = schemeData[i];
      colorSchemeCache[colorData.name] = colorData.value;
    }

    _themes[PointModel.ThemeId][_schemeTypeMap.clrSchm.type] = colorSchemeCache;
  };

  /**
   * cache the effect style JSON
   * @param {String} schemeType - theme scheme-type to cache.
   * @param {String} schemeData - theme scheme-type info to cache.
   * @param {String} index - theme scheme-type index.
   */
  var _cacheEffectStyle = function(schemeData, schemeType, index) {

    if (_themes[PointModel.ThemeId][_schemeTypeMap[schemeType].type] ===
        undefined) {
        _themes[PointModel.ThemeId][_schemeTypeMap[schemeType].type] = {};
    }

    _themes[PointModel.ThemeId][_schemeTypeMap[schemeType].type][index] =
        schemeData;
  };

  var _schemeTypeMap =
  {
    clrSchm: {
      type: 'colorScheme',
      cacheFunc: _cacheColorScheme
    },
    fntSchm: {
      type: 'fontScheme',
      cacheFunc: _cacheFontStyle
    },
    fillStl: {
      type: 'fillStyle',
      cacheFunc: _cacheLineAndFillStyle
    },
    lnStl: {
      type: 'lineStyle',
      cacheFunc: _cacheLineAndFillStyle
    },
    effectStl: {
      type: 'effectStyle',
      cacheFunc: _cacheEffectStyle
    }
  };

  var _themes = {};

  _api = {

    /**
     * return the fill scheme JSON
     * @param {String} index - the index of line style predefined in theme
     *        format scheme.
     * @return {Object} the fill JSON object predefined in theme format scheme.
     */
    getFillStyle: function(index) {
      return _themes[PointModel.ThemeId] [_schemeTypeMap.fillStl.type][index];
    },

    /**
     * return the effect Lst JSON
     * @param {String} index - the index of line style predefined in theme
     *        format scheme.
     * @return {Object} the fill JSON object predefined in theme format scheme.
     */
    getEffectStyle: function(index) {
      return _themes[PointModel.ThemeId] [_schemeTypeMap.effectStl.type][index];
    },

    /**
     * returns the font scheme JSON
     * @return {Object} the cached font JSON object.
     */
    getFontStyle: function() {
      return _themes[PointModel.ThemeId] [_schemeTypeMap.fntSchm.type];
    },

    /**
     * Returns the line style JSON object predefined in theme format scheme.
     * @param {String} index - the index of line style predefined in theme
     *        format scheme.
     * @return {Object} the outline JSON object predefined in theme format
     *        scheme.
     */
    getLineStyle: function(index) {
      return _themes[PointModel.ThemeId] [_schemeTypeMap.lnStl.type][index];
    },

    /**
     * returns the color map for theme.
     * @return {JSON} color map.
     */
    getColorTheme: function() {
      return _themes[PointModel.ThemeId][_schemeTypeMap.clrSchm.type];
    },

    /**
     * caches the theme styles and schemes.
     * @param {String} schemeType - theme scheme-type to cache.
     * @param {String} schemeData - theme scheme-type info to cache.
     * @param {String} index - theme scheme-type index.
     */
    cacheThemeElement: function(schemeType, schemeData, index) {
      if (_themes[PointModel.ThemeId] === undefined) {
        _themes [PointModel.ThemeId] = {};
      }

      _schemeTypeMap[schemeType].cacheFunc(schemeData, schemeType, index);
    }
  };

  return _api;
});

