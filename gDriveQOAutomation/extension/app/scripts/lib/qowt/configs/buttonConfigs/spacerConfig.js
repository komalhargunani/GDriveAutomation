// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Defines a spacer widget used to visually group related items.
 */

/**
 * Return a button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {string} config.contentType Optional contentType.
 *                If present the widget will directly signal 'doAction'
 *                If absent the widget the will signal 'requestAction'
 */
define([], function() {

  'use strict';

  return {
    type: 'spacer'
  };

});