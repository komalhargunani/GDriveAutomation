// Copyright 2013 Google Inc. All Rights Reserved.

define([], function() {

  'use strict';

  var api_ = {
    name: 'savestate',

    suites: [
        'unitTestRoot/savestate/saveNotificationHandler-test',
        'unitTestRoot/savestate/saveStateManager-test'
    ]
  };

  return api_;
});
