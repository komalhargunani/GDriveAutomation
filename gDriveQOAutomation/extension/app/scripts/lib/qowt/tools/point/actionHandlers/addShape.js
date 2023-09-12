// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Slide tool action handler to handle requestAction for
 * to draw a shape on slide.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub'
], function(PubSub) {

  'use strict';

  /**
   * Handles add shape operation of shape from context
   * @param {object} actionData context of shape
   * @private
   */
  var _handleAddShapeAction = function(actionData) {
    actionData.context.contentType = 'slide';
    PubSub.publish('qowt:doAction', actionData);
  };

  var _api = {
    supportedActions: ['addShape'],
    callback: _handleAddShapeAction
  };
  return _api;
});
