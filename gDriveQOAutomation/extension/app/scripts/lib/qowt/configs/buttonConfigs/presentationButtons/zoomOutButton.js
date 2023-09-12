// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'zoom out' toolbar button for presentation by
 * extending the generic toolbar button to include a specific content type.
 * Returns a button configuration.
 *
 */

define([
    'qowtRoot/configs/buttonConfigs/zoomOutBase'
  ], function(
    ZoomOutConfig) {

  'use strict';

  var config = ZoomOutConfig.create();
  config.contentType = 'presentation';
  return config;
});
