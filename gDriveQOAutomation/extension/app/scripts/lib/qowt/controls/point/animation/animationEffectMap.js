// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the animation effect map.
 * This intends to map the presetID in the common time node to the right
 * animation effect.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([], function() {

  'use strict';

  /**
   * map: key: preset ID -> value: animation effect.
   *
   * Fade is the default animation effect.
   */
  var effectMap = {};
  effectMap[1] = "appear";
  effectMap[2] = "fly";
  effectMap[10] = "fade";

  return effectMap;
});