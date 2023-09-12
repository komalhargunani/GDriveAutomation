/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Helper for implementing retries with backoff. Initial retry
 * delay is 1 second, increasing by 2x (+jitter) for subsequent retries
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var RetryHandler = function() {
    this.interval = 1000; // Start at one second
    this.maxInterval = 60 * 1000; // Don't wait longer than a minute
  };

  RetryHandler.prototype = {
    __proto__: Object.prototype,

    /**
     * @return {boolean} returns true if max interval has been reached
     */
    maxedOut: function() {
      return this.interval > this.maxInterval;
    },

    /**
     * Invoke the function after waiting
     *
     * @param {function} fn Function to invoke
     */
    retry: function(fn) {
      setTimeout(fn, this.interval);
      this.interval = this.nextInterval_();
    },

    /**
     * Reset the counter (e.g. after successful request.)
     */
    reset: function() {
      this.interval = 1000;
    },

    /**
     * Calculate the next wait time.
     * @return {number} Next wait interval, in milliseconds
     *
     * @private
     */
    nextInterval_: function() {
      var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
      return Math.min(interval, this.maxInterval);
    },

    /**
     * Get a random int in the range of min to max.
     * Used to add jitter to wait times.
     *
     * @param {number} min Lower bounds
     * @param {number} max Upper bounds
     * @private
     */
    getRandomInt_: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

  };

  return RetryHandler;
});













