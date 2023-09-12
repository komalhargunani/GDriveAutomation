/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([], function() {

  'use strict';

  var _api;
  var _explicitTextStyle;

  /**
   * Returns resolved paragraph properties for given paragraph level.
   * @param {String} paraLevel - level of paragraph to look into, starting with
   *                             0.
   */
  var _getResolveParaPropertyFor = function(paraLevel) {
    var resolvedParaProperty;
    var propertyName = 'lvl' + (paraLevel + 1) + 'PPr';
    if (_explicitTextStyle) {
      resolvedParaProperty = _explicitTextStyle[propertyName];
    }

    return resolvedParaProperty;
  };

  /**
   * Returns resolved run properties for given paragraph level.
   * @param {String} paraLevel - level of paragraph to look into, starting with
   *                             0.
   */
  var _getResolveRunPropertyFor = function(paraLevel) {
    var resolvedRunProperty;
    var propertyName = 'lvl' + (paraLevel + 1) + 'PPr';

    if (_explicitTextStyle && _explicitTextStyle[propertyName]) {
      resolvedRunProperty = _explicitTextStyle[propertyName].defRPr;
    }

    return resolvedRunProperty;
  };

  _api = {

    /**
     * Caches the explicit text styles.
     * @param {Object} explicitTextStyleObject - the explicit text style JSON
     *                                           object.
     */
    cacheExplicitTxtStyle: function(explicitTextStyleObject) {
      _explicitTextStyle = {};

      for (var i = 0; i < explicitTextStyleObject.pPrArr.length; i++) {
        var paraProperties = explicitTextStyleObject.pPrArr[i];
        _explicitTextStyle[paraProperties.pPrName] = paraProperties.pPrValue;
      }
    },

    /**
     * Resolves paragraph properties and populates them to given paragraph
     * properties object.
     * @param {Object} paraProperties - paragraph properties object to be
     *                                  populated.
     */
    resolveParaPropertyFor: function(paraProperties) {
      var paraLevel = paraProperties.level || 0;
      var resolvedParaProperties = _getResolveParaPropertyFor(paraLevel);

      for (var resolvedParaProperty in resolvedParaProperties) {
        if (resolvedParaProperty !== 'defRPr') {
          if (resolvedParaProperty === 'bullet') {
            paraProperties.bullet = paraProperties.bullet || {};

            for (var bulletProperty in resolvedParaProperties.bullet) {
              paraProperties.bullet[bulletProperty] =
                paraProperties.bullet[bulletProperty] ||
                resolvedParaProperties.bullet[bulletProperty];
            }
          } else {
            paraProperties[resolvedParaProperty] =
              paraProperties[resolvedParaProperty] ||
              resolvedParaProperties[resolvedParaProperty];
          }
        }
      }
    },

    /**
     * Resolves run properties for given paragraph level and populates them to
     * given run properties object.
     * @param {String} paraLevel - level of paragraph to look into, starting
     *                             with 0.
     * @param {Object} runProperties - run properties object to be populated.
     */
    resolveRunPropertyFor: function(paraLevel, runProperties) {
      var resolvedRunProperties = _getResolveRunPropertyFor(paraLevel);

      for (var resolvedRunProperty in resolvedRunProperties) {
        if (runProperties[resolvedRunProperty] === undefined) {
          runProperties[resolvedRunProperty] =
              resolvedRunProperties[resolvedRunProperty];
        }
      }
    },

    /**
     * Resets the explicit text styles.
     */
    resetCache: function() {
      _explicitTextStyle = undefined;
    }
  };

  return _api;
});

