// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * deleting a shape.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles shape transformation for shape from context
   * @param {object} actionData context of shape
   */
  var _handleShapeDelete = function(actionData) {
    actionData.context.contentType = 'shape';
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {

    supportedActions: ['deleteShape'],

    callback: _handleShapeDelete
  };

  return _api;
});
