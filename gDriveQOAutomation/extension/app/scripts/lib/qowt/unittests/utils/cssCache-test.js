/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit tests for the CssCache module.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/cssCache'
], function(
  CssCache) {

  'use strict';

  describe('utils/cssCache', function() {

    /**
     * CssCache instance to be tested.
     */
    var cssCache_;

    beforeEach(function() {
      cssCache_ = new CssCache();
      expect(cssCache_).toBeDefined();
    });

    afterEach(function() {
      cssCache_ = undefined;
    });

    it('should add a new rule to the cache', function() {
      cssCache_.addRule('#selector', 'color:red; size:14pt;');
      var rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;');

      var rulesObject = {color: 'red', size: '18pt'};
      cssCache_.addRule('.class', rulesObject);
      rule = cssCache_.getRuleAsString('.class');
      expect(rule).toBe('color:red;size:18pt;');
    });

    it('should update a new rule to the cache', function() {
      cssCache_.updateRule('#selector', 'color:red; size:14pt;');
      var rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;');

      var rulesObject = {color: 'red', size: '18pt'};
      cssCache_.updateRule('.class', rulesObject);
      rule = cssCache_.getRuleAsString('.class');
      expect(rule).toBe('color:red;size:18pt;');
    });

    it('should update a rule string to the cache', function() {
      cssCache_.addRule('#selector', 'color:red;size:14pt;');
      var rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;');

      cssCache_.updateRule('#selector', 'font-weight:bold;');
      rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;font-weight:bold;');

      cssCache_.updateRule('#selector', 'color:blue;size:20pt;');
      rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:blue;size:20pt;font-weight:bold;');
    });

    it('should update a rule object to the cache', function() {
      var rulesObject = {color: 'red', size: '18pt'};
      cssCache_.updateRule('.class', rulesObject);
      var rule = cssCache_.getRuleAsString('.class');
      expect(rule).toBe('color:red;size:18pt;');

      cssCache_.updateRule('.class', {display: 'inline'});
      rule = cssCache_.getRuleAsString('.class');
      expect(rule).toBe('color:red;size:18pt;display:inline;');
    });

    it('should remove rule from the cache', function() {
      cssCache_.addRule('#selector', 'color:red; size:14pt;');
      var rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;');

      cssCache_.removeRule('#selector');
      rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBeUndefined();
    });

    it('should get all rules from the cache', function() {
      cssCache_.addRule('#selector', 'color:red; size:14pt;');
      var rulesObject = {color: 'red', size: '18pt'};
      cssCache_.addRule('.class', rulesObject);

      var allRules = cssCache_.getAllRules();
      expect(allRules).toBe('#selector {color:red;size:14pt;} ' +
                            '.class {color:red;size:18pt;} ');
    });

    it('should clone rule and add to cache', function() {
      cssCache_.addRule('#srcSelector', 'color:red; size:14pt;');
      cssCache_.cloneRule('#srcSelector', '#desSelector');
      var allRules = cssCache_.getAllRules();
      expect(allRules).toBe('#srcSelector {color:red;size:14pt;} ' +
                            '#desSelector {color:red;size:14pt;} ');
    });

    it('should clear cache', function() {
      cssCache_.addRule('#selector', 'color:red; size:14pt;');
      var rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBe('color:red;size:14pt;');

      cssCache_.clearCache();
      rule = cssCache_.getRuleAsString('#selector');
      expect(rule).toBeUndefined();
    });
  });
});
