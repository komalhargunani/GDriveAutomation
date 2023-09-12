/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview suite wrapper for qowt
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'Events QOWT tests',

    suites: [
      'unitTestRoot/events/qowt-test'
    ]
  };

  return _api;
});

