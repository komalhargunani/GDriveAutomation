// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview bi-directional converter between points to em.
 *
 * Note that because of floating point calculations we are not always
 * guaranteed to have the conversions accurate (use with caution).
 *
 * @see src/utils/converters/converter for usage.
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */

define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/models/env',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError'
], function(
    TypeUtils,
    EnvModel) {

  'use strict';

  var _api = {
    from: 'pt',
    to: 'em',
    bidi: true,

    /**
     * Converts from Point to EM units
     * The default text size in browsers is 16px (which is equal to 12pt).
     * So, the default size of 1em is 16px.
     *
     * This is still device and platform dependent but going ahead with this
     * option as it gets closer to MS.
     *
     * Note: This converter makes use of 'pointsPerEm' environment setting in
     * computation.
     *
     * @param {string | number} pt the value in points
     * @return {number} point equivalent ems
     */
    'pt2em': function(pt) {
      if (pt === undefined) {
        return undefined;
      }

      pt = TypeUtils.isString(pt) ? parseFloat(pt) : pt;

      // For boolean values and for empty array isNan() returns false
      if (isNaN(pt) || !TypeUtils.isNumber(pt)) {
        throw new Error('pt2em has incorrect argument type');
      }

      // Holds the number of pts an em is supposed to hold in the application
      // environment.
      var pointsPerEm = EnvModel.pointsPerEm;

      return (pt / pointsPerEm);
    },

    /**
     * Converts from EM to Point units
     * The default text size in browsers is 16px (which is equal to 12pt).
     * So, the default size of 1em is 16px.
     *
     * This is still device and platform dependent but going ahead with this
     * option as it gets closer to MS.
     *
     * Note: This converter makes use of 'pointsPerEm' environment setting in
     * computation.
     *
     * @param {string | number} em the value in ems
     * @return {number} ems equivalent points
     */
    'em2pt': function(em) {
      if (em === undefined) {
        return undefined;
      }

      em = TypeUtils.isString(em) ? parseFloat(em) : em;

      // For boolean values and for empty array isNan() returns false
      if (isNaN(em) || !TypeUtils.isNumber(em)) {
        throw new Error('em2pt has incorrect argument type');
      }

      // Holds the number of pts an em is supposed to hold in the application
      // environment.
      var pointsPerEm = EnvModel.pointsPerEm;

      return (em * pointsPerEm);
    }
  };

  return _api;
});
