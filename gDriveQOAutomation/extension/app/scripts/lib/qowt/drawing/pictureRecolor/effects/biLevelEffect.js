
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  /**
   * An effect implementation for Bi-level effect.
   *
   * @param {number} thresh  Required. Intensity of the effect. Accepted range
   *     of values - [0, 100]. Should be an integer.
   *
   * @constructor
   */
  var BiLevelEffect = function(thresh) {
    BaseRecolorEffect.call(this, EFFECT_NAME);

    if (thresh === undefined || thresh === null) {
      thresh = DEFAULT_THRESHOLD;  // default, if undefined
    }

    // Cap values to bring it in the range of [0, 100]
    thresh = Math.max(0, thresh);
    thresh = Math.min(100, thresh);

    // extrapolate from a scale of [0..100] to [0..255]
    this.thresh = thresh * 255 / 100;
  };

  BiLevelEffect.prototype = Object.create(BaseRecolorEffect.prototype);
  BiLevelEffect.prototype.constructor = BiLevelEffect;

  /**
   * Applies BiLevel effect to the passed pixel color. Calculates pixel's
   * luminance using BT.709 algorithm.
   *
   * Note - Alpha channel remain unaffected
   *
   * @param {Uint8ClampedArray} imageData  Base/pixel color in RGBA format to be
   *     applied with the effect
   *
   * @return {boolean} True if effect was processed/applied successfully or
   * false otherwise
   */
  BiLevelEffect.prototype.apply = function(imageData) {
    var returnValue = false;

    if (imageData && imageData.length) {
      if (!(imageData instanceof Uint8ClampedArray)) {
        ErrorCatcher.handleError(new QowtSilentError('BiLevelEffect: Image ' +
            'data isn\'t a Uint8ClampedArray. The result color channel values' +
            ' may be fractional and may spill off 0 - 255 value boundaries!'));
      }

      var length = imageData.length;
      for (var pixelIndex = 0; pixelIndex < length; pixelIndex += 4) {
        // skip transparent pixel's processing
        if (imageData[pixelIndex + 3] === 0) {
          continue;
        }

        /* Grayscale co-efficients as per original ITU-R recommendation (BT.709)
           Red: 0.2125
           Green: 0.7154
           Blue: 0.0721

           References:
           http://msdn.microsoft.com/en-us/library/windows/desktop/bb174148.aspx
           http://msdn.microsoft.com/en-us/library/windows/desktop/bb530104.aspx
         */
        imageData[pixelIndex] = imageData[pixelIndex + 1] =
            imageData[pixelIndex + 2] = ((imageData[pixelIndex] * 0.2125 +
                imageData[pixelIndex + 1] * 0.7154 + imageData[pixelIndex + 2] *
                0.0721) >= this.thresh) ? 255 : 0;
      }

      returnValue = true;
    }

    return returnValue;
  };

  // -------------------- PRIVATE ----------------------
  var EFFECT_NAME = 'biLevel',
      DEFAULT_THRESHOLD = 50;

  return BiLevelEffect;
});
