
define([
  'qowtRoot/drawing/pictureRecolor/effects/duotoneEffect',
  'qowtRoot/drawing/color/colorUtility'
], function(DuotoneEffect,
            ColorUtility) {

  'use strict';

  /**
   * Point's Duotone effect request object. Based on the general
   * 'pictureRecolor/effects/duotoneEffect' object.
   *
   * @param {JSON} firstColorDcpData
   * @param {JSON} secondColorDcpData
   *
   * @constructor
   */
  var PointDuotoneEffect = function(firstColorDcpData, secondColorDcpData) {
    var colors = [];

    [firstColorDcpData, secondColorDcpData].forEach(
        function(colorDcpData, index) {
          if (colorDcpData) {
            colors[index] = ColorUtility.getColor(colorDcpData);
          }
        });

    DuotoneEffect.call(this, colors[0], colors[1]);
  };

  PointDuotoneEffect.prototype = Object.create(DuotoneEffect.prototype);
  PointDuotoneEffect.prototype.constructor = PointDuotoneEffect;

  return PointDuotoneEffect;
});
