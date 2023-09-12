// TODO(elqursh): This decorator *should* be converted to a polymer mixin.
// Since the table cells haven't been polymerized yet in point, it is written
// as an old-style decorator.
define([
  'qowtRoot/utils/fontManager',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/dcp/pointHandlers/textSpacingHandler'
], function(
  Fonts,
  ColorUtility,
  ThemeStyleRefManager,
  ThemeFontManager,
  TextSpacingHandler) {

  'use strict';

  var api_ = {
    decorate: function(elm, cellTextStyle) {
      if (cellTextStyle.bld === true) {
        elm.style.fontWeight = 'bold';
      } else if (cellTextStyle.bld === false) {
        elm.style.fontWeight = 'normal';
      }

      if (cellTextStyle.itl === true) {
        elm.style.fontStyle = 'italic';
      } else if (cellTextStyle.itl === false) {
        elm.style.fontStyle = 'normal';
      }

      if (cellTextStyle.udl === true) {
        elm.style.textDecoration = 'underline';
      } else if (cellTextStyle.udl === false) {
        elm.style.textDecoration = 'none';
      }

      // TODO(elqursh): This line spacing handler is actually storing a value
      // set by a different DCP handler. This is buggy as it depends on the
      // order by which handler are being called. Instead, investigate if
      // line height info should be cascaded by the entity that defines the
      // corresponding dcp property. For now keeping as it is to avoid rendering
      // regressions.
      elm.style.lineHeight = TextSpacingHandler.getLineSpacing();

      var fontRefStyle = ThemeStyleRefManager.
          getResolvedFontRefStyle(cellTextStyle);

      // Use explicit color or fall back to fontRefStyle color
      var color = cellTextStyle.color || (fontRefStyle && fontRefStyle.color);
      if (color) {
        var rgbaColor = ColorUtility.getColor(cellTextStyle.color);
        if (rgbaColor) {
          elm.style.color = rgbaColor;
        }
      }

      // Get font name to be used.
      var fontFace = cellTextStyle.font ? cellTextStyle.font.latin : undefined;
      // Fallback to fontRefStyle if font is not explicitly specified.
      // Table cells can either specify explicit fonts OR a fontRef.
      fontFace = fontFace || (fontRefStyle && fontRefStyle.font);

      // Map theme font names
      if (fontFace && ThemeFontManager.isThemeFont(fontFace)) {
        fontFace = ThemeFontManager.getThemeFontFace(fontFace);
      }

      if (fontFace) {
        elm.style.fontFamily = Fonts.family(fontFace);
      }
    }
  };

  return api_;
});
