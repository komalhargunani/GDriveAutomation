
define([
  'qowtRoot/drawing/pictureRecolor/effects/biLevelEffect'
], function(BiLevelEffect) {

  'use strict';

  /**
   * Point's BiLevel effect request object. Based on the general
   * 'biLevel' effect object.
   *
   * In addition to base capabilities, it scales down input threshold values
   * from a range of [0, 100000] (as per Point's specifications) to
   * [0, 100] (as expected by this effect's implementation).
   *
   * @param {number} threshold  Required. Intensity with which this effect is to
   *     be applied. In the range of [0, 100000] (as per Point specifications)
   *
   * @constructor
   */
  var PointBiLevelEffect = function(threshold) {
    if (threshold !== undefined && threshold !== null) {
      threshold /= 1000;
    }

    BiLevelEffect.call(this, threshold);
  };

  PointBiLevelEffect.prototype = Object.create(BiLevelEffect.prototype);
  PointBiLevelEffect.prototype.constructor = PointBiLevelEffect;

  return PointBiLevelEffect;
});
