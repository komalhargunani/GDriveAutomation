/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview this is an error observer which will
 * deactivate QOWT for fatal errors so that we dont
 * "continue on" behind the fatal error UI
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/pubsub/pubsub'
  ], function(PubSub) {

  'use strict';

  function handleError(error) {

    if (error.fatal) {
      PubSub.publish('qowt:disable',{});
    }
  }

  return handleError;
});