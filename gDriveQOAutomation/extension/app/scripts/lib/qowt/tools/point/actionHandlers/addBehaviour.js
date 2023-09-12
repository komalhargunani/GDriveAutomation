// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Slide tool action handler to handle requestAction for
 * initialising the a events to draw a shape.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles add shape initialisation action for shape from context
   * @param {object} actionData context of shape
   * @private
   */
  var _handleInitAction = function(actionData) {
    actionData.context.contentType = 'slide';
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    supportedActions: ['initAddShape'],
    callback: _handleInitAction
  };
  return _api;
});
