
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/drawing/pictureRecolor/color',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            Color,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  /**
   * An effect implementation that applies duotone effect using two colors.
   *
   * @param {string} firstColor  Color in "rgba(<R>, <G>, <B>, <A>)" formatted
   *     string.
   * @param {string} secondColor  Color in "rgba(<R>, <G>, <B>, <A>)" formatted
   *     string.
   *
   * @constructor
   */
  var DuotoneEffect = function(firstColor, secondColor) {
    BaseRecolorEffect.call(this, EFFECT_NAME);

    this.firstColor = new Color(firstColor);
    this.secondColor = new Color(secondColor);

    // to be initialized when pre-processed
    this.computedColor = null;
  };

  DuotoneEffect.prototype = Object.create(BaseRecolorEffect.prototype);
  DuotoneEffect.prototype.constructor = DuotoneEffect;

  /**
   * Applies Duotone effect on the supplied base color.
   *
   * Note - Alpha channel remain unaffected
   *
   * @param {Uint8ClampedArray} imageData  Base/pixel color in RGBA format to be
   *     applied with the effect
   *
   * @return {boolean} True if effect was processed/applied successfully or
   * false otherwise
   */
  DuotoneEffect.prototype.apply = function(imageData) {
    var returnValue = false;

    // Proceed only if there is valid pixel data and duotone constituent colors
    // aren't empty
    if (imageData && imageData.length && !this.firstColor.isEmpty() &&
        !this.secondColor.isEmpty()) {
      if (!(imageData instanceof Uint8ClampedArray)) {
        ErrorCatcher.handleError(new QowtSilentError('DuotoneEffect: Image ' +
            'data isn\'t a Uint8ClampedArray. The result color channel values' +
            ' may be fractional and may spill off 0 - 255 value boundaries!'));
      }

      preprocess_.call(this);

      var length = imageData.length,
          y;
      for (var pixelIndex = 0; pixelIndex < length; pixelIndex += 4) {
        // skip transparent pixel's processing
        if (imageData[pixelIndex + 3] === 0) {
          continue;
        }

        /*
          Do grayscaling first as it's pre-requisite for duotone effect
          Grayscale co-efficients as per original ITU-R recommendation (BT.709)
          Red: 0.2125
          Green: 0.7154
          Blue: 0.0721

          References:
          http://msdn.microsoft.com/en-us/library/windows/desktop/bb174148.aspx
          http://msdn.microsoft.com/en-us/library/windows/desktop/bb530104.aspx
        */
        y = imageData[pixelIndex] * 0.2125 + imageData[pixelIndex + 1] *
            0.7154 + imageData[pixelIndex + 2] * 0.0721;

        // Linearly interpolate color1 and computed color2 on
        // grayscaled-baseColor ('y')
        imageData[pixelIndex] = this.firstColor.R - (y *
            this.computedColor.R);
        imageData[pixelIndex + 1] = this.firstColor.G - (y *
            this.computedColor.G);
        imageData[pixelIndex + 2] = this.firstColor.B - (y *
            this.computedColor.B);
      }
      returnValue = true;
    }

    return returnValue;
  };

  // -------------------- PRIVATE ----------------------
  var EFFECT_NAME = 'duotone';

  /**
   * Effect constant(s)
   * @const
   * @type {Number}
   * @private
   */
  var COLOR_CHANNEL_MAX = 255;

  /**
   * A pre-processor for Duotone effect
   *
   * @private
   */
  var preprocess_ = function() {
    var color1 = this.firstColor,
        color2 = this.secondColor;

    var computedColor = new Color();
    computedColor.R = (color1.R - color2.R) / COLOR_CHANNEL_MAX;
    computedColor.G = (color1.G - color2.G) / COLOR_CHANNEL_MAX;
    computedColor.B = (color1.B - color2.B) / COLOR_CHANNEL_MAX;

    // Persist for later
    this.computedColor = computedColor;
  };

  return DuotoneEffect;
});
