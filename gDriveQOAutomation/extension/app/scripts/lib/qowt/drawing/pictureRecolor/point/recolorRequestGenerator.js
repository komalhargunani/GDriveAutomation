
define([
  'qowtRoot/drawing/pictureRecolor/recolorRequest',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointDuotoneEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointLuminanceEffect',
  'qowtRoot/drawing/pictureRecolor/effects/grayscaleEffect',
  'qowtRoot/drawing/pictureRecolor/point/effects/pointBiLevelEffect',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/utils/typeUtils'
], function(RecolorRequest,
            PointDuotoneEffect,
            PointLuminanceEffect,
            GrayscaleEffect,
            PointBiLevelEffect,
            ErrorCatcher,
            QowtSilentError,
            TypeUtils) {

  'use strict';

  /**
   * A generator that produces picture recolor request objects based
   * on Point's DCP data structure.
   *
   * The request object is then used by BlipEffectsApplier to process any
   * picture recoloring requests.
   *
   * @constructor
   */
  function RecolorRequestGenerator() {}

  RecolorRequestGenerator.prototype.constructor = RecolorRequestGenerator;

  /**
   * Generates a picture recolor request object for Point app using Point's
   * DCP data structure for blip effects.
   *
   * @param {Object} blipDcpData  Point's DCP data containing 'blip' element's
   *     response
   * @return {RecolorRequest | null} A PictureRecolorRequest instance. Null in
   * case when no effects are available in DCP Json or if there were any errors
   * in effect instances creation.
   */
  RecolorRequestGenerator.generate = function(blipDcpData) {
    var recolorRequest = null;

    try {
      if (blipDcpData && blipDcpData.effects) {
        if (!TypeUtils.isList(blipDcpData.effects)) {
          ErrorCatcher.handleError(new QowtSilentError(
              'RecolorRequestGenerator: Malformed DCP blip effects Json.'));
        } else {
          var effects = blipDcpData.effects,
              recolorEffect;

          recolorRequest = new RecolorRequest();

          effects.forEach(function(effect) {
            switch (effect.type) {
              // case string as used in Point's DCP response
              case 'duotone':
                recolorEffect = new PointDuotoneEffect(effect.color1,
                    effect.color2);
                recolorRequest.addEffect(recolorEffect);
                break;

              // case string as used in Point's DCP response
              case 'lum':
                // if brightness and contrast values aren't available or are
                // zero, then skip adding the effect
                if (effect.bright || effect.contrast) {
                  recolorEffect = new PointLuminanceEffect(effect.bright,
                      effect.contrast);
                  recolorRequest.addEffect(recolorEffect);
                }
                break;

              // case string as used in Point's DCP response
              case 'grayscl':
                recolorEffect = new GrayscaleEffect();
                recolorRequest.addEffect(recolorEffect);
                break;

              // case string as used in Point's DCP response
              case 'biLevel':
                recolorEffect = new PointBiLevelEffect(effect.thresh);
                recolorRequest.addEffect(recolorEffect);
                break;

              default:
                ErrorCatcher.handleError(new QowtSilentError(
                    'RecolorRequestGenerator: Unhandled recolor effect.'));
                break;
            }
          });
        }
      }
    } catch (ex) {
      ErrorCatcher.handleError(new QowtSilentError(
          'RecolorRequestGenerator: Error when creating recolor request ' +
              'instance.'));
      recolorRequest = null;
    }

    return recolorRequest;
  };

  return RecolorRequestGenerator;
});
