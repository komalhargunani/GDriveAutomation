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
 * This is the Manager for the Theme line styles.
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/drawing/color/colorUtility'
], function(
    PointModel,
    ThemeManager,
    CSSManager,
    OutlineDecorator,
    ColorUtility) {

  'use strict';

  var _api;

  /**
   * private class with the responsibility of generating style-classes,
   * and returning the correct style-class name, for a theme-color,
   * and theme line-style combination.
   * @param {String} type - theme-color.
   * @private {Class}.
   * @constructor
   */
  var ClsThemeLineStyle = function(type) {
    this.type = type;
  };

  /**
   * public function of the private class - ClsThemeLineStyle.
   * returns the css style class name for the theme line-style index,
   * and the theme-color combination.
   * @param {String} index - theme line-style index.
   * @return {String} css style class name.
   */
  ClsThemeLineStyle.prototype.getStyleClass = function(index) {
    return "thm_" + PointModel.ThemeId + "_ln_" + index + "_" + this.type;
  };

  /**
   * public function of the private class - ClsThemeLineStyle. creates css style
   * class for theme line-style index and the theme-color combination, and
   * appends it to the document.
   *
   * @param {String} index - theme line-style index.
   * @param {JSON} outlineJSON - theme line-style properties.
   */
  ClsThemeLineStyle.prototype.appendStyleClass = function(index, outlineJSON) {
    if (outlineJSON) {
      var fillJSON = outlineJSON.fill;

      if (fillJSON.type === 'solidFill') {
        fillJSON.color.scheme = this.type;
      } else if (fillJSON.type === 'gradientFill') {
        for (var i = 0; i < fillJSON.gsLst.length; i++) {
          var gradientColorStop = fillJSON.gsLst[i];
          gradientColorStop.color.scheme = this.type;
        }
      }

      var selector = '.' + this.getStyleClass(index);
      CSSManager.addRule(selector, OutlineDecorator.create().
          getPlaceHolderStyle(outlineJSON), 100);
    }
  };

  var _lineStyleClassMap = {
    'dk1': new ClsThemeLineStyle('dk1'),

    'lt1': new ClsThemeLineStyle('lt1'),

    'dk2': new ClsThemeLineStyle('dk2'),

    'lt2': new ClsThemeLineStyle('lt2'),

    'accent1': new ClsThemeLineStyle('accent1'),

    'accent2': new ClsThemeLineStyle('accent2'),

    'accent3': new ClsThemeLineStyle('accent3'),

    'accent4': new ClsThemeLineStyle('accent4'),

    'accent5': new ClsThemeLineStyle('accent5'),

    'accent6': new ClsThemeLineStyle('accent6'),

    'hlink': new ClsThemeLineStyle('hlink'),

    'folHlink': new ClsThemeLineStyle('folHlink')
  };

  _api = {
    /**
     * Creates CSS classes for theme line styles.
     * @param index the index of line style predefined in theme format scheme.
     * @param outlineJSON {Object} the outline JSON object.
     */
    createLineStyleCSSClass: function(index, outlineJSON) {
      for (var key in _lineStyleClassMap) {
        _lineStyleClassMap[key].appendStyleClass(index, outlineJSON);
      }
    },

    /**
     * Returns CSS class for theme line style for given index and theme color.
     * @param {String} index - the index of line style predefined in theme
     *        format scheme.
     * @param {String} themeColor - the theme color for example 'accent1' etc.
     * @return the CSS class for theme line style.
     */
    getLineStyleCSSClass: function(index, themeColor) {
      var resolvedThemeColor = ColorUtility.
          getThemeEquivalentOfSchemeColor(themeColor);
      return _lineStyleClassMap[resolvedThemeColor].getStyleClass(index);
    },

    /**
     * Caches properties of theme line styles.
     * @param {String} index - the index of line style predefined in theme
     *        format scheme.
     * @param {Object} outlineJSON - the outline JSON object.
     */
    cacheThemeLineStyle: function(index, outlineJSON) {
      ThemeManager.cacheThemeElement('lnStl', outlineJSON, index);
    },

    /**
     * Returns cached theme line style for given index.
     * @param index the index of line style predefined in theme format scheme.
     * @return {Object} the outline JSON object contains cached theme line
     *         style.
     */
    getLineStyle: function(index) {
      return ThemeManager.getLineStyle(index);
    }
  };

  return _api;
});
