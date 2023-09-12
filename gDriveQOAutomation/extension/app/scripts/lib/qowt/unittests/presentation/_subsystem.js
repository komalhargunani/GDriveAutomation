
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'Presentation',

    suites: [
      'unitTestRoot/presentation/placeHolder/phStyleClassFactory-test',
      'unitTestRoot/presentation/placeHolder/placeHolderManager-test',
      'unitTestRoot/presentation/placeHolder/defaultTextStyleManager-test',
      'unitTestRoot/presentation/placeHolder/placeHolderTextStyleManager-test',
      'unitTestRoot/presentation/strategies/slideSelection-test',
      'unitTestRoot/presentation/explicitTextStyleManager-test',
      'unitTestRoot/presentation/layoutsManager-test',
      'unitTestRoot/presentation/slideCloneManager-test',
      'unitTestRoot/presentation/slideChartsManager-test',
      'unitTestRoot/presentation/slideZoomManager-test',
      'unitTestRoot/presentation/placeHolder/placeHolderPropertiesManager-test'
    ]
  };

  return _api;
});

