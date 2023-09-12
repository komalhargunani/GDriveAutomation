// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape tool action handler to handle requestAction for
 * modify shape transform.
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
  var _handleModifyTransform = function(actionData) {
    if (_api.supportedActions.indexOf(actionData.action) !== -1) {
      actionData.context.contentType = 'shape';
      PubSub.publish('qowt:doAction', actionData);
    }
  };

  var _api = {

    supportedActions: ['modifyTransform'],

    callback: _handleModifyTransform
  };

  return _api;
});
