
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/utils/typeUtils'
], function(BaseRecolorEffect,
            QowtSilentError,
            ErrorCatcher,
            TypeUtils) {

  'use strict';

  /**
   * An effect implementation for brightness and contrast effects that increases
   * or reduces a color's contrast and or brightness by intensities in the range
   * of -100 to 100.
   *
   * @param {number} brightness  Brightness effect's intensity to be applied
   *     with. To be in the range of [-100, 100] (as required by effect's
   *     implementation here)
   * @param {number} contrast  Contrast effect's intensity to be applied
   *     with. To be in the range of [-100, 100] (as required by effect's
   *     implementation here)
   *
   * @constructor
   */
  var LuminanceEffect = function(brightness, contrast) {
    BaseRecolorEffect.call(this, EFFECT_NAME);

    this.bright = checkAndCapValues_(brightness);
    this.contrast = checkAndCapValues_(contrast);

    // to be initialized when pre-processing
    // Preprocessed values for contrast
    this.k = null;
    this.b = null;

    // Preprocessed values for brightness
    this.halfBrightness = null;
  };

  LuminanceEffect.prototype = Object.create(BaseRecolorEffect.prototype);
  LuminanceEffect.prototype.constructor = LuminanceEffect;

  /**
   * Applies luminance effect on the pixel color as per pre-processed values.
   * This takes care of applying brightness and/or contrast effects.
   *
   * Note - Alpha channel remain unaffected
   *
   * @param {Uint8ClampedArray} imageData  Base/pixel color in RGBA format to be
   *     applied with the effect
   *
   * @return {boolean} True if effect was processed/applied successfully or
   * false otherwise
   */
  LuminanceEffect.prototype.apply = function(imageData) {
    var returnValue = false;

    if (imageData && imageData.length) {
      if (!(imageData instanceof Uint8ClampedArray)) {
        ErrorCatcher.handleError(new QowtSilentError('LuminanceEffect: Image ' +
            'data isn\'t a Uint8ClampedArray. The result color channel values' +
            ' may be fractional and may spill off 0 - 255 value boundaries!'));
      }

      // Do processing for effects only when they have non-zero intensities
      if (this.bright || this.contrast) {
        preprocess_.call(this);

        var length = imageData.length;
        for (var pixelIndex = 0; pixelIndex < length; pixelIndex += 4) {
          // skip transparent pixel's processing
          if (imageData[pixelIndex + 3] === 0) {
            continue;
          }

          imageData[pixelIndex] = (imageData[pixelIndex] +
              this.halfBrightness) * this.k + this.b + this.halfBrightness;
          imageData[pixelIndex + 1] = (imageData[pixelIndex + 1] +
              this.halfBrightness) * this.k + this.b + this.halfBrightness;
          imageData[pixelIndex + 2] = (imageData[pixelIndex + 2] +
              this.halfBrightness) * this.k + this.b + this.halfBrightness;
        }
      }

      returnValue = true;
    }

    return returnValue;
  };

  // -------------------- PRIVATE ----------------------
  var EFFECT_NAME = 'luminance';

  /**
   * Effect constants
   * @const
   * @type {Number}
   * @private
   */
  var COLOR_CHANNEL_MAX = 255,
      MAX_RANGE_VALUE = 100,
      MIN_RANGE_VALUE = -100,
      SPECIFICATION_CONTRAST_MAX = 100,
      BROWSER_CONTRAST_MAX = 127;

  /**
   * A pre-processor for Luminance effect.
   * To be invoked in the scope of the this effect.
   *
   * @private
   */
  var preprocess_ = function() {
    var contrast = this.contrast,
        bright = this.bright,
        k = 1,
        b = 0;

    if (contrast) {
      // Convert from scale of [-100, 100] to [-127, 127]
      contrast = contrast * BROWSER_CONTRAST_MAX / SPECIFICATION_CONTRAST_MAX;
      if (contrast > 0) {
        k = COLOR_CHANNEL_MAX / (COLOR_CHANNEL_MAX - 2 * contrast);
        b = -k * contrast;
      } else {
        k = (COLOR_CHANNEL_MAX + 2 * contrast) / COLOR_CHANNEL_MAX;
        b = -contrast;
      }
    }
    this.k = k;
    this.b = b;

    if (bright) {
      // Convert from scale of [-100, 100] to [-255, 255]
      bright = bright * COLOR_CHANNEL_MAX / MAX_RANGE_VALUE;
    }
    this.halfBrightness = bright / 2;
  };

  /**
   * Checks and corrects the input value to a number if the value is passed as a
   * string. If the value is anything else, it resets it to zero.
   *
   * Also, it caps the value in the range of [-100, 100] if required
   *
   * @param {*} value  Value to be tested & corrected if required.
   *     Ideally it should be a number but does parsing if value is a string.
   *     For the rest, value is reset to zero.
   * @return {number} An integer in the value range of [-100, 100]
   *
   * @private
   */
  var checkAndCapValues_ = function(value) {
    /*
     Handle if values is unspecified or parse it from string to number if
     required. Reset it to zero if in case value isn't specified or parsing
     fails
     */
    if (!value) {
      value = 0;
    } else if (TypeUtils.isString(value)) {
      value = parseInt(value, 10);

      if (isNaN(value)) {
        value = 0;
      }
    }

    /*
     Do capping to bring the numerical value in the range of [-100, 100].
     If the value isn't a number, reset to zero.
     */
    if (TypeUtils.isNumber(value)) {
      value = Math.max(MIN_RANGE_VALUE, value);
      value = Math.min(MAX_RANGE_VALUE, value);
    } else {
      value = 0;
    }

    return value;
  };

  return LuminanceEffect;
});
