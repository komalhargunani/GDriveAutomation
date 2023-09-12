define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/drawing/color/presetColorMap',
  'qowtRoot/drawing/color/colorEffect',
  'qowtRoot/utils/converters/converter'
], function(
    DeprecatedUtils,
    PointModel,
    ThemeManager,
    PresetColorMap,
    ColorEffect,
    Converter) {

  'use strict';

  var _api;

  /**
   * [Point Specific] Returns the mapped color in given map
   * if the color is not present in map returns undefined
   *
   * @param colorMap {Map}color map
   * @param schemeColor {String}the color to be searched for in map
   * @return mapped color or undefined {String}
   */
  var _getMappedSchemeColor = function(colorMap, schemeColor) {
    if (colorMap && schemeColor) {
      for (var i = 0; i < colorMap.length; i++) {
        var colorTuple = colorMap[i];
        if (schemeColor === colorTuple.name) {
          return colorTuple.value;
        }
      }
      return undefined;
    }
  };

  /**
   * Returns the new color with all effects applied.
   *
   * @param color {String} color
   * @param effects {Array} effects to be applied on color
   * @return  {JSON} JSON color object containing color and alpha value
   */
  var _processColorEffects = function(color, effects) {
    return  ColorEffect.getARGBColor(color, effects);
  };

  /**
   *
   * Returns color in hex format. Returns srgbClr as it is and in case of scheme
   * color resolves it with thehelp of map to return a hex color value.
   *
   * @param colorJSON {JSON} color JSON.
   * @return {JSON} the color JSON with clr in hex format.
   */
  var _marshalColor = function(colorJSON) {
    if (colorJSON.type === 'srgbClr') {
      return colorJSON.clr;
    } else if (colorJSON.type === 'prstClr') {
      return _api.getHexEquivalentOfPresetColor(colorJSON.val);
    } else {
      return _api.getHexEquivalentOfSchemeColor(colorJSON.scheme);
    }
  };

  /**
   * Convert a Hex color string into an RGB array.
   *
   * @param color {String} color.
   * @param alpha {Number} alpha to be applied on color.
   * @return  RGBA values or undefined.
   */
  var _convertHexToArgbColor = function(color, alpha) {
    alpha = alpha === undefined ? 1 : alpha;
    var hexStr = color.substring(1, 7);

    var rgbVal = _convertHexToRgbColor(hexStr);

    return "rgba(" + rgbVal + "," + alpha + ")";
  };

  /**
   * Convert a Hex color string into an RGB array.
   *
   * @param hexStr {String} hex string to be processed.
   * @return rgbVal {Array} RGB values or undefined.
   */
  var _convertHexToRgbColor = function(hexStr) {
    var rgbVal;
    if (hexStr) {
      var hexVals;
      if (hexStr.length <= 4) {
        hexVals =
            DeprecatedUtils.regExpExec(DeprecatedUtils.RegExp.HEX3, hexStr);
      } else {
        hexVals =
            DeprecatedUtils.regExpExec(DeprecatedUtils.RegExp.HEX, hexStr);
      }
      if (hexVals && hexVals.length) {
        rgbVal =
            [parseInt(hexVals[1], 16),
             parseInt(hexVals[2], 16),
             parseInt(hexVals[3], 16)];
      }
    }
    return rgbVal;
  };

  /**
   * Converts an RGB color value to HSL. Conversion formula
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Array           The HSL representation
   */
  var _hexToHsl = function(color) {
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);

    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  };

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  var _hslToRgb = function(hsl) {
    var h = hsl[0];
    var s = hsl[1];
    var l = hsl[2];
    var r, g, b;

    function hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    }

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.ceil(r * 255), Math.ceil(g * 255), Math.ceil(b * 255)];
  };

  _api = {

    /**
     * [Point Specific] Returns the Hex equivalent of a preset color.
     *
     * @param presetColor {String} preset color  eg. black
     * @return  {String} Hex equivalent of the preset color
     */
    getHexEquivalentOfPresetColor: function(presetColor) {
      var rgbColorArr = PresetColorMap.getRgbEquivalentPresetColor(presetColor);
      if (rgbColorArr) {
        var hexColor =
            Converter.rgb2hex(rgbColorArr[0], rgbColorArr[1], rgbColorArr[2]);

        return hexColor;
      }
    },

    /**
     * [Point Specific] Returns the Hex equivalent of a scheme color.
     *
     * @param {String} schemeColor scheme color  eg. accent1
     * @param {String=} opt_level the level of cascading from which we want to
     *    fetch the color (can be master/layout/slide/undefined).
     *    In case of undefined, will default to 'slide'
     * @return  {String} Hex equivalent of the scheme color
     */
    getHexEquivalentOfSchemeColor: function(schemeColor, opt_level) {
      var themeColor = _api.getThemeEquivalentOfSchemeColor(schemeColor,
          opt_level);
      if (themeColor) {
        // go to theme color map
        var themeColorMap = ThemeManager.getColorTheme();
        return themeColorMap[themeColor];
      }
      else {
        return undefined;
      }
    },

    /**
     * [Point Specific] Returns the theme color mapped to the scheme color by
     * referring to the master, layout and slide color maps.
     *
     * @param {String} schemeColor scheme color
     * @param {String=} opt_level the level of cascading from which we want to
     *    fetch the color (can be master/layout/slide/undefined).
     *    In case of undefined, will default to 'slide'
     * @return {String} mappedSchemeColor mapped theme color
     */
    getThemeEquivalentOfSchemeColor: function(schemeColor, opt_level) {
      /**
       * algorithm:
       * 1. check if schemeColor is present in the cached colorMap for slide
       * 2. If not, check for schemeColor in the layouts cached color Map
       * 3. If not, check for schemeColor in the masters cached color Map
       * 4. If not, get fromm Theme the orig value
       * 5. If present at any of the above 4 levels/steps, pass the mapped value
       *    to the getHexColor function in theme handlers (cached color scheme)
       *    which will return the corresponding hex value
       *
       * steps:
       * 1. take the slide / slideLayout/ slideMaster color map
       *    (in order of precedence)
       * 2. from the finalMap, get the mapped value for the given scheme-color
       *    (eg : "accent1" : "accent2")
       * 3. once you get the mapped scheme color, get its hex value from the
       *    colorScheme which is changed in theme manager
       */

      //Devesh - TODO: Not able to support color in style-ref when given in a
      // format other than scheme color. Hence, falling back to "accent1", to
      // avoid crashes. Will be able to support this properly when we would
      // switch to caching apporach.
      if (!schemeColor) {
        schemeColor = "accent1";
      }

      var layoutMapOverride =
          (PointModel.slideLayoutMap[PointModel.SlideLayoutId] &&
              PointModel.slideLayoutMap[PointModel.SlideLayoutId].clrMap);

      var masterMapOverride =
          (PointModel.masterLayoutMap[PointModel.MasterSlideId] &&
              PointModel.masterLayoutMap[PointModel.MasterSlideId].clrMap);

      var resolvedColorMap;

      switch (opt_level) {
        case 'master':
          resolvedColorMap = masterMapOverride || undefined;
          break;
        case 'layout':
          resolvedColorMap = layoutMapOverride || masterMapOverride ||
              undefined;
          break;
        default:
          resolvedColorMap = PointModel.slideColorMap[PointModel.SlideId] ||
              layoutMapOverride || masterMapOverride || undefined;
          break;
      }
      var mappedSchemeColor =
          _getMappedSchemeColor(resolvedColorMap, schemeColor) || schemeColor;
      return mappedSchemeColor;
    },

    /**
     * handle luminosity of fillData color
     * @param fillDataColor {String} Color
     * @param context
     * @param fillPathAttribute (lighten / lightenLess / darken / darkenLess)
     * @return clr {String} color with luminosity
     */
    handleLuminosity: function(fillDataColor, context, fillPathAttribute) {
      context = context || '';
      var colorsArray =
          fillDataColor.substring(
              fillDataColor.indexOf('(') + 1,
              fillDataColor.lastIndexOf(')')).split(/,\s*/);

      var hexColor =
          Converter.rgb2hex(colorsArray[0], colorsArray[1], colorsArray[2]);

      var color = hexColor.substring(1, 7);
      var hsl = _hexToHsl(color);

      // Currently this threshold is random. We can tweak this if required.
      var threshold = 0.1;
      var clr;
      switch (fillPathAttribute) {
        case "lighten":
          hsl[2] += threshold * 2;
          // luminosity can not be more than 1.
          if (hsl[2] > 1) {
            hsl[2] = 1;
          }
          break;
        case "lightenLess":
          hsl[2] += threshold;
          if (hsl[2] > 1) {
            hsl[2] = 1;
          }
          break;
        case "darken":
          hsl[2] -= threshold * 2;
          // luminosity can not be less than 0.
          if (hsl[2] < 0) {
            hsl[2] = 0;
          }
          break;
        case "darkenLess":
          hsl[2] -= threshold;
          if (hsl[2] < 0) {
            hsl[2] = 0;
          }
          break;
        default:
          clr = _convertHexToRgbColor(color);
          clr = 'rgba(' + clr[0] + ',' + clr[1] + ',' + clr[2] + ',' +
                   colorsArray[3] + ')';
          break;
      }
      if (clr === undefined) {
        clr = _hslToRgb(hsl);
        clr = 'rgba(' + clr[0] + ',' + clr[1] + ',' + clr[2] + ',' +
                   colorsArray[3] + ')';
      }
      return clr;
    },

    /**
     * Returns the JSON object containing color and alpha value.
     *
     * @param colorObj {JSON}the object of color
     * @return colorJSON {JSON} JSON object containing color and alpha value
     */
    getColor: function(colorObj) {
      var hexColor = _marshalColor(colorObj);
      var colorJSON;

      if (hexColor) {
        var effects = colorObj.effects;
        colorJSON = _processColorEffects(hexColor, effects);
        return _convertHexToArgbColor(colorJSON.rgb, colorJSON.alpha);
      }
      return undefined;
    }
  };

  return _api;
});
