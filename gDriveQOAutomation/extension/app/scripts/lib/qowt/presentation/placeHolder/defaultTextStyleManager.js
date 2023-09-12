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
  'qowtRoot/utils/deprecatedUtils'
], function(DeprecatedUtils) {

  'use strict';

  var _api;
  var _defTextStyle;

  _api = {

    /**
     * Caches the default text style.
     *
     * @param {Object} defTextStyleObject - the default text style JSON object.
     */
    cacheDefTxtStyle: function(defTextStyleObject) {
      _defTextStyle = defTextStyleObject;
    },

    /**
     * Returns default run properties for given paragraph level.
     *
     * @param {String} paraLevel - level of paragraph to look into, starting
     *                             with 0.
     * @return {JSON} the JSON of text run peoperties or undefined if text run
     *                properties are not present for given paragraph level
     */
    resolveRunPropertyFor: function(paraLevel) {
      var resolvedRunProperty = {};
      var resolvedParaProperties = _api.resolveParaPropertyFor(paraLevel);

      if (resolvedParaProperties) {
        resolvedRunProperty = resolvedParaProperties.defRPr;
      }

      return DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedRunProperty);
    },

    /**
     * Returns default paragraph properties for given paragraph level.
     *
     * @param {String} paraLevel - level of paragraph to look into, starting
     *                             with 0
     * @return {JSON} the JSON of paragraph peoperties or undefined if paragraph
     *                properties are not present for given paragraph level
     */
    resolveParaPropertyFor: function(paraLevel) {
      var resolvedParaProperty = {};
      var paraLvlPropName;

      if (paraLevel === 'def') {
        paraLvlPropName = 'defPPr';
      } else {
        paraLvlPropName = 'lvl' + (paraLevel + 1) + 'PPr';
      }

      for (var i = 0; i < _defTextStyle.pPrArr.length; i++) {
        var paraProperties = _defTextStyle.pPrArr[i];
        if (paraLvlPropName === paraProperties.pPrName) {
          resolvedParaProperty = paraProperties.pPrValue;
          break;
        }
      }

      return DeprecatedUtils.returnUndefinedIfEmptyJson(resolvedParaProperty);
    }
  };

  return _api;
});
