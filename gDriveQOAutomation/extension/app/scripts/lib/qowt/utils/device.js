
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This module encapsualtes information about device-specific
 * capabilities. It's API is thus a group of getters for device capabilities.
 *
 */

define([], function() {

  'use strict';

  var _api = {

    /**
     * Query if this device has touch capability.
     * @returns {boolean} True if touch capability is present, otherwise False.
     */
    'isTouchDevice': function() {
      return ('ontouchstart' in window);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
 