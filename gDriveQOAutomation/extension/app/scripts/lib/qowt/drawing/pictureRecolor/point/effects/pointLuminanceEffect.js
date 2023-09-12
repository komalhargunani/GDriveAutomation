
define([
  'qowtRoot/drawing/pictureRecolor/effects/luminanceEffect'
], function(LuminanceEffect) {

  'use strict';

  /**
   * Point's Luminance effect request object. Based on the general
   * 'luminance' object.
   *
   * In addition to base capabilities, it scales down input brightness and/or
   * contrast values from a range of [-100000, 100000] (as per Point's
   * specifications) to [-100, 100] (as expected by this effect's
   * implementation).
   *
   * @param {number} brightness  Brightness effect's intensity to be applied
   *     with. To be in the range of [-100000, 100000] (as per Point
   *     specifications)
   * @param {number} contrast  Contrast effect's intensity to be applied
   *     with. To be in the range of [-100000, 100000] (as per Point
   *     specifications)
   *
   * @constructor
   */
  var PointLuminanceEffect = function(brightness, contrast) {
    var rescaledBrightness, rescaledContrast;

    // rescale values to range of [-100, 100] which is as expected by the base
    rescaledBrightness = brightness ? brightness / 1000 : brightness;
    rescaledContrast = contrast ? contrast / 1000 : contrast;

    LuminanceEffect.call(this, rescaledBrightness, rescaledContrast);
  };

  PointLuminanceEffect.prototype = Object.create(LuminanceEffect.prototype);
  PointLuminanceEffect.prototype.constructor = PointLuminanceEffect;

  return PointLuminanceEffect;
});
