// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * resizing a shape.
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
  var _handleShapeResize = function(actionData) {
    // Check first action from actionData is available in supportedActions
    if (_api.supportedActions.indexOf(actionData.action) !== -1) {
      actionData.context.contentType = 'shape';
      PubSub.publish('qowt:doAction', actionData);
    }
  };

  var _api = {

    supportedActions: ['resize'],

    callback: _handleShapeResize
  };

  return _api;
});
