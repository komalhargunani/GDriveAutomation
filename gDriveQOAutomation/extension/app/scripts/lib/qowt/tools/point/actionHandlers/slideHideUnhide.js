// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles hide and unhide actions.
 *
 * @author amol.kulkarni@synerzip.com (Amol Kulkarni)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(
    PubSub) {

  'use strict';

  /**
   * Handles slide hide/unhide from context
   * @param {object} actionData context of slide
   */
  var _handleSlideHideUnhide = function(actionData) {
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    supportedActions: ['showSld', 'hideSld'],

    callback: _handleSlideHideUnhide
  };

  return _api;
});
