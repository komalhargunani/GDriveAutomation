/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview CSS Cache module provides a container to cache all the
 * dynamic CSS rules.
 * Use the CssCache constructor method to create a CssCache instance.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/typeUtils',
  'third_party/lo-dash/lo-dash.min'
], function(
  TypeUtils) {

  'use strict';

  /**
   * Constructor method to create a CssCache instance.
   * @constructor
   * @param {object} opt_rules An optional object consists of CSS selector
   *                           as the key and CSS properties object as value.
   */
  var CssCache = function(opt_rules) {
    this.rules_ = opt_rules || {};
  };

  CssCache.prototype = Object.create(Object.prototype);
  CssCache.prototype.constructor = CssCache;

  /**
   * Add a new CSS rule to the cache.
   * Note that if the CSS rule selector already exists,
   * the CSS rule will be replaced.
   * Usage:
   * // properties as JSON object.
   * CssCache.addRule('#mySelector', {background: 'red', size: '14pt'});
   * or:
   * // properties as string without the curly braces.
   * CssCache.addRule('.foobar', 'background:red;size:14pt;');
   * @public
   * @param {string} selector The CSS selector for this rule.
   * @param {ojbect|string} properties Either a JSON object containing
   *                                   the CSS properties you want to
   *                                   add, or a string containing the same
   *                                   if you use the API with a string,
   *                                   you do NOT need to add the
   *                                   curly brackets.
   */
  CssCache.prototype.addRule = function(selector, properties) {
    properties = TypeUtils.isString(properties) ?
        this.propertiesToObject_(properties) : properties;
    this.rules_[selector] = properties;
  };

  /**
   * Update a CSS rule in the cache.
   * If CSS rule selector does not exist, the CSS rule will be added.
   * Otherwise the CSS rule will be updated, in other words if property already
   * exists in the CssCache it will be updated with the new property value.
   * Usage:
   * // properties as JSON object.
   * CssCache.appendRule('#mySelector', {background: 'red', size: '14pt'});
   * or:
   * // properties as string without the curly braces.
   * CssCache.appendRule('.foobar', 'background:red;size:14pt;');
   * @public
   * @param {string} selector The CSS selector for this rule.
   * @param {ojbect|string} properties Either a JSON object containing
   *                                   the CSS properties you want to
   *                                   update, or a string containing the same
   *                                   if you use the API with a string,
   *                                   you do NOT need to add the
   *                                   curly brackets.
   */
  CssCache.prototype.updateRule = function(selector, properties) {
    var existingProperties = this.rules_[selector];
    if (existingProperties === undefined) {
      this.addRule(selector, properties);
    } else {
      properties = TypeUtils.isString(properties) ?
          this.propertiesToObject_(properties) : properties;
      _.merge(existingProperties, properties);
    }
  };

  /**
   * Removes the CSS rule for a given selector from the cache.
   * The method has no effect if the CSS selector is not present in the cache.
   * @public
   * @param {string} selector The CSS selector for the rule to be removed.
   */
  CssCache.prototype.removeRule = function(selector) {
    delete this.rules_[selector];
  };

  /**
   * Retrieves the CSS rule as a string for a given selector.
   * Removes the curly braces from the CSS rule.
   * @public
   * @param {string} selector The CSS selector under inspection.
   * @return {string|undefined} CSS rule string for the given selector or,
   *                            undefined if the selector is not present.
   */
  CssCache.prototype.getRuleAsString = function(selector) {
    var properties = this.rules_[selector];
    if (properties !== undefined) {
      var ruleString = '';
      for (var i in properties) {
        ruleString += i + ':' + properties[i] + ';';
      }
      return ruleString;
    }
  };

  /**
   * Returns all the CSS rules present in the cache serialized as a string.
   * @public
   * @return {string} all CSS rules present in the cache, if the cache is empty,
   *                  returns an empty string.
   */
  CssCache.prototype.getAllRules = function() {
    var allRules = '';
    for (var selector in this.rules_) {
      allRules += selector + ' {' + this.getRuleAsString(selector) + '} ';
    }
    return allRules;
  };

  /**
   * Clones the CSS rule from source selector to destination selector,
   * and adds it to the cache.
   * Note that the method has no effect if the srcSelector passed in is
   * not present in the cache.
   * @public
   * @param {string} srcSelector The selector from which to use the rule.
   * @param {string} desSelector The target selector to apply rules to.
   */
  CssCache.prototype.cloneRule = function(srcSelector, desSelector) {
    var srcProperties = this.rules_[srcSelector];
    if (srcProperties !== undefined) {
      var destProperties = _.clone(srcProperties);
      this.addRule(desSelector, destProperties);
    }
  };

  /**
   * Resets the internal state of the cache.
   * @public
   */
  CssCache.prototype.clearCache = function() {
    this.rules_ = {};
  };

  // ---------THESE METHODS SHOULD NOT BE INVOKED EXTERNALLY---------

  /**
   * Converts CSS properties string into object.
   * Input: 'x:y;a:b;'
   * Ouput: {x:'y',a:'b'}
   * @public
   */
  CssCache.prototype.propertiesToObject_ = function(properties) {
    var output = {};
    // Split into array of substrings based on the delimiter ';'.
    var propertyList = properties.split(';');
    propertyList.forEach(function(property) {
      // Split into array of key value pairs based on first occurence of ':'
      var pair = property.split(/:(.+)/);
      if (pair[0] && pair[1]) {
        output[pair[0].trim()] = pair[1].trim();
      }
    });
    return output;
  };

  return CssCache;
});
