// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * selecting a shape and deselecting a shape.
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
  var _handleShapeSelection = function(actionData) {
    actionData.contentType = 'shape';
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {

    supportedActions: ['select', 'deselect'],

    callback: _handleShapeSelection
  };

  return _api;
});
