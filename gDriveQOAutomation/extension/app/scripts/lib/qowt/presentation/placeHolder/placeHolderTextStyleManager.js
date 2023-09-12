/*!
 * Copyright Quickoffice, Inc, 2005-2011
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

  var _textStyleCache = {
    masterTextStyle: {},
    masterListStyle: {},
    layoutTextStyle: {},
    resolvedRunPr: {},
    resolvedParaPr: {}
  };

  var _bodyPropertiesCache = {
    masterBodyProperties: {},
    layoutBodyProperties: {},
    resolvedBodyProperties: {}
  };

  /**
   * maps
   * 1. masterListStyle to masterTextStyle
   * 2. layoutTextStyle to masterListStyle
   * 3. layoutBodyProperties to masterBodyProperties
   */
  var _phTextStyleMap = {
    ctrTitle: {
      masterTextStyle: 'title',
      masterListStyle: 'title',
      masterBodyProperties: 'title'
    },
    subTitle: {
      masterTextStyle: 'body',
      masterListStyle: 'body',
      masterBodyProperties: 'body'
    },
    obj: {
      masterTextStyle: 'body',
      masterListStyle: 'body',
      masterBodyProperties: 'body'
    },
    dt: {
      masterTextStyle: 'other'
    },
    ftr: {
      masterTextStyle: 'other'
    },
    sldNum: {
      masterTextStyle: 'other'
    }
  };

  /**
   * fetches the cached master list-style, for the given place-holder type
   * @param {String} phType - type of place-holder
   * @return {JSON} cached master list-style
   */
  var _getCachedMasterListStyle = function(phType) {
    var phTextStyle = _phTextStyleMap[phType];
    phType = (phTextStyle && phTextStyle.masterListStyle) || phType;

    var mlListStylesCache =
      _textStyleCache.masterListStyle[PointModel.MasterSlideId];

    return (mlListStylesCache && mlListStylesCache[phType]);
  };

  /**
   * fetches the cached layout text-style, for the given place-holder type and
   * index
   * @param {String} phType - type of place-holder
   * @param {String} phIdx - index of place-holder
   * @return {JSON} cached layout text-style
   */
  var _getCachedLayoutTextStyle = function(phType, phIdx) {
    var layoutTextStyleCache =
      _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId];

    return (layoutTextStyleCache && layoutTextStyleCache[phType] &&
      layoutTextStyleCache[phType][phIdx]);
  };

  /**
   * fetches paragraph property from the cached text-style
   * @param {JSON} textStyle - text-style
   * @param {String} paraLvlPropName - paragraph level property name
   * @return {JSON} paragraph property from the cached text-style
   */
  var _getParaPropertyFromTextStyle = function(textStyle, paraLvlPropName) {
    if (textStyle && textStyle.pPrArr) {
      for (var i = 0; i < textStyle.pPrArr.length; i++) {
        var paraPropertyName = textStyle.pPrArr[i].pPrName;
        if (paraPropertyName === paraLvlPropName) {
          return textStyle.pPrArr[i].pPrValue;
        }
      }
    }
    return undefined;
  };

  /**
   * fetches run-property from the paragraph property in the cached text-style
   * @param {JSON} textStyle - text-style
   * @param {String} paraLvlPropName - paragraph level property name
   * @return {JSON} cached run-properties
   */
  var _getRunPropertyFromTextStyle = function(textStyle, paraLvlPropName) {
    var paraProperty =
      _getParaPropertyFromTextStyle(textStyle, paraLvlPropName);
    return (paraProperty && paraProperty.defRPr);
  };

  /**
   * resolves run-properties
   * @param {Object} textStyleRunProperties - text-style run-properties which
   *                                          override existing run-properties
   * @param {JSON} runProperties - run-properties to update
   */
  var _resolveRunProperties = function(textStyleRunProperties, runProperties) {
    for (var textStyleRunProperty in textStyleRunProperties) {
      runProperties[textStyleRunProperty] =
          textStyleRunProperties[textStyleRunProperty];
    }
  };

  /**
   * resolves para-properties
   * @param {Object} textStyleParaProperties - text-style run-properties which
   *                                           override existing run-properties
   * @param {JSON} paraProperties - run-properties to update
   */
  var _resolveParaProperties = function(textStyleParaProperties,
                                        paraProperties) {
    for (var textStyleParaProperty in textStyleParaProperties) {
      if (textStyleParaProperty !== 'defRPr') {
        if (textStyleParaProperty === 'bullet') {
          paraProperties.bullet = paraProperties.bullet || {};

          for (var bulletProperty in textStyleParaProperties.bullet) {
            paraProperties.bullet[bulletProperty] =
              textStyleParaProperties.bullet[bulletProperty];
          }

        } else {
          paraProperties[textStyleParaProperty] =
            textStyleParaProperties[textStyleParaProperty];
        }
      }
    }
  };

  /**
   * resolves the entire run-property for a certain paragraph-level
   * @param {JSON} masterTextStyle - master text-style for a PH
   * @param {JSON} masterListStyle - master list-style for a PH
   * @param {JSON} layoutTextStyle - layout text-style for a PH
   * @param {String} paraLvlPropName - paragraph level property name
   */
  var _computeResolvedRun = function(masterTextStyle, masterListStyle,
                                     layoutTextStyle, paraLvlPropName) {
    var resolvedRunProperty = {};
    var masterTextStyleRunProperty =
      _getRunPropertyFromTextStyle(masterTextStyle, paraLvlPropName);

    var masterListStyleRunProperty =
      _getRunPropertyFromTextStyle(masterListStyle, paraLvlPropName);

    var layoutTextStyleRunProperty =
      _getRunPropertyFromTextStyle(layoutTextStyle, paraLvlPropName);

    _resolveRunProperties(masterTextStyleRunProperty, resolvedRunProperty);
    _resolveRunProperties(masterListStyleRunProperty, resolvedRunProperty);
    _resolveRunProperties(layoutTextStyleRunProperty, resolvedRunProperty);

    return resolvedRunProperty;
  };

  /**
   * resolves the entire para-property(except containing run-property)
   * for a certain paragraph-level
   * @param {JSON} masterTextStyle - master text-style for a PH
   * @param {JSON} masterListStyle - master list-style for a PH
   * @param {JSON} layoutTextStyle - layout text-style for a PH
   * @param {String} paraLvlPropName - paragraph level property name
   */
  var _computeResolvedPara = function(masterTextStyle, masterListStyle,
                                      layoutTextStyle, paraLvlPropName) {
    var resolvedParaProperty = {};
    var masterTextStyleParaProperty =
      _getParaPropertyFromTextStyle(masterTextStyle, paraLvlPropName);

    var masterListStyleParaProperty =
      _getParaPropertyFromTextStyle(masterListStyle, paraLvlPropName);

    var layoutTextStyleParaProperty =
      _getParaPropertyFromTextStyle(layoutTextStyle, paraLvlPropName);

    _resolveParaProperties(masterTextStyleParaProperty, resolvedParaProperty);
    _resolveParaProperties(masterListStyleParaProperty, resolvedParaProperty);
    _resolveParaProperties(layoutTextStyleParaProperty, resolvedParaProperty);

    return resolvedParaProperty;
  };

  /**
   * resolves and caches para and run properties, of each para-level
   * @param {String} phTyp - type of place-holder
   * @param {String} phIdx - index of place-holder
   */
  var _resolveAndCacheTextStyleProperties = function(phTyp, phIdx) {
    var masterTextStyle = _api.getCachedMasterTextStyle(phTyp);
    var masterListStyle = _getCachedMasterListStyle(phTyp);
    var layoutTextStyle = _getCachedLayoutTextStyle(phTyp, phIdx);

    var resolvedDefRunProperty = _computeResolvedRun(masterTextStyle,
      masterListStyle, layoutTextStyle, 'defPPr');
    var resolvedDefParaProperty = _computeResolvedPara(masterTextStyle,
      masterListStyle, layoutTextStyle, 'defPPr');
    var cacheId = _computeResolvedCacheId(phTyp, phIdx, 'def');
    _textStyleCache.resolvedRunPr[cacheId] =
      DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedDefRunProperty);
    _textStyleCache.resolvedParaPr[cacheId] =
      DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedDefParaProperty);

    for (var paraLevel = 0; paraLevel < 9; paraLevel++) {
      var paraLvlPropName = 'lvl' + (paraLevel + 1) + 'PPr';

      var resolvedRunProperty = _computeResolvedRun(masterTextStyle,
        masterListStyle, layoutTextStyle, paraLvlPropName);
      var resolvedParaProperty = _computeResolvedPara(masterTextStyle,
        masterListStyle, layoutTextStyle, paraLvlPropName);

      cacheId = _computeResolvedCacheId(phTyp, phIdx, paraLevel);
      _textStyleCache.resolvedRunPr[cacheId] =
        DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedRunProperty);
      _textStyleCache.resolvedParaPr[cacheId] =
        DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedParaProperty);
    }
  };

  /**
   * Resolves and updates existing body properties JSON
   * @param {JSON} bodyProperties - body properties which override existing body
   *                                properties
   * @param {JSON} resolvedBodyProperty - body properties to update
   */
  var _resolveBodyProperties = function(bodyProperties, resolvedBodyProperty) {
    for (var bodyProperty in bodyProperties) {
      resolvedBodyProperty[bodyProperty] = bodyProperties[bodyProperty];
    }
  };

  /**
   * Resolves the entire body properties for a particular place-holder
   * @param {JSON} masterBodyProperties - master body properties for a
   *                                      place-holder
   * @param {JSON} layoutBodyProperties - layout body properties for a
   *                                      place-holder
   * @return {JSON} resolvedBodyProperty - resolved body properties for a
   *                                       place-holder
   */
  var _computeResolvedBodyProperties = function(masterBodyProperties,
                                                layoutBodyProperties) {
    var resolvedBodyProperty = {};
    _resolveBodyProperties(masterBodyProperties, resolvedBodyProperty);
    _resolveBodyProperties(layoutBodyProperties, resolvedBodyProperty);

    return resolvedBodyProperty;
  };

  /**
   * Fetches cached master body properties, for the given place-holder type
   * @param {String} phTyp - type of place-holder
   * @return {JSON} cached master body properties
   */
  var _getCachedMasterBodyProperties = function(phTyp) {
    var phStyle = _phTextStyleMap[phTyp];
    phTyp = (phStyle && phStyle.masterBodyProperties) || phTyp;

    var mlBodyPropCache =
      _bodyPropertiesCache.masterBodyProperties[PointModel.MasterSlideId];

    return (mlBodyPropCache && mlBodyPropCache[phTyp]);
  };

  /**
   * Fetches cached layout body properties, for the given place-holder type and
   * index
   * @param {String} phTyp - type of place-holder
   * @param {String} phIdx - index of place-holder
   * @return {JSON} cached layout body properties
   */
  var _getCachedLayoutBodyProperties = function(phTyp, phIdx) {
    var layoutBodyPropCache =
      _bodyPropertiesCache.layoutBodyProperties[PointModel.SlideLayoutId];

    return (layoutBodyPropCache && layoutBodyPropCache[phTyp] &&
      layoutBodyPropCache[phTyp][phIdx]);
  };

  /**
   * Resolves and caches body properties
   * @param {String} phTyp - type of place-holder
   * @param {String} phIdx - index of place-holder
   */
  var _resolveAndCacheBodyProperties = function(phTyp, phIdx) {
    var masterBodyProperties = _getCachedMasterBodyProperties(phTyp);
    var layoutBodyProperties = _getCachedLayoutBodyProperties(phTyp, phIdx);

    var resolvedBodyProperties =
      _computeResolvedBodyProperties(masterBodyProperties,
        layoutBodyProperties);
    var cacheId = _computeResolvedCacheId(phTyp, phIdx);
    _bodyPropertiesCache.resolvedBodyProperties[cacheId] =
      DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedBodyProperties);
  };

  /**
   * computes the cache-id, required to fetch and cache resolved run-properties,
   * paragraph properties and body properties
   *
   * @param {String} phTyp - type of place-holder
   * @param {String} phIdx - index of place-holder
   * @param {String} paraLevel - level of paragraph to look into, undefined in
   *                             case of body properties
   * @return {String} cache-id
   */
  var _computeResolvedCacheId = function(phTyp, phIdx, paraLevel) {
    var cacheId = PointModel.MasterSlideId + '_' + PointModel.SlideLayoutId +
      '_' + phTyp + '_' + phIdx;

    if (paraLevel !== undefined) {
      cacheId += '_' + paraLevel;
    }

    return cacheId;
  };

  var _api = {
    /**
     * caches master text style
     * @param {Object} masterTextStyleArr - master text-style to cache
     */
    cacheMasterTextStyle: function(masterTextStyleArr) {
      var masterTextStyleCacheObj = {};

      for (var i = 0; i < masterTextStyleArr.length; i++) {
        var masterTextStyle = masterTextStyleArr[i];
        masterTextStyleCacheObj[masterTextStyle.type] = masterTextStyle;
      }

      _textStyleCache.masterTextStyle[PointModel.MasterSlideId] =
        masterTextStyleCacheObj;
    },

    /**
     * caches master list style
     * @param {String} phTyp - place-holder type
     * @param {JSON} masterListStyle - master list-style to cache
     */
    cacheMasterListStyle: function(phTyp, masterListStyle) {
      _textStyleCache.masterListStyle[PointModel.MasterSlideId] =
        _textStyleCache.masterListStyle[PointModel.MasterSlideId] || {};

      _textStyleCache.masterListStyle[PointModel.MasterSlideId][phTyp] =
        masterListStyle;
    },

    /**
     * caches layout text-style
     * @param {String} phTyp - type of place-holder
     * @param {String} phIdx - index of place-holder
     * @param {JSON} layoutTextStyle - layout text-style to cache
     */
    cacheLayoutTextStyle: function(phTyp, phIdx, layoutTextStyle) {
      _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId] =
        _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId] || {};

      _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId][phTyp] =
        _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId][phTyp] || {};

      _textStyleCache.layoutTextStyle[PointModel.SlideLayoutId][phTyp][phIdx] =
        layoutTextStyle;

      _resolveAndCacheTextStyleProperties(phTyp, phIdx);
    },

    /**
     * Caches master body properties
     * @param {String} phTyp - type of place-holder
     * @param {JSON} masterBodyProperties - master body properties to cache
     */
    cacheMasterBodyProperties: function(phTyp, masterBodyProperties) {
      _bodyPropertiesCache.masterBodyProperties[PointModel.MasterSlideId] =
        _bodyPropertiesCache.masterBodyProperties[PointModel.MasterSlideId] ||
        {};

      _bodyPropertiesCache.
        masterBodyProperties[PointModel.MasterSlideId][phTyp] =
        masterBodyProperties;
    },

    /**
     * Caches layout body properties
     * @param {String} phTyp - type of place-holder
     * @param {String} phIdx - type of place-holder
     * @param {JSON} layoutBodyProperties - layout body properties to cache
     */
    cacheLayoutBodyProperties: function(phTyp, phIdx, layoutBodyProperties) {
      _bodyPropertiesCache.layoutBodyProperties[PointModel.SlideLayoutId] =
        _bodyPropertiesCache.layoutBodyProperties[PointModel.SlideLayoutId] ||
        {};

      _bodyPropertiesCache.
        layoutBodyProperties[PointModel.SlideLayoutId][phTyp] =
        _bodyPropertiesCache.
          layoutBodyProperties[PointModel.SlideLayoutId][phTyp] || {};

      _bodyPropertiesCache.
        layoutBodyProperties[PointModel.SlideLayoutId][phTyp][phIdx] =
        layoutBodyProperties;

      _resolveAndCacheBodyProperties(phTyp, phIdx);
    },

    /**
     * returns cached master text-style
     * @param {String} phType - type of place-holder
     * @return {JSON} cached master text-style
     */
    getCachedMasterTextStyle: function(phType) {
      var phTextStyle = _phTextStyleMap[phType];
      phType = (phTextStyle && phTextStyle.masterTextStyle) || phType;

      var mlTxtStylesCache =
        _textStyleCache.masterTextStyle[PointModel.MasterSlideId];

      return mlTxtStylesCache[phType];
    },

    /**
     * Returns resolved body properties
     * @return {JSON} resolved body properties
     */
    getResolvedBodyProperties: function() {
      var currentPlaceHolderAtSlide = PointModel.CurrentPlaceHolderAtSlide;
      var cacheId = _computeResolvedCacheId(currentPlaceHolderAtSlide.phTyp,
        currentPlaceHolderAtSlide.phIdx);

      //In some cases there are no additional properties assigned to some ph in
      // layout. Hence, ph are present in slide master but not in layout.
      //In this case, we do not need to resolve body properties we simply pass
      // the properties for that ph in master
      return _bodyPropertiesCache.resolvedBodyProperties[cacheId] ||
        _getCachedMasterBodyProperties(currentPlaceHolderAtSlide.phTyp);
    },

    /**
     * returns cached and resolved run-property for the paragraph-level
     * @param {String} paraLevel - level of paragraph to look into, 'def' for
     *                             default, else level starting with 0.
     * @return {JSON} cached and resolved run-property
     */
    resolveRunPropertyFor: function(paraLevel) {
      var currentPlaceHolderAtSlide = PointModel.CurrentPlaceHolderAtSlide;
      var cacheId = _computeResolvedCacheId(currentPlaceHolderAtSlide.phTyp,
        currentPlaceHolderAtSlide.phIdx, paraLevel);
      if (_textStyleCache.resolvedRunPr[cacheId] !== undefined) {
        return _textStyleCache.resolvedRunPr[cacheId];
      } else {
        //In some cases there are no additional properties assigned to run/para
        // in layout. Hence, run/para are present in slide master but not in
        // layout.
        //In this case the properties are not already resolved. So we resolve
        // them for master list styles and master text styles
        _resolveAndCacheTextStyleProperties(currentPlaceHolderAtSlide.phTyp,
          currentPlaceHolderAtSlide.phIdx);
        return _textStyleCache.resolvedRunPr[cacheId];
      }
    },

    /**
     * returns cached and resolved para-property for the paragraph-level
     * @param {String} paraLevel - level of paragraph to look into, 'def' for
     *                             default, else level starting with 0.
     * @return {JSON} cached and resolved para-property
     */
    resolveParaPropertyFor: function(paraLevel) {
      var currentPlaceHolderAtSlide = PointModel.CurrentPlaceHolderAtSlide;
      var cacheId = _computeResolvedCacheId(currentPlaceHolderAtSlide.phTyp,
        currentPlaceHolderAtSlide.phIdx, paraLevel);
      if (_textStyleCache.resolvedRunPr[cacheId] !== undefined) {
        return _textStyleCache.resolvedParaPr[cacheId];
      } else {
        //In some cases there are no additional properties assigned to run/para
        // in layout. Hence, run/para are present in slide master but not in
        // layout.
        //In this case the properties are not already resolved. So we resolce
        // them for masrer list styles and master text styles
        _resolveAndCacheTextStyleProperties(currentPlaceHolderAtSlide.phTyp,
          currentPlaceHolderAtSlide.phIdx);
        return _textStyleCache.resolvedParaPr[cacheId];
      }
    },

    /**
     * For test-cases only
     * resets the text-style cache
     */
    resetCache: function() {
      _textStyleCache = {
        masterTextStyle: {},
        masterListStyle: {},
        layoutTextStyle: {},
        resolvedParaPr: {},
        resolvedRunPr: {}
      };

      _bodyPropertiesCache = {
        masterBodyProperties: {},
        layoutBodyProperties: {},
        resolvedBodyProperties: {}
      };
    }
  };

  return _api;
});
