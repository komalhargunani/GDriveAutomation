// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'zoom out' toolbar button for documents by extending
 * the generic toolbar button to include a specific content type.
 * Returns a button configuration.
 * @author dskelton@google.com (Duncan Skelton)
 *
 */

define([
    'qowtRoot/configs/buttonConfigs/zoomOutBase'
  ], function(
    ZoomOutConfig) {

  'use strict';

  var config = ZoomOutConfig.create();
  config.contentType = 'document';
  return config;
});
