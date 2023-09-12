define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError'
], function(
    TypeUtils) {

  'use strict';

  var pointsPerMm = 2.834645669;

  var api_ = {
    /**
     * Bidirectional converter between millimeters and points.  Note that this
     * relies on floating point calculations, which are not perfect, so use
     * with caution
     */
    from: 'pt',
    to: 'mm',
    bidi: true,

    /**
     * Converts from Point to millimeters
     *
     * @param {string | number} pt the value in points
     * @return {number} equivient value in millimeters
     */
    'pt2mm': function(pt) {
      if (pt !== undefined) {
        pt = TypeUtils.isString(pt) ? parseFloat(pt) : pt;

        // For boolean values and for empty array isNan() returns false
        if (isNaN(pt) || !TypeUtils.isNumber(pt)) {
          throw new Error('pt2mm has incorrect argument type');
        }

        return (pt / pointsPerMm);
      }
    },

    /**
     * Converts from millimeters to Points
     *
     * @param {string | number} mm the value in millimeters
     * @return {number} equivalent value in points
     */
    'mm2pt': function(mm) {
      if (mm !== undefined) {
        mm = TypeUtils.isString(mm) ? parseFloat(mm) : mm;

        // For boolean values and for empty array isNan() returns false
        if (isNaN(mm) || !TypeUtils.isNumber(mm)) {
          throw new Error('mm2pt has incorrect argument type:');
        }

        return (mm * pointsPerMm);
      }
    }
  };

  return api_;
});
