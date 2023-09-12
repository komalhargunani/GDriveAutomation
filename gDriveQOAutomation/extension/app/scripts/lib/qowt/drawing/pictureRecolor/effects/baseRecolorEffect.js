
define([
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/utils/typeUtils'
], function(QowtException, ErrorCatcher, TypeUtils) {

  'use strict';

  /**
   * A base for any recolor effect.
   *
   * @param {string} name  Effect's name
   *
   * @constructor
   */
  var BaseRecolorEffect = function(name) {
    this.name = name;

    if (TypeUtils.isUndefined(this.name) || TypeUtils.isNull(this.name) ||
        !TypeUtils.isString(this.name) || this.name.trim() === '') {
      ErrorCatcher.handleError(new QowtException('Effect being created with' +
          ' a missing or an invalid name.'));
    }
  };

  BaseRecolorEffect.prototype.constructor = BaseRecolorEffect;

  /**
   * Applies the effect on supplied image data, pixel by pixel.
   *
   * Needs to be overriden to provide concrete implementations.
   *
   * @param {Uint8ClampedArray} imageData  Base/pixel color in RGBA format to be
   *     applied with the effect
   *
   * @return {boolean} True if effect was processed/applied successfully or
   * false otherwise
   */
  BaseRecolorEffect.prototype.apply = function(/*imageData*/) {
    ErrorCatcher.handleError(new QowtException('Recolor Effect didn\'t ' +
        'apply!'));

    return false;
  };

  return BaseRecolorEffect;
});
