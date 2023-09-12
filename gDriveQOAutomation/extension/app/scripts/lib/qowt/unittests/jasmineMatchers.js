/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview custom matchers for jasmine
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var api_ = {
    toBeOptimisticIdle: function() {
      return !this.actual.hasOptimisticPhaseStarted();
    },
    toBeResponseIdle: function() {
      return !this.actual.hasDcpPhaseStarted();
    },
    toBeEither: function(arrayValues) {
      if (!_.isArray(arrayValues)) {
        // if we didn't get an array, then turn the arguments in to one
        arrayValues = Array.prototype.slice.call(arguments);
      }
      for (var i = 0; i < arrayValues.length; i++) {
        if (this.actual === arrayValues[i]) {
          return true;
        }
      }
      return false;
    },
    toBeFunction: function() {
      return (typeof this.actual === 'function');
    },
    toBeArray: function() {
      var toString_ = Object.prototype.toString;
      return (toString_.call(this.actual) === '[object Array]');
    },
    toBeElement: function() {
      return (!!(this.actual && this.actual.nodeType));
    },

    /**
     * Matcher that will check that a particular Error has been thrown
     * NOTE: It will match if the actual exception is instanceof Error and
     * if it contains the properties of the expected Error. Not the other
     * way around! (thereby we dont for example fail due to mismatched
     * stack traces)
     *
     * @param {Error} expected the expected Error object
     * @param {boolean} matchMessage true if we should match error.message
     */
    toThrowError: function(expected, matchMessage) {
      var result = false;
      var exception;
      var mismatchedKeys = [];

      if (!(expected instanceof Error)) {
        throw new Error('toThrowError requires Error as argument');
      }
      if (typeof this.actual !== 'function') {
        throw new Error('toThrowError requires a function as input');
      }
      try {
        this.actual();
      } catch (e) {
        exception = e;
      }
      if (exception) {
        if (exception instanceof Error) {
          // use getOwnPropertyNames to also get non-enumerable props
          var keys = Object.getOwnPropertyNames(expected);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            // ignore stack traces; no point in comparing those
            // and only match message of the error if matchMessage is true
            if (key.toLowerCase() !== 'stack' &&
              (key.toLowerCase() !== 'message' || matchMessage)) {
              if (exception[key] !== expected[key]) {
                mismatchedKeys.push(key);
              }
            }
          }
          result = (mismatchedKeys.length === 0);
        }
      }

      var not = this.isNot ? 'not ' : '';

      this.message = function() {
        if (exception) {
          var str = 'Expected function ' + not +
            'to throw error with properties: ';
          for (var i = 0; i < mismatchedKeys.length; i++) {
            var key = mismatchedKeys[i];
            str += key + '="' + expected[key] + '" but got ' +
              key + '="' + exception[key] + '"; ';
          }
          return str;
        } else {
          return 'Expected function to throw an exception, but it did not.';
        }
      };

      return result;
    },

    toHaveBorder: function(border) {
      var hasCorrectBorder = true;
      for (var key in border) {
        hasCorrectBorder = hasCorrectBorder &&
            (this.actual.style[key] === border[key]);
      }
      return hasCorrectBorder;
    }
  };

  var zeroQueuedMatcher_ = function() {
    this.message = function() {
      return 'Expected command manage to be empty';
    };
    return this.actual.isEmpty();
  };

  api_.toBeZeroQueuedCommandsBeforeStarting = zeroQueuedMatcher_;
  api_.toBeZeroQueuedCommandsAfterTestSpec = zeroQueuedMatcher_;
  api_.toBeZeroQueuedRequestsBeforeStarting = zeroQueuedMatcher_;
  api_.toBeZeroQueuedRequestsAfterTestSpec = zeroQueuedMatcher_;

  return api_;
});