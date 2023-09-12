// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 * Simple module for some object utility functions.
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */


define([
  'qowtRoot/utils/typeUtils'
], function(TypeUtils) {

  'use strict';

  // Object util Constructor
  var ObjectUtil = function() {
  };

  // Assign constructor to prototype
  ObjectUtil.prototype.constructor = ObjectUtil;

  /**
   * Makes copy of object
   * @param {object} obj Object to be cloned
   * @return {object} cloned object
   */
  ObjectUtil.prototype.clone = function(obj) {
    if (TypeUtils.isObject(obj)) {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  /**
   * Appends JSON attributes to target object
   * @param {object} targetObj Target object
   * @param {object} sourceObj Source object
   */
  ObjectUtil.prototype.appendJSONAttributes = function(targetObj, sourceObj) {
    if (TypeUtils.isObject(targetObj) && TypeUtils.isObject(sourceObj)) {
      for (var item in sourceObj) {
        targetObj[item] = sourceObj[item];
      }
    }
  };

  return ObjectUtil;
});
