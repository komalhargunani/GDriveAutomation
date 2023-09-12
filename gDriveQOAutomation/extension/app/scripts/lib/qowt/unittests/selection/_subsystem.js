
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'selection',

    suites: [
      'unitTestRoot/selection/helpers/shapeHelper-test',
      'unitTestRoot/selection/selectionManager-test',
      'unitTestRoot/selection/sheetSelectionManager-test'
    ]
  };

  return _api;
});

