// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * Defines an 'zoom out' button.
 *
 */

/**
 * Return a button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {string} config.contentType Optional contentType.
 *                If present the widget will directly signal 'qowt:doAction'
 *                If absent the widget the will signal 'qowt:requestAction'
 * @param returns {object} config.subscribe Optional set of signals with
 *                callbacks that give button behaviours.
 */
define([    'qowtRoot/configs/buttonConfigs/zoomOutBase'
], function(ZoomOutConfig) {

  'use strict';

  var config = ZoomOutConfig.create();
  config.contentType = 'workbook';
  return config;
});
