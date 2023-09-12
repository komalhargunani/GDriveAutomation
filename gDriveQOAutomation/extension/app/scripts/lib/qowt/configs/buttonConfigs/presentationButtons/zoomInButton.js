// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'zoom in' toolbar button for presentation by
 * extending the generic toolbar button to include a specific content type.
 * Returns a button configuration.
 *
 */

define([
    'qowtRoot/configs/buttonConfigs/zoomInBase'
  ], function(
    ZoomInConfig) {

  'use strict';

  var config = ZoomInConfig.create();
  config.contentType = 'presentation';
  return config;
});
