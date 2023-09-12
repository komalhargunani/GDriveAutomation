
define([
  'qowtRoot/drawing/pictureRecolor/effects/baseRecolorEffect',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/qowtException'
], function(BaseRecolorEffect,
            ErrorCatcher,
            QowtSilentError,
            QowtException) {

  'use strict';

  /**
   * A recolor request object that stores all applicable effects information and
   * is used by recoloring utilities to render the effects.
   *
   * The effects that can be added in this collection should be of type
   * 'BaseRecolorEffect'.
   *
   * This request object abstracts away the variations in DCP responses of
   * various applications for effects and thus helps in seamlessly using effect
   * applier utilities.
   *
   * @constructor
   */
  var RecolorRequest = function() {
    var effects = [];

    /**
     * Public getter to all the contained effects in the request.
     *
     * @return {Array.<RecolorEffect>}
     */
    this.getAllEffects = function() {
      return effects;
    };

    /**
     * Adds an effect to the list of effects list in the request.
     *
     * @param {RecolorEffect} effect  Effect that is to be appended to the
     *     request.
     */
    this.addEffect = function(effect) {
      if (effect instanceof BaseRecolorEffect) {
        effects.push(effect);
      } else {
        ErrorCatcher.handleError(new QowtException('RecolorRequest: Ignoring ' +
            'addition of unknown effect to recolor request instance.'));
      }
    };
  };

  RecolorRequest.prototype.constructor = RecolorRequest;

  /**
   * Checks if this request has any available effects that can be
   * applied
   *
   * @return {boolean}  True if effects are available, otherwise false
   */
  RecolorRequest.prototype.hasRecoloringEffects = function() {
    var effectsData = this.getAllEffects();

    return effectsData && effectsData.length > 0;
  };

  /**
   * Applies all the contained effects on the image data.
   *
   * Only apply when there are effects populated in recolorRequest and each
   * individual effect's data is completely populated. Test before invoking this
   * using 'canApply' method to avoid warnings.
   *
   * @param {Uint8ClampedArray} imageData
   */
  RecolorRequest.prototype.apply = function(imageData) {
    var allEffects = this.getAllEffects(),
        effectsLength = allEffects.length;

    if (this.hasRecoloringEffects() && imageData && imageData.length) {
      // loop to apply every effect
      for (var i = 0; i < effectsLength; i++) {
        allEffects[i].apply(imageData);
      }
    } else {
      ErrorCatcher.handleError(new QowtSilentError('RecolorRequest: Cannot ' +
          'apply effects as either effects are unavailable or effect data is ' +
          'incomplete or image data is missing!'));
    }
  };

  return RecolorRequest;
});
