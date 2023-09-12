// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * moving a shape.
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */
define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles shape transformation for shape from context
   * @param {object} actionData context of shape
   */
  var _handleShapeMove = function(actionData) {
    actionData.context.contentType = 'shape';
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {

    supportedActions: ['move'],

    callback: _handleShapeMove
  };

  return _api;
});
