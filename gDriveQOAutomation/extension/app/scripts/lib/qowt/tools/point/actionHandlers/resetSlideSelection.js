// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file handles resetting selection of slides.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles reset selection for given context
   * @param {object} actionData context
   * @private
   */
  var _handleResetSlideSelection = function(actionData) {
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    //Actions supported by this actionHandler
    supportedActions: ['resetSlideSelection'],

    //Callback for handling reset selection for slide from context
    callback: _handleResetSlideSelection
  };

  return _api;
});
