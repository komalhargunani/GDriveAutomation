
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'
], function(BaseRecolorEffect,
            QowtSilentError,
            ErrorCatcher) {

  'use strict';

  /**
   * An effect implementation for grayscale effect.
   *
   * @constructor
   */
  var GrayscaleEffect = function() {
    BaseRecolorEffect.call(this, EFFECT_NAME);
  };

  GrayscaleEffect.prototype = Object.create(BaseRecolorEffect.prototype);
  GrayscaleEffect.prototype.constructor = GrayscaleEffect;

  /**
   * Applies Grayscale effect to the passed pixel color as per BT.709 algorithm
   *
   * Note - Alpha channel remain unaffected
   *
   * @param {Uint8ClampedArray} imageData  Base/pixel color in RGBA format to be
   *     applied with the effect
   *
   * @return {boolean} True if effect was processed/applied successfully or
   * false otherwise
   */
  GrayscaleEffect.prototype.apply = function(imageData) {
    var returnValue = false;

    if (imageData && imageData.length) {
      if (!(imageData instanceof Uint8ClampedArray)) {
        ErrorCatcher.handleError(new QowtSilentError('GrayscaleEffect: Image ' +
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
            imageData[pixelIndex + 2] = imageData[pixelIndex] * 0.2125 +
                imageData[pixelIndex + 1] * 0.7154 + imageData[pixelIndex + 2] *
                0.0721;
      }

      returnValue = true;
    }

    return returnValue;
  };

  // -------------------- PRIVATE ----------------------
  var EFFECT_NAME = 'grayscale';

  return GrayscaleEffect;
});
