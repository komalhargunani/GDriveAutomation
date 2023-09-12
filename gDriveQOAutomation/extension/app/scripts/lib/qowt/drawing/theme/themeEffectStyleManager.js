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
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/color/colorUtility'
], function(
    PointModel,
    CSSManager,
    ShapeEffectsDecorator,
    DeprecatedUtils,
    ThemeManager,
    ColorUtility) {

  'use strict';

  var _api;

  var _kLevel = {
    highLevel: 'high_level',
    lowLevel: 'low_level'
  };

  var _shapeEffectsDecorator = ShapeEffectsDecorator.create();

  /**
   * private class with the responsibility of generating style-classes,
   * and returning the correct style-class name, for a theme-effect,
   * and theme effect-style combination.
   * @param {String} type - theme-effect.
   * @private {Class}.
   * @constructor
   */
  var ClsThemeEffectStyle = function(type) {
    this.type = type;
  };

  /**
   * public function of the private class - ClsThemeEffectStyle.
   * returns the css style class name, for the theme effect-style index,
   * and the theme-effect combination.
   * @param {String} index - theme effect-style index.
   * @return {String} css style class name.
   */
  ClsThemeEffectStyle.prototype.getStyleClass = function(index, level) {
    return "thm_" + PointModel.ThemeId + "_effect_" + index + "_" + this.type +
        "_" + level;
  };

  /**
   * public function of the private class - ClsThemeEffectStyle. creates css
   * style class for theme effect-style index and the theme-effect combination,
   * and appends it to the document.
   *
   * @param {String} index - theme effect-style index.
   * @param {JSON} effectStyleJSON - theme effect-style properties.
   */
  ClsThemeEffectStyle.prototype.appendHighLevelStyleClass =
      function(index, effectStyleJSON) {
    var styleString = '';

    styleString += DeprecatedUtils.getElementStyleString(
        _shapeEffectsDecorator.withReflection(effectStyleJSON.refnEff));

    var styleClassName = this.getStyleClass(index, _kLevel.highLevel);
    var selector = '.' + styleClassName;

    CSSManager.addRule(selector, styleString, 100);
  };

  /**
   * public function of the private class - ClsThemeEffectStyle. creates css
   * style class for theme effect-style index and the theme-effect combination,
   * and appends it to the document. This style is applied to shape div when
   * effect is applied to canvas
   *
   * @param {String} index - theme effect-style index.
   * @param {JSON} effectLstJSON - theme effect-style properties.
   */
  ClsThemeEffectStyle.prototype.appendLowLevelStyleClass =
      function(index, effectLstJSON) {

    var styleString = '';

    var outerShadow = effectLstJSON.outSdwEff;
    if (outerShadow) {
      outerShadow.color.scheme = this.type;
      styleString += DeprecatedUtils.getElementStyleString(
          _shapeEffectsDecorator.withShadow(outerShadow));
    }
    var styleClassName = this.getStyleClass(index, _kLevel.lowLevel);
    var selector = '.' + styleClassName;

    CSSManager.addRule(selector, styleString, 100);
  };

  var _effectStyleClassMap = {
    'dk1': new ClsThemeEffectStyle('dk1'),

    'lt1': new ClsThemeEffectStyle('lt1'),

    'dk2': new ClsThemeEffectStyle('dk2'),

    'lt2': new ClsThemeEffectStyle('lt2'),

    'accent1': new ClsThemeEffectStyle('accent1'),

    'accent2': new ClsThemeEffectStyle('accent2'),

    'accent3': new ClsThemeEffectStyle('accent3'),

    'accent4': new ClsThemeEffectStyle('accent4'),

    'accent5': new ClsThemeEffectStyle('accent5'),

    'accent6': new ClsThemeEffectStyle('accent6'),

    'hlink': new ClsThemeEffectStyle('hlink'),

    'folHlink': new ClsThemeEffectStyle('folHlink')
  };

  _api = {

    /**
     * Creates CSS classes for theme effect styles.
     * @param {String} index - the index of effect style.
     * @param {JSON} effectStyleJSON - effectLst JSON object.
     */
    createEffectStyleCSSClass: function(index, effectStyleJSON) {
      for (var key in _effectStyleClassMap) {

        // If effect is applied to shape div only(not on canvas) then high level
        // style class will be applied to shape div.
        _effectStyleClassMap[key].appendHighLevelStyleClass(index,
            effectStyleJSON);  //reflection, etc

        // If effect is separately applied to canvas(like shadow effect for
        // preset shapes) then low level style class is applied to shape div.
        _effectStyleClassMap[key].appendLowLevelStyleClass(index,
            effectStyleJSON); //shadow, etc.
      }
    },

    /**
     * Returns CSS class for theme effect style for given index and theme
     * effect. If effect is applied to shape div only(not on canvas) then high
     * level style class will be applied to shape div.
     *
     * @param {String} index - the index of effect style.
     * @param {String} themeColor - the theme color for example 'accent1' etc.
     * @return {String} the CSS class for theme fill style.
     */
    getHighLevelEffectStyleCSSClass: function(index, themeColor) {
      var resolvedThemeColor =
          ColorUtility.getThemeEquivalentOfSchemeColor(themeColor);
      return _effectStyleClassMap[resolvedThemeColor].
          getStyleClass(index, _kLevel.highLevel);
    },

    /**
     * Returns CSS class for theme effect style for given index and theme
     * effect. If effect is separately applied to canvas(like shadow effect for
     * preset shapes) then low level style class is applied to shape div.
     *
     * @param {String} index - the index of effect style.
     * @param {String} themeColor - the theme color for example 'accent1' etc.
     * @return {String} the CSS class for theme fill style.
     */
    getLowLevelEffectStyleCSSClass: function(index, themeColor) {
      var resolvedThemeColor =
          ColorUtility.getThemeEquivalentOfSchemeColor(themeColor);
      return _effectStyleClassMap[resolvedThemeColor].
          getStyleClass(index, _kLevel.lowLevel);
    },

    /**
     * Caches properties of theme effect styles.
     * @param {String} index - the index of effect style predefined in theme
     *        format scheme.
     * @param {JSON} effectLstJSON - the fill JSON object.
     */
    cacheThemeEffectStyleLst: function(index, effectLst) {
      ThemeManager.cacheThemeElement('effectStl', effectLst, index);
    },

    /**
     * Returns cached theme effect style for given index.
     * @param {String} index - the index of fill style predefined in theme
     *        format scheme.
     * @return {JSON} the fill JSON object contains cached theme fill style.
     */
    getEffectStyle: function(index) {
      return ThemeManager.getEffectStyle(index);
    }
  };

  return _api;
});
