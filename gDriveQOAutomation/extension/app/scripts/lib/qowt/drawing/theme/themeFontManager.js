define([
  'qowtRoot/drawing/theme/themeManager'
], function(ThemeManager) {

  'use strict';

  var themeFontLang_ = {
    '+mj-lt': 'latin',
    '+mj-ea': 'eastAsian',
    '+mj-cs': 'complexScript',
    '+mn-lt': 'latin',
    '+mn-ea': 'eastAsian',
    '+mn-cs': 'complexScript'
  };

  var themeFontCategory_ = {
    '+mj-lt': 'mjFnt',
    '+mj-ea': 'mjFnt',
    '+mj-cs': 'mjFnt',
    '+mn-lt': 'mnFnt',
    '+mn-ea': 'mnFnt',
    '+mn-cs': 'mnFnt'
  };

  var fontRefToThemeFont_ = {
    major: '+mj-lt',
    minor: '+mn-lt'
  };

  /**
   * The theme font manager queries the theme and map theme font names to font
   * faces.
   */
  var api_ = {
    /** @returns {string} Font face associated with a theme font. */
    getThemeFontFace: function(font) {
      return getThemeFontFace_(font);
    },

    /** @return {boolean} True if is a theme font */
    isThemeFont: function(font) {
      return (font && themeFontLang_[font]) ? true : false;
    },

    /** @returns {string} Font face associated with a fontRef. */
    getFontRefFontFace: function(font) {
      var fontFace;
      if (font && fontRefToThemeFont_[font]) {
        var themeFont = fontRefToThemeFont_[font];
        fontFace = getThemeFontFace_(themeFont);
      }
      return fontFace;
    }
  };

  function getThemeFontFace_(font) {
    var fontFace;
    if (api_.isThemeFont(font)) {
      var category = themeFontCategory_[font];
      var lang = themeFontLang_[font];

      // TODO(elqursh): This line fetches the font scheme for the *current*
      // theme as defined by 'PointModel.themeId'. Get rid of the use of
      // a global variable.
      var fontScheme = ThemeManager.getFontStyle();
      if (fontScheme && fontScheme[category] && fontScheme[category][lang]) {
        fontFace = fontScheme[category][lang];
      }
    }
    return fontFace;
  }

  return api_;
});
