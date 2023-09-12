// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles slide insert action.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(
    PubSub) {

  'use strict';

  /**
   * Handles slide insert from context
   * @param {object} actionData context of slide
   */
  var _handleSlideInsert = function(actionData) {
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    supportedActions: ['insertSlide'],

    callback: _handleSlideInsert
  };

  return _api;
});
