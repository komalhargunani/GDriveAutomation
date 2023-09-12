/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point'
], function(DeprecatedUtils, PointModel) {

  'use strict';

  var _shapePropertyCache = {
    masterShapeProperties: {},
    layoutShapeProperties: {},
    resolvedShapeProperties: {}
  };

  /**
   * maps
   * 1. layoutShapeProperties to masterShapeProperties
   */
  var _phStyleMap = {
    ctrTitle: {
      masterShapeProperties: 'title'
    },
    subTitle: {
      masterShapeProperties: 'body'
    },
    pic: {
      masterShapeProperties: 'body'
    },
    clipArt: {
      masterShapeProperties: 'body'
    },
    chart: {
      masterShapeProperties: 'body'
    },
    media: {
      masterShapeProperties: 'body'
    },
    tbl: {
      masterShapeProperties: 'body'
    },
    dgm: {
      masterShapeProperties: 'body'
    }
  };

  /**
   * Resolves and caches shape properties
   * @param {String} phType - type of place-holder
   * @param {String} phIdx - index of place-holder
   */
  var _resolveAndCacheProperties = function(phTyp, phIdx) {
    var masterShapeProperties = _getCachedMasterShapeProperties(phTyp);
    var layoutShapeProperties = _getCachedLayoutShapeProperties(phTyp, phIdx);

    var resolvedShapeProperties =
      _computeResolvedSpPr(masterShapeProperties, layoutShapeProperties);
    var cacheId = _computeResolvedCacheId(phTyp, phIdx);
    _shapePropertyCache.resolvedShapeProperties[cacheId] =
      DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedShapeProperties);
  };

  /**
   * Resolves the entire shape-property for a particular place-holder
   * @param {JSON} masterShapeProperties - master shape properties for a
   *                                       place-holder
   * @param {JSON} layoutShapeProperties - layout shape properties for a
   *                                       place-holder
   * @return {JSON} resolvedShapeProperty - resolved shape property for a
   *                                        place-holder
   */
  var _computeResolvedSpPr = function(masterShapeProperties,
                                      layoutShapeProperties) {
    var resolvedShapeProperty = {};
    _resolveShapeProperties(masterShapeProperties, resolvedShapeProperty);
    _resolveShapeProperties(layoutShapeProperties, resolvedShapeProperty);

    return resolvedShapeProperty;
  };

  /**
   * Resolves shape-properties
   * @param {JSON} shapeProperties - shape properties which override existing
   *                                 shape properties
   * @param {Object} property - shape properties to update
   */
  var _resolveShapeProperties = function(shapeProperties, property) {
    for (var shapeProperty in shapeProperties) {
      property[shapeProperty] = shapeProperties[shapeProperty];
    }
  };

  /**
   * Computes the cache-id, required to fetch and cache resolved run-properties
   * @param {String} phType - type of place-holder
   * @param {String} phIdx - index of place-holder
   * @return {String} cache-id
   */
  var _computeResolvedCacheId = function(phTyp, phIdx) {
    return PointModel.MasterSlideId + '_' + PointModel.SlideLayoutId + '_' +
      phTyp + '_' + phIdx;
  };

  /**
   * Fetches the cached master shape properties, for the given place-holder type
   * @param {String} phType - type of place-holder
   * @return {JSON} cached master shape properties
   */
  var _getCachedMasterShapeProperties = function(phType) {
    var phStyle = _phStyleMap[phType];
    phType = (phStyle && phStyle.masterShapeProperties) || phType;

    var mlShapePropCache =
      _shapePropertyCache.masterShapeProperties[PointModel.MasterSlideId];

    return (mlShapePropCache && mlShapePropCache[phType]);
  };

  /**
   * Fetches the cached layout shape properties, for the given place-holder type
   * and index
   * @param {String} phType - type of place-holder
   * @param {String} phIdx - index of place-holder
   * @return {JSON} cached layout shape properties
   */
  var _getCachedLayoutShapeProperties = function(phType, phIdx) {
    var layoutShapePropCache =
      _shapePropertyCache.layoutShapeProperties[PointModel.SlideLayoutId];

    return (layoutShapePropCache && layoutShapePropCache[phType] &&
      layoutShapePropCache[phType][phIdx]);
  };

  var _api = {
    /**
     * Caches master shape properties
     * @param {Object} masterShapeProperty - master shape properties to cache
     */
    cacheMasterShapeProperties: function(phTyp, masterShapeProperty) {
      _shapePropertyCache.masterShapeProperties[PointModel.MasterSlideId] =
        _shapePropertyCache.masterShapeProperties[PointModel.MasterSlideId] ||
        {};

      _shapePropertyCache.
        masterShapeProperties[PointModel.MasterSlideId][phTyp] =
        masterShapeProperty;
    },

    /**
     * Caches layout shape properties
     * @param {String} phType - type of place-holder
     * @param {String} phIdx - index of place-holder
     * @param {JSON} layoutShapeProperty - layout shape properties to cache
     */
    cacheLayoutShapeProperties: function(phTyp, phIdx, layoutShapeProperty) {
      _shapePropertyCache.layoutShapeProperties[PointModel.SlideLayoutId] =
        _shapePropertyCache.layoutShapeProperties[PointModel.SlideLayoutId] ||
        {};

      _shapePropertyCache.
        layoutShapeProperties[PointModel.SlideLayoutId][phTyp] =
        _shapePropertyCache.
          layoutShapeProperties[PointModel.SlideLayoutId][phTyp] || {};

      _shapePropertyCache.
        layoutShapeProperties[PointModel.SlideLayoutId][phTyp][phIdx] =
        layoutShapeProperty;

      _resolveAndCacheProperties(phTyp, phIdx);
    },

    /**
     * Returns cached and resolved shape properties
     * @return {JSON} cached and resolved shape property
     */
    getResolvedShapeProperties: function() {
      var currentPlaceHolderAtSlide = PointModel.CurrentPlaceHolderAtSlide;
      var cacheId = _computeResolvedCacheId(currentPlaceHolderAtSlide.phTyp,
        currentPlaceHolderAtSlide.phIdx);
      //In some cases there are no additional properties assigned to some ph in
      // layout. Hence, ph are present in slide master but not in layout.
      //In this case the we dont need to resolve shape properties we simply pass
      // the properties for that ph in master
      return _shapePropertyCache.resolvedShapeProperties[cacheId] ||
        _getCachedMasterShapeProperties(currentPlaceHolderAtSlide.phTyp);
    },

    /**
     * For test-cases only
     * resets the shape property cache
     */
    resetCache: function() {
      _shapePropertyCache = {
        masterShapeProperties: {},
        layoutShapeProperties: {},
        resolvedShapeProperties: {}
      };
    }
  };

  return _api;
});
