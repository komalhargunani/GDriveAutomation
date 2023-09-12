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
 * This is the Manager for the Theme fill styles.
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/utils/cssManager',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/color/colorUtility'
], function(PointModel, FillHandler, CSSManager, ThemeManager, ColorUtility) {

  'use strict';

  var _api;

  /**
   * private class with the responsibility of generating style-classes,
   * and returning the correct style-class name, for a theme-color,
   * and theme fill-style combination.
   * @param {String} type - theme-color.
   * @private {Class}.
   * @constructor
   */
  var ClsThemeFillStyle = function(type) {
    this.type = type;
  };

  /**
   * public function of the private class - ClsThemeFillStyle.
   * returns the css style class name, for the theme fill-style index,
   * and the theme-color combination.
   * @param {String} index - theme fill-style index.
   * @return {String} css style class name.
   */
  ClsThemeFillStyle.prototype.getStyleClass = function(index) {
    return "thm_" + PointModel.ThemeId + "_fill_" + index + "_" + this.type;
  };

  /**
   * public function of the private class - ClsThemeFillStyle.
   * creates css style class for theme fill-style index and the theme-color
   * combination,and appends it to the document.
   *
   * @param {String} index - theme fill-style index.
   * @param {JSON} fillJSON - theme fill-style properties.
   */
  ClsThemeFillStyle.prototype.appendStyleClass = function(index, fillJSON) {
    if (fillJSON.type === 'solidFill' && fillJSON.color) {
      fillJSON.color.scheme = this.type;
    } else if (fillJSON.type === 'gradientFill' && fillJSON.gsLst) {
      for (var i = 0; i < fillJSON.gsLst.length; i++) {
        var gradientColorStop = fillJSON.gsLst[i];
        gradientColorStop.color.scheme = this.type;
      }
    }

    var styleClassName = this.getStyleClass(index);
    var selector = '.' + styleClassName;
    CSSManager.addRule(selector, FillHandler.
        getFillStyle(fillJSON, styleClassName), 100);
  };

  var _blipThemeFillStyle = new ClsThemeFillStyle('blip');

  var _fillStyleClassMap = {
    'dk1': new ClsThemeFillStyle('dk1'),

    'lt1': new ClsThemeFillStyle('lt1'),

    'dk2': new ClsThemeFillStyle('dk2'),

    'lt2': new ClsThemeFillStyle('lt2'),

    'accent1': new ClsThemeFillStyle('accent1'),

    'accent2': new ClsThemeFillStyle('accent2'),

    'accent3': new ClsThemeFillStyle('accent3'),

    'accent4': new ClsThemeFillStyle('accent4'),

    'accent5': new ClsThemeFillStyle('accent5'),

    'accent6': new ClsThemeFillStyle('accent6'),

    'hlink': new ClsThemeFillStyle('hlink'),

    'folHlink': new ClsThemeFillStyle('folHlink')
  };

  _api = {
    /**
     * Creates CSS classes for theme fill styles.
     * @param {String} index - the index of fill style predefined in theme
     *        format scheme.
     * @param {JSON} fillJSON - the fill JSON object.
     */
    createFillStyleCSSClass: function(index, fillJSON) {
      if (fillJSON.type === 'blipFill') {
        _blipThemeFillStyle.appendStyleClass(index, fillJSON);
      } else {
        for (var key in _fillStyleClassMap) {
          _fillStyleClassMap[key].appendStyleClass(index, fillJSON);
        }
      }
    },

    /**
     * Returns CSS class for theme fill style for given index and theme color.
     * @param {String} index - the index of fill style predefined in theme
     *        format scheme.
     * @param {String} themeColor - the theme color for example 'accent1' etc.
     * @return {String} the CSS class for theme fill style.
     */
    getFillStyleCSSClass: function(index, themeColor) {
      if(index === 1000) {
        return 'qowt-point-blankBackground';
      }

      var cachedFillJSON = this.getFillStyle(index);
      if (cachedFillJSON && cachedFillJSON.type === 'blipFill') {
        return _blipThemeFillStyle.getStyleClass(index);
      } else {
        var resolvedThemeColor =
            ColorUtility.getThemeEquivalentOfSchemeColor(themeColor);
        return _fillStyleClassMap[resolvedThemeColor].getStyleClass(index);
      }
    },

    /**
     * Caches properties of theme fill styles.
     * @param {String} index - the index of fill style predefined in theme
     *        format scheme.
     * @param {JSON} fillJSON - the fill JSON object.
     */
    cacheThemeFillStyle: function(index, fillJSON) {
      ThemeManager.cacheThemeElement('fillStl', fillJSON, index);
    },

    /**
     * Returns cached theme fill style for given index.
     * @param {String} index - the index of fill style predefined in theme
     *        format scheme.
     * @return {JSON} the fill JSON object contains cached theme fill style.
     */
    getFillStyle: function(index) {
      if (index === 0) {
        return {type: 'noFill'};
      }
      return ThemeManager.getFillStyle(index);
    }
  };

  return _api;
});
