
// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'promise',

    suites: [
   'unitTestRoot/promise/deferred-test',
   'unitTestRoot/promise/queue-test',
   'unitTestRoot/promise/worker-test'
   ]
  };

  return _api;
});

