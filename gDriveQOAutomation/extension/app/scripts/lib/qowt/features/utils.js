/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview This utility module can be used to check
 * wether or not particular features (such as edit) are
 * enabled or not. In addition you can also make runtime
 * checks to see if you are running a debug or release
 * version of the app.
 *
 * NOTE: you can also use this utility to enable or disable
 * features at run time. This can be useful from the
 * console inspector to test out various things.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */



define([
  'qowtRoot/features/pack'], function(FeaturePack) {

  'use strict';

  var _api = {
    isEnabled: function(feature) {
      var setting = FeaturePack[feature];
      return (setting === undefined) ?
        false :
        setting;
    },

    /**
     * ability to turn a feature on at run time
     * mostly used for debugging purposes
     *
     * @param {string} feature the feature to enable
     */
    enable: function(feature) {
      FeaturePack[feature] = true;
    },

    /**
     * ability to turn a feature off at run time
     * mostly used for debugging purposes
     *
     * @param {string} feature the feature to disable
     */
    disable: function(feature) {
      FeaturePack[feature] = false;
    },

    /**
     * override existing pack with specific features
     *
     * @param overrides {object} override features
     */
    setOverrides: function(overrides) {
      for (var prop in overrides) {
        if (overrides.hasOwnProperty(prop)) {
          FeaturePack[prop] = overrides[prop];
        }
      }
    },


    /**
     * Returns whether or not this is a debug build. setDebugOverride can be
     * used to override this value with an arbitrary value.
     * @returns {boolean} true for debug builds.
     */
    isDebug: function() {
      // Unit tests can be run non-templatized, and we want them to run in debug
      // mode. The below comparison should return true when there's no
      // substitution.
      return (_debugOverride !== undefined) ?
          _debugOverride : (!_api.isEnabled('isRelease'));
    },

    /**
     * Overrides isDebug with an arbitrary return value. This only affects the
     * behavior of the isDebug method above. The debug/release build switch
     * affects other things, like the set of modules that get loaded. This
     * overrider does not affect those things at all. This should only be called
     * from tests.
     * @param debugOverride {boolean} the value to return from isDebug.
     */
    setDebugOverride: function(debugOverride) {
      _debugOverride = debugOverride;
    },

    /**
     * Clears the debug override, making isDebug revert back to normal behavior.
     */
    clearDebugOverride: function() {
      _debugOverride = undefined;
    }
  };

  var _debugOverride;

  return _api;
});
