/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * StyleSheetsManager is meant for handling the HTML-document styeSheets.
 */
define([], function() {

  'use strict';

  var _qowtDynamicStyleSheet;

  /**
   * fetches the QOWT style sheet from the DOM, and initializes the local
   * variable.
   */
  var _initQowtDynamicStyleSheet = function() {
    var styleSheets = document.styleSheets;
    for (var i = 0; i < styleSheets.length; i++) {
      var styleSheet = styleSheets[i];
      if(styleSheet.ownerNode.id === 'qowt-dynamic-styles') {
        _qowtDynamicStyleSheet = styleSheet;
        break;
      }
    }
  };

  var _api = {

    /**
     * appends css style-attribute to the css style class in the DOM.
     * @param {String} styleClassName - css class name to manipulate.
     * @param {String} styleAttribute - css style attribute to add.
     * @param {String} styleValue - value of the css style attribute.
     */
    addStyleToClass: function(styleClassName, styleAttribute, styleValue) {
      if (!_qowtDynamicStyleSheet) {
        _initQowtDynamicStyleSheet();
      }

      var styleRules = _qowtDynamicStyleSheet.rules;
      var styleClassNameSelectorText = '.' + styleClassName.toLowerCase();

      for (var i = 0; i < styleRules.length; i++) {
        var styleRule = styleRules[i];
        if(styleRule.selectorText === styleClassNameSelectorText) {
          styleRule.style[styleAttribute] = styleValue;
          break;
        }
      }
    }
  };

  return _api;
});