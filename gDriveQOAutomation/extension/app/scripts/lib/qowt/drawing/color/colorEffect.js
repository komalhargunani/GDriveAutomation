define([
  'qowtRoot/utils/converters/converter'], function(
  Converter) {

  'use strict';

  var _kEps = 0.000000001;
  var _kRED_SHIFT = 16;
  var _kRED_MASK_IN = 0x00FF0000;
  var _kGREEN_SHIFT = 8;
  var _kGREEN_MASK_IN = 0x0000FF00;
  var _kBLUE_MASK_IN = 0x000000FF;
  var _kPercentageColorPercentGraduation = 1000;
  var _kPercentageColorMaxPercent = 100 * _kPercentageColorPercentGraduation;
  var _kPercentageColorDegreeGraduation = 60000;
  var _kPercentageColorMaxDegree = 360 * _kPercentageColorDegreeGraduation;
  var _kgammaCorrectionFlag =
  {
    EGammaCompress: true,
    EGammaExpand: false
  };

  var _api;

  _api = {

    /*
     * This method takes the provided value and applies all color effects,
     * in order, on the specified color returning the new color value to be
     * used.
     *
     * @param rgbColor {String} The color in RGB format (0xRRGGBB)
     * @param effects {Array} The color effects to be applied.
     *
     * @return colorJSON {JSON} New color in ARGB that has had all color effects
     * applied.
     */
    getARGBColor: function(rgbColor, effects) {
      var srcColor = {
        A: 0xff,
        R: 0,
        G: 0,
        B: 0
      };

      //convert the hex color to decimal integer.
      if (rgbColor.substring(0, 1) === '#') {
        rgbColor = rgbColor.substring(1, rgbColor.length);
      }
      rgbColor = parseInt(rgbColor, 16); //converting hex value to decimal


      srcColor.R = _util._red(rgbColor);
      srcColor.G = _util._green(rgbColor);
      srcColor.B = _util._blue(rgbColor);

      var argbColor =
          _util._expandGamma(srcColor, _kgammaCorrectionFlag.EGammaExpand);

      if (effects !== undefined) {
        for (var i = 0; i < effects.length; i++) {
          argbColor = _util._evaluate(argbColor, effects[i]);
        }
      }

      argbColor =
          _util._compressGamma(argbColor, _kgammaCorrectionFlag.EGammaCompress);
      var alpha = _util._getAlpha(argbColor.A);
      argbColor = Converter.rgb2hex(argbColor.R, argbColor.G, argbColor.B);

      var colorJSON = {
        rgb: argbColor,
        alpha: alpha
      };
      return colorJSON;
    }
  };

  /**
   * Maps the color to the effect.
   */
  var _rgbtoEffectMap = {
    blue: 'B',

    blueMod: 'B',

    blueOff: 'B',

    red: 'R',

    redMod: 'R',

    redOff: 'R',

    green: 'G',

    greenMod: 'G',

    greenOff: 'G'
  };

  var _util = {

    /*
     * This method returns the color provided unchanged after applying all
     * effects specified.
     *
     * @param argbColor The color in ARGB format (0xAARRGGBB)
     * @param effect The color effect to be applied.
     * @return colorTransformVal New color formed,in decimal(base 10) integer
     * format, after applying color effect
     */
    _evaluate: function(argbColor, effect) {
      var colorTransformVal =
          _effectEvaluator[effect.name](argbColor, effect.value, effect.name);
      return colorTransformVal;
    },

    /**
     * Apply gamma expansion to the argbColor.
     *
     * @param src color in ARGB format
     * @param gamma expansion
     * @return gamma expanded color in ARGB format
     */
    _expandGamma: function(src, gamma) {
      var dest = {
        A: 0xff,
        R: 0,
        G: 0,
        B: 0
      };
      dest.A = Converter.rgb2percentageRgb(src.A);
      dest.R = Converter.rgb2percentageRgb(src.R);
      dest.G = Converter.rgb2percentageRgb(src.G);
      dest.B = Converter.rgb2percentageRgb(src.B);

      return _effectEvaluateUtil._applyGammaToRGB(dest, gamma);
    },

    /*
     * Helper to retrieve the red component of the specified ARGB color.
     *
     * @param argbColor ARGB color value to retrieve the component.
     * @return int with all color components besides red masked out.
     */
    _red: function(argbColor) {
      return ( (argbColor & _kRED_MASK_IN) >> _kRED_SHIFT );
    },

    /*
     * Helper to retrieve the green component of the specified ARGB color.
     *
     * @param argbColor ARGB color value to retrieve the component.
     * @return int with all color components besides green masked out.
     */
    _green: function(argbColor) {
      return ((argbColor & _kGREEN_MASK_IN) >> _kGREEN_SHIFT);
    },

    /*
     * Helper to retrieve the blue component of the specified ARGB color.
     *
     * @param argbColor ARGB color value to retrieve the component.
     * @return int with all color components besides blue masked out.
     */
    _blue: function(argbColor) {
      return (argbColor & _kBLUE_MASK_IN);
    },

    /**
     * Apply gamma compression to the argbColor.
     *
     * @param src color in ARGB format
     * @param gamma compression
     * @retunr dest gamma compressed color in ARGB format.
     */
    _compressGamma: function(src, gamma) {
      var dest = {
        A: 0xff,
        R: 0,
        G: 0,
        B: 0
      };

      var tmp = _effectEvaluateUtil._applyGammaToRGB(src, gamma);

      dest.A = Converter.percentageRgb2rgb(tmp.A);
      dest.R = Converter.percentageRgb2rgb(tmp.R);
      dest.G = Converter.percentageRgb2rgb(tmp.G);
      dest.B = Converter.percentageRgb2rgb(tmp.B);
      return dest;
    },

    /**
     * Returns the alpha component of the color.
     *
     * @param alphaComponent alpha component
     */
    _getAlpha: function(alphaComponent) {
      return alphaComponent / 255;
    }

  };

  var _effectEvaluateUtil = {
    /**
     * Applies the gamma compression / expansion to A,R,G,B components.
     *
     * @param src color in ARGB format
     * @param compress {boolean} flag indicating compression/expansion
     * @return gamma expanded/compressed color in ARGB format
     */
    _applyGammaToRGB: function(src, compress) {
      var dest = {};
      dest.A = src.A;
      dest.R = _effectEvaluateUtil._gammaTosRGB(src.R, compress);
      dest.G = _effectEvaluateUtil._gammaTosRGB(src.G, compress);
      dest.B = _effectEvaluateUtil._gammaTosRGB(src.B, compress);
      return dest;
    },

    /**
     * Takes a single color component and performs compression/expansion on it.
     *
     * @param component R/G/B color component
     * @param compress flag indicating compression/expansion
     * @return gamma expanded color component
     */
    _gammaTosRGB: function(component, compress) {
      var Section = 0.00304;
      var LowMul = 12.92;
      var HiMul = 1.055;
      var HiAdd = -0.055;
      var DecApproxGamma = 2.4;
      var EncApproxGamma = 1.0 / DecApproxGamma;

      var d = component / _kPercentageColorMaxPercent;

      if (compress) {
        if (d <= Section) {
          d *= LowMul;
        }
        else {
          d = HiMul * Math.pow(d, EncApproxGamma) + HiAdd;
        }
      }
      else {
        if (d <= Section * LowMul) {
          d /= LowMul;
        }
        else {
          d = Math.pow((d - HiAdd) / HiMul, DecApproxGamma);
        }
      }

      return (d * _kPercentageColorMaxPercent + 0.5);
    },

    /**
     * Applies modulation effect to a color component.
     *
     * @param orgVal original R/G/B component value
     * @param modVal the value of mod effect
     * @return modulated value of the component
     */
    _transformMod: function(orgVal, modVal) {
      return _effectEvaluateUtil.
          _getLimitedValue(
          orgVal * parseInt(modVal, 10) / _kPercentageColorMaxPercent, 0,
          _kPercentageColorMaxPercent);
    },

    /**
     * Applies offset effect to a color component.
     *
     * @param orgVal original R/G/B component value
     * @param offVal the value of *off* effect
     * @return value of the component with offset applied
     */
    _transformOff: function(orgVal, offVal) {
      return _effectEvaluateUtil.
          _getLimitedValue(orgVal + parseInt(offVal, 10), 0,
          _kPercentageColorMaxPercent);
    },

    /**
     * Returns the mean value of the three input values.
     *
     * @param nValue Value of the component.
     * @param nMin Minimum value it can possess.
     * @param nMax Maximum value it can possess.
     */
    _getLimitedValue: function(nValue, nMin, nMax) {
      return (Math.min(Math.max(nValue, nMin), nMax));
    },

    /**
     * Applies compression to the src color
     * @param src ARGB color
     * @param gamma indicates compression/expansion
     */
    _hueCompression: function(src, gamma) {
      var tmp = _effectEvaluateUtil._applyGammaToRGB(src, gamma);

      var fR = tmp.R / _kPercentageColorMaxPercent;  // red [0.0, 1.0]
      var fG = tmp.G / _kPercentageColorMaxPercent;  // green [0.0, 1.0]
      var fB = tmp.B / _kPercentageColorMaxPercent;  // blue [0.0, 1.0]
      var fMin = Math.min(Math.min(fR, fG), fB);
      var fMax = Math.max(Math.max(fR, fG), fB);
      var fD = fMax - fMin;

      var dest = {};
      // hue: 0deg = red, 120deg = green, 240deg = blue
      if (_effectEvaluateUtil._isSmall(fD)) {         // black/gray/white
        dest.h = 0;
      }
      else if (fMax === fR) {  // magenta...red...yellow
        dest.h = parseInt((((fG - fB) / fD * 60.0 + 360.0) *
                  _kPercentageColorDegreeGraduation + 0.5 ) %
                    _kPercentageColorMaxDegree, 10);
      }
      else if (fMax === fG) {  // yellow...green...cyan
        dest.h = parseInt(((fB - fR) / fD * 60.0 + 120.0) *
                    _kPercentageColorDegreeGraduation + 0.5, 10);
      }
      else {              // cyan...blue...magenta
        dest.h = parseInt(((fR - fG) / fD * 60.0 + 240.0) *
                    _kPercentageColorDegreeGraduation + 0.5, 10);
      }

      // luminance: 0% = black, 50% = full color, 100% = white
      dest.l = parseInt((fMin + fMax) / 2.0 *
          _kPercentageColorMaxPercent + 0.5, 10);

      // saturation: 0% = gray, 100% = full color
      if (dest.l === 0 || dest.l === _kPercentageColorMaxPercent) {
      // black/white
        dest.s = 0;
      }
      else if (dest.l <= 50 * _kPercentageColorPercentGraduation) {
      // dark...full color
        dest.s = parseInt(fD / (fMin + fMax) *
            _kPercentageColorMaxPercent + 0.5, 10);
      }
      else {                    // full color...light
        dest.s = parseInt(fD / (2.0 - fMax - fMin) *
            _kPercentageColorMaxPercent + 0.5, 10);
      }

      dest.A = tmp.A;
      return dest;
    },

    _isSmall: function(d) {
      return Math.abs(d) < _kEps;
    },

    /**
     * Applies expansion to the src color
     * @param src ARGB color
     * @param gamma indicates compression/expansion
     */
    _hueExpansion: function(src, gamma) {
      var fR = 0.0, fG = 0.0, fB = 0.0;

      if (src.s === 0 || src.l === _kPercentageColorMaxPercent) {
        fR = fG = fB = src.l / _kPercentageColorMaxPercent;
      }
      else if (src.l > 0) {
        // base color from hue
        var fHue = src.h / _kPercentageColorMaxDegree * 6.0;

        // interval [0.0, 6.0)
        if (fHue <= 1.0) {
          fR = 1.0;
          fG = fHue;
        }        // red...yellow
        else if (fHue <= 2.0) {
          fR = 2.0 - fHue;
          fG = 1.0;
        }  // yellow...green
        else if (fHue <= 3.0) {
          fG = 1.0;
          fB = fHue - 2.0;
        }  // green...cyan
        else if (fHue <= 4.0) {
          fG = 4.0 - fHue;
          fB = 1.0;
        }  // cyan...blue
        else if (fHue <= 5.0) {
          fR = fHue - 4.0;
          fB = 1.0;
        }  // blue...magenta
        else {
          fR = 1.0;
          fB = 6.0 - fHue;
        }  // magenta...red

        // apply saturation
        var fSat = src.s / _kPercentageColorMaxPercent;
        fR = (fR - 0.5) * fSat + 0.5;
        fG = (fG - 0.5) * fSat + 0.5;
        fB = (fB - 0.5) * fSat + 0.5;

        // apply luminance
        var fLum = 2.0 * src.l / _kPercentageColorMaxPercent - 1.0;
        // interval [-1.0, 1.0]
        if (fLum < 0.0) {
          var fShade = fLum + 1.0; // interval [0.0, 1.0] (black...full color)
          fR *= fShade;
          fG *= fShade;
          fB *= fShade;
        }
        else if (fLum > 0.0) {
          var fTint = 1.0 - fLum;  // interval [0.0, 1.0] (white...full color)
          fR = 1.0 - ((1.0 - fR) * fTint);
          fG = 1.0 - ((1.0 - fG) * fTint);
          fB = 1.0 - ((1.0 - fB) * fTint);
        }
      }

      var dest = {};
      dest.R = parseInt((fR * _kPercentageColorMaxPercent + 0.5), 10);
      dest.G = parseInt((fG * _kPercentageColorMaxPercent + 0.5), 10);
      dest.B = parseInt((fB * _kPercentageColorMaxPercent + 0.5), 10);
      dest.A = src.A;

      return _effectEvaluateUtil._applyGammaToRGB(dest, gamma);
    },

    /**
     * Validates saturation effect if luminance changes.
     *
     * @param color color in HSL format
     * @return color color in HSL format with saturation adjusted.
     */
    _validateSat: function(color) {
      // if color changes to black or white, it will stay gray if luminance
      // changes again
      if (color.l === 0 || color.l === _kPercentageColorMaxPercent) {
        color.s = 0;
      }
      return color;
    }

  };

  var _evaluteEffects = {

    /*
     * This element specifies its input color with the specific opacity, but
     * with its color unchanged.
     *
     * @param argbColor color in ARGB format
     * @param value value of alpha
     * @return argbColor with alpha applied.
     */
    _alpha: function(argbColor, value) {
      argbColor.A = value;
      return argbColor;
    },

    /*
     * This element specifies a more or less opaque version of its input color.
     * An alpha modulate never increases the alpha beyond 100%. A 200% alpha
     * modulate makes a input color twice as opaque as before. A 50% alpha
     * modulate makes a input color half as opaque as before.
     *
     * @param argbColor color in ARGB format
     * @param value value of alpha mod
     * @return argbColor with alpha mod applied.
     */
    _alphaMod: function(argbColor, value) {
      argbColor.A = _effectEvaluateUtil._transformMod(argbColor.A, value);
      return argbColor;
    },

    /*
     * This element specifies a more or less opaque version of its input color.
     * Increases or decreases the input alpha percentage by the specified
     * percentage offset. A 10% alpha offset increases a 50% opacity to 60%.
     * A -10% alpha offset decreases a 50% opacity to 40%. The transformed alpha
     * values are limited to a range of 0 to 100%. A 10% alpha offset increase
     * to a 100% opaque object still results in 100% opacity.
     *
     * @param argbColor color in ARGB format
     * @param value value of alpha off
     * @return argbColor with alpha off applied.
     */
    _alphaOff: function(argbColor, value) {
      argbColor.A = _effectEvaluateUtil._transformOff(argbColor.A, value);
      return argbColor;
    },
    /*
     * This element specifies the input color with the specific blue component,
     * but with the red and green color components unchanged.
     *
     * @param argbColor The color in ARGB format (0xAARRGGBB)
     * @param value Value of effect to be applied.
     * @param effectName Name of effect to be applied
     * @return Color with effect applied in ARGB format (0xAARRGGBB)
     */
    _rgb: function(argbColor, value, effectName) {
      argbColor[_rgbtoEffectMap[effectName]] = value;
      return argbColor;
    },

    /*
     * This element specifies the input color with its blue component modulated
     * by the given percentage. A 50% blue modulate reduces the blue component
     * by half. A 200% blue modulate doubles the blue component.
     *
     * @param argbColor The color in ARGB format (0xAARRGGBB)
     * @param value Value of effect to be applied.
     * @param effectName Name of effect to be applied
     * @return Color with effect applied in ARGB format (0xAARRGGBB)
     */
    _rgbMod: function(argbColor, value, effectName) {
      var blueEffect =
          _effectEvaluateUtil.
              _transformMod(argbColor[_rgbtoEffectMap[effectName]], value);
      argbColor[_rgbtoEffectMap[effectName]] = blueEffect;
      return argbColor;
    },

    /*
     * This element specifies the input color with its blue component shifted,
     * but with its red and green color components unchanged.
     *
     * @param argbColor The color in ARGB format (0xAARRGGBB)
     * @param value Value of effect to be applied.
     * @param effectName Name of effect to be applied
     * @return Color with effect applied in ARGB format (0xAARRGGBB)
     */
    _rgbOff: function(argbColor, value, effectName) {
      var blueEffect =
          _effectEvaluateUtil.
              _transformOff(argbColor[_rgbtoEffectMap[effectName]], value);
      argbColor[_rgbtoEffectMap[effectName]] = blueEffect;
      return argbColor;
    },

    /*
     * This element specifies the input color with the specified hue, but with
     * its saturation and luminance unchanged.
     *
     * @param argbColor The color in ARGB format (0xAARRGGBB)
     * @param value Value of Hue effect.
     * @return color Color in ARGB format with hue effect applied.
     */
    _hue: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.h = value;

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);
      return color;
    },
    /*
     * This element specifies the input color with its hue modulated by the
     * given percentage. A 50% hue modulate decreases the angular hue value by
     * half. A 200% hue modulate vars the angular hue value.
     *
     * @param argbColor color in ARGB format
     * @param value value of hue mod
     * @return color with hue mod applied.
     */
    _hueMod: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.h =
          _effectEvaluateUtil.
              _getLimitedValue(
              tmp.h * value / _kPercentageColorMaxPercent, 0,
              _kPercentageColorMaxDegree);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);
      return color;
    },

    /*
     * This element specifies the input color with its hue shifted, but with its
     * saturation and luminance unchanged.
     *
     * @param argbColor color in ARGB format
     * @param value value of hue off
     * @return color with hue off applied.
     */
    _hueOff: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.h =
          _effectEvaluateUtil.
              _getLimitedValue(tmp.h + value, 0, _kPercentageColorMaxDegree);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },

    /*
     * This element specifies the input color with the specified luminance,
     * but with its hue and saturation unchanged. Typically luminance values
     * fall in the range [0%, 100%].
     *
     * @param argbColor color in ARGB format
     * @param value value of lum
     * @return color with lum applied.
     */
    _lum: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.l = value;
      tmp = _effectEvaluateUtil._validateSat(tmp);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },
    /*
     * This element specifies the input color with its luminance modulated by
     * the given percentage. A 50% luminance modulate reduces the luminance by
     * half. A 200% luminance modulate doubles the luminance.
     *
     * @param argbColor color in ARGB format
     * @param value value of lum mod
     * @return color with lum mod applied.
     */
    _lumMod: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.l = _effectEvaluateUtil._transformMod(tmp.l, value);
      tmp = _effectEvaluateUtil._validateSat(tmp);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },

    /*
     * This element specifies the input color with its luminance shifted, but
     * with its hue and saturation unchanged.
     *
     * @param argbColor color in ARGB format
     * @param value value of lum off
     * @return color with lum off applied.
     */
    _lumOff: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.l = _effectEvaluateUtil._transformOff(tmp.l, value);
      tmp = _effectEvaluateUtil._validateSat(tmp);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },
    /*
     * This element specifies the input color with the specified saturation, but
     * with its hue and luminance unchanged. Typically saturation values fall in
     * the range [0%, 100%].
     *
     *
     * @param argbColor color in ARGB format
     * @param value value of sat
     * @return color with sat applied.
     */
    _sat: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.s = value;

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },

    /*
     * This element specifies the input color with its saturation modulated by
     * the given percentage. A 50% saturation modulate reduces the saturation by
     * half. A 200% saturation modulate doubles the saturation.
     *
     *
     * @param argbColor color in ARGB format
     * @param value value of sat mod
     * @return color with hue sat applied.
     */
    _satMod: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.s = _effectEvaluateUtil._transformMod(tmp.s, value);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },

    /*
     * This element specifies the input color with its saturation shifted, but
     * with its hue and luminance unchanged. A 10% offset to 20% saturation
     * yields 30% saturation.
     *
     * @param argbColor color in ARGB format
     * @param value value of sat off
     * @return color with sat off applied.
     */
    _satOff: function(argbColor, value) {
      var tmp =
          _effectEvaluateUtil.
              _hueCompression(argbColor, _kgammaCorrectionFlag.EGammaCompress);

      tmp.s = _effectEvaluateUtil._transformOff(tmp.s, value);

      var color =
          _effectEvaluateUtil.
              _hueExpansion(tmp, _kgammaCorrectionFlag.EGammaExpand);

      return color;
    },
    /*
     * This element specifies a darker version of its input color. A 10% shade
     * is 10% of the input color combined with 90% black.
     *
     *
     * @param argbColor color in ARGB format
     * @param value value of shade
     * @return argbColor with shade applied.
     */
    _shade: function(argbColor, value) {
      if (0 <= value && value <= _kPercentageColorMaxPercent) {
        var fFactor = value / _kPercentageColorMaxPercent;
        argbColor.R = argbColor.R * fFactor;
        argbColor.G = argbColor.G * fFactor;
        argbColor.B = argbColor.B * fFactor;
      }
      return argbColor;
    },

    /*
     * This element specifies a lighter version of its input color. A 10% tint
     * is 10% of the input color combined with 90% white.
     *
     * @param argbColor color in ARGB format
     * @param value value of tint
     * @return argbColor with tint applied.
     */
    _tint: function(argbColor, value) {
      /* This element specifies a lighter version of its input color. A 10% tint
       is 10% of the input color combined with 90% white. */
      if (0 <= value && value <= _kPercentageColorMaxPercent) {
        var fFactor = value / _kPercentageColorMaxPercent;
        argbColor.R =
            parseInt(
                (_kPercentageColorMaxPercent -
                    (_kPercentageColorMaxPercent - argbColor.R) * fFactor), 10);
        argbColor.G =
            parseInt(
                (_kPercentageColorMaxPercent -
                    (_kPercentageColorMaxPercent - argbColor.G) * fFactor), 10);
        argbColor.B =
            parseInt(
                (_kPercentageColorMaxPercent -
                    (_kPercentageColorMaxPercent - argbColor.B) * fFactor), 10);
      }
      return argbColor;
    }

  };

  var _effectEvaluator = {

    alpha: _evaluteEffects._alpha,

    alphaMod: _evaluteEffects._alphaMod,

    alphaOff: _evaluteEffects._alphaOff,

    blue: _evaluteEffects._rgb,

    blueMod: _evaluteEffects._rgbMod,

    blueOff: _evaluteEffects._rgbOff,

    red: _evaluteEffects._rgb,

    redMod: _evaluteEffects._rgbMod,

    redOff: _evaluteEffects._rgbOff,

    green: _evaluteEffects._rgb,

    greenMod: _evaluteEffects._rgbMod,

    greenOff: _evaluteEffects._rgbOff,

    hue: _evaluteEffects._hue,

    hueMod: _evaluteEffects._hueMod,

    hueOff: _evaluteEffects._hueOff,

    lum: _evaluteEffects._lum,

    lumMod: _evaluteEffects._lumMod,

    lumOff: _evaluteEffects._lumOff,

    sat: _evaluteEffects._sat,

    satMod: _evaluteEffects._satMod,

    satOff: _evaluteEffects._satOff,

    shade: _evaluteEffects._shade,

    tint: _evaluteEffects._tint
  };

  return _api;
});
