/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal exception when timing out while loading script.
 * Contains the right google analytics state. Allows you to pass in a message
 * for more detailed GA exception logging (as opposed to only the
 * application state).
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for ScriptLoadingTimeout
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var ScriptLoadingTimeout = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so that this.message is initialised correctly
    this.title = 'drive_open_timeout_error_short_msg';
    this.details = 'drive_open_timeout_error_msg';
    this.gaState = 'ScriptLoadingTimeout';
    QOWTException.apply(this, arguments);
    this.name = 'ScriptLoadingTimeout';
    Error.captureStackTrace(this, ScriptLoadingTimeout);
  };

  ScriptLoadingTimeout.prototype = Object.create(QOWTException.prototype);
  ScriptLoadingTimeout.prototype.constructor = ScriptLoadingTimeout;

  return ScriptLoadingTimeout;
});