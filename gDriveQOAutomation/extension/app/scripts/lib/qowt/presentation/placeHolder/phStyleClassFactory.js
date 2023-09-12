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
 * PH CSS Style-class name factory, for various qowt div-types.
 */
define([], function() {

  'use strict';

  /**
   * private Class with responsibility of generating PH css style-class names,
   * for various qowt div-type elements.
   * @param {String} type - qowt div-type element.
   * @private {Class}.
   * @constructor
   */
  var ClsPHStyle = function(type) {
    this.type = type;
  };

  /**
   * public function of the private class - ClsPHStyle.
   * calculates the PH css style class name, for the QOWT div-type.
   * @param {String} classPrefix - PH css style class prefix.
   * @return {String} PH css style class name.
   */
  ClsPHStyle.prototype.getClassName = function(classPrefix) {
    return classPrefix + '_' + this.type + 'Style';
  };

  var _phStyleClassMap = {
    shape: new ClsPHStyle('shape'),

    shapeFill: new ClsPHStyle('shapeFill')
  };

  return _phStyleClassMap;
});
