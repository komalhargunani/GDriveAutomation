// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'controls',

    suites: [
      'unitTestRoot/controls/point/animation/animationContainer-test',
      'unitTestRoot/controls/point/animation/animationQueryContainer-test',
      'unitTestRoot/controls/point/animation/initialSetupEngine-test',
      'unitTestRoot/controls/point/animation/queueEngine-test',
      'unitTestRoot/controls/point/animation/goBackEngine-test',
      'unitTestRoot/controls/point/animation/transitionManager-test',
      'unitTestRoot/controls/point/presentation-test',
      'unitTestRoot/controls/point/slide-test',
      'unitTestRoot/controls/point/thumbnailStrip-test',
      'unitTestRoot/controls/sheet/autocompleteHandler-test',
      'unitTestRoot/controls/sheet/chartSheetManager-test',
      'unitTestRoot/controls/sheet/floaterManager-test',
      'unitTestRoot/controls/sheet/paneManager-test',
      'unitTestRoot/controls/sheet/workbook-test'
    ]
  };

  return _api;
});

