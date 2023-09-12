// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview
 * CSS Manager provides an API for writing and updating dynamically
 * generated css rules.
 *
 * Css rules are added to the document HEAD if they didn't exist already,
 * or replaced if they did exist.
 *
 * Rules may be written immediately to the DOM if they are set infrequently.
 * For clients that create many rules in a short space of time then these
 * can be added asynchronously. See addRule() and addRuleNow().
 *
 * Uses the CssCache container module to cache the CSS rules.
 * @see CssCache
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/cssCache'], function(
  PubSub,
  CssCache) {

  'use strict';

  /**
   * TODO: The function names in this module are confusing.
   * The majority of clients do not understand when to use addRule and when
   * to use addRuleNow. These functions names need to change and the API
   * to this module needs improving.
   */
  var api_ = {
    /**
     * Add a new dynamic style rule NOW. Meaning it is directly
     * added to the W3C Dom.
     * If there is already a dynamic rule for the selector
     * then it will be replaced.
     *
     * example use:
     *     CssManager.
     *     addRuleNow("#mySelector", {background: "red", size: "14pt"});
     * or:
     *     CssManager.addRuleNow(".foobar", "background: red");
     *
     * @param {string} selector The css selector for this rule.
     * @param {object|string} properties Either A json object containing
     *                                   the css properties you want to
     *                                   set, or a string containing the same
     *                                   if you use the API with a string,
     *                                   you do NOT need to add the
     *                                   curly brackets
     */
    addRuleNow: function(selector, properties) {
      cssCache_.addRule(selector, properties);
      api_.flushCache();
    },

    /**
     * Same as addRuleNow, except that this will be added to the
     * W3C DOM asynchronously. This is useful if you have many rules
     * to add and do not want to hit performance. Each call to this
     * function will debounce for 50ms.
     * You can also use "flushCache" to force all rules to be written
     * to the DOM
     * If there is already a dynamic rule for the selector
     * then it will be replaced.
     *
     * example use:
     *     CssManager.
     *     addRuleNow("#mySelector", {background: "red", size: "14pt"});
     * or:
     *     CssManager.addRuleNow(".foobar", "background: red");
     *
     * @param {string} selector The css selector for this rule.
     * @param {ojbect|string} properties Either A json object containing
     *                                   the css properties you want to
     *                                   set, or a string containing the same
     *                                   if you use the API with a string,
     *                                   you do NOT need to add the
     *                                   curly brackets
     */
    addRule: function(selector, properties, debounceTimer) {
      cssCache_.addRule(selector, properties);
      // debounce the timer
      cancelTimer_();
      debounceTimer = debounceTimer || kDebounceTimer_;
      timeoutID_ = window.setTimeout(writeRulesToDOM_, debounceTimer);
    },

    /**
     * On the lines of addRule, except that it first attempts to update a
     * preexisting css selector class otherwise simply creates a new one with
     * the passed rules.
     *
     * @param {String} selector  The css selector for this rule.
     * @param {Object|string} properties  Either A json object containing
     *                                    the css properties you want to
     *                                    set, or a string containing the same
     *                                    if you use the API with a string,
     *                                    you do NOT need to add the
     *                                    curly brackets
     * @param {number} debounceTimer
     */
    updateRule: function(selector, properties, debounceTimer) {
      cssCache_.updateRule(selector, properties);
      // debounce the timer
      cancelTimer_();
      debounceTimer = debounceTimer || kDebounceTimer_;
      timeoutID_ = window.setTimeout(writeRulesToDOM_, debounceTimer);
    },

    /**
     * Remove any css rule from the head.
     * Has no effect if the rule did not exist.
     * @param {string} selector The selector for the rule to remove.
     */
    removeRuleNow: function(selector) {
      cssCache_.removeRule(selector);
      api_.flushCache();
    },

    /**
     * Remove all custom style rules immediately.
     * Also clears the cache for pending writes.
     */
    removeAllRulesNow: function() {
      api_.clearCache();
      writeRulesToDOM_();
    },


    /**
     * Get the rules for a given selector.
     * @param {string} selector The selector for the rule to get.
     */
    getRuleAsString: function(selector) {
      return cssCache_.getRuleAsString(selector);
    },

    /**
     * Applies the css text from source selector to destination selector.
     * @param {string } srcSelector The selector from which to use the rule.
     * @param {string} desSelector The target selector to apply rules to.
     */
    cloneRule: function(srcSelector, desSelector) {
      cssCache_.cloneRule(srcSelector, desSelector);
    },

    /**
     * Force all cached rules to be written to the DOM. To be used
     * in conjunction with addRule (the asynchronous version)
     */
    flushCache: function() {
      cancelTimer_();
      writeRulesToDOM_();
    },

    /**
     * Drops all previously cached rules.
     * See also removeAllRules.
     * Note this does not remove any rules already written to the DOM.
     * The main use is in unit testing.
     */
    clearCache: function() {
      cssCache_.clearCache();
    },

    /**
     * Return the style element.
     * @return {W3C element | null} The style element or undefined.
     */
    getStyleElement: function() {
      return styleElement_;
    }
  };

  // PRIVATE ===================================================================

  /**
   * Style tag prefix to identify all dynamically written rules css.
   * @const
   */
  var RULE_PREFIX_ = 'qowt-dynamic-styles';

  var timeoutID_, styleElement_, cssCache_;

  /**
   * The time window within which rules added asynchronously will accumulate
   * in the cache prior to being written to the DOM. The smaller the timer value
   * the more the DOM will be written to.
   * Using a value of 0 here simply to break up execution where necessary.
   */
  var kDebounceTimer_ = 0;

  function cancelTimer_() {
    if (timeoutID_) {
      window.clearTimeout(timeoutID_);
      timeoutID_ = undefined;
    }
  }

  function writeRulesToDOM_() {
    // Note textContent is used below we should never use innerHTML. The latter
    // is evaluated and opens xxs attacks. The former is not.
    if (styleElement_) {
      var allRules = cssCache_.getAllRules();
      styleElement_.textContent = allRules;
    }
  }

  /**
   * Triggered by qowt:init signals
   * Initialize the module.
   */
  var initialized_ = false;
  function init_() {
    if (!initialized_) {
      styleElement_ = document.createElement('style');
      styleElement_.id = RULE_PREFIX_;
      document.getElementsByTagName('head')[0].appendChild(styleElement_);
      cssCache_ = new CssCache();
      initialized_ = true;
    }
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners,
   * and reset all internal state.
   */
  function disable_() {
    cancelTimer_();
    if (cssCache_) {
      cssCache_.clearCache();
    }
    cssCache_ = undefined;
    initialized_ = false;
  }

  /**
   * Triggered by qowt:destroy signals
   * Should remove any HTML elements and references
   * created by this module.
   */
  function destroy_() {
    if (styleElement_ && styleElement_.parentNode) {
      styleElement_.parentNode.removeChild(styleElement_);
    }
    styleElement_ = undefined;
  }

  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except
  // subscribe to qowt:init qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
    PubSub.subscribe('qowt:destroy', destroy_);
  })();

  return api_;

});
