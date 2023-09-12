// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'zoom in' toolbar button for documents by extending
 * the generic toolbar button to include a specific content type.
 * Returns a button configuration.
 * @author dskelton@google.com (Duncan Skelton)
 *
 */

define([
    'qowtRoot/configs/buttonConfigs/zoomInBase'
  ], function(
    ZoomInConfig) {

  'use strict';

  var config = ZoomInConfig.create();
  config.contentType = 'document';
  return config;
});
