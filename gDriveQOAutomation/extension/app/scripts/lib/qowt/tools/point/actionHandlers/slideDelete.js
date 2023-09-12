// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles slide delete action.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(
    PubSub) {

  'use strict';

  /**
   * Handles slide delete from context
   * @param {object} actionData context of slide
   */
  var _handleSlideDelete = function(actionData) {
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    supportedActions: ['deleteSlide'],

    callback: _handleSlideDelete
  };

  return _api;
});
