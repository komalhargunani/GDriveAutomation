
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a toolbar button for Word Paragraph Styles by extending
 * the generic toolbar button and providing a custom filter for the data model.
 * Returns a button configuration.
 * @author dskelton@google.com (Duncan Skelton)
 *
 */

define([
    'qowtRoot/configs/buttonConfigs/styleButtonBase',
    'qowtRoot/utils/filters/paragraphStyleNameFilter'
  ], function(
    StyleButtonFactory,
    StyleNameFilter
  ) {

  'use strict';

  var config = StyleButtonFactory.create(
      StyleNameFilter.filter,
      StyleNameFilter.sort);
  return config;
});
