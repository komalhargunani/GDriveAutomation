// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles selection of slides.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 * @author amol.kulkarni@synerzip.com (Amol Kulkarni)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles slide selection from context
   * @param {object} actionData context of slide
   * @private
   */
  var _handleSlideSelect = function(actionData) {
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    //Actions supported by this actionHandler
    supportedActions: ['slideSelect'],

    //Callback for handling slide selection from context
    callback: _handleSlideSelect
  };

  return _api;
});
