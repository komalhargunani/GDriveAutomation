// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles slide move action.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(
    PubSub) {

  'use strict';

  /**
   * Handles slide move from context
   * @param {object} actionData context of slide
   */
  var handleSlideMove_ = function(actionData) {
    actionData.context.contentType = 'slideManagement';
    PubSub.publish('qowt:doAction', actionData);
  };

  var api_ = {
    supportedActions: ['moveSlide'],

    callback: handleSlideMove_
  };

  return api_;
});
