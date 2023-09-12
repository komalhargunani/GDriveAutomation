/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal exception when opening password protected documents.
 * Contains the correct UI for the user messaging, and the right
 * google analytics state. Allows you to pass in a message for
 * more detailed GA exception logging (as opposed to only the
 * application state)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for PasswordError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var PasswordError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'error_password_required_short_msg';
    this.details = 'error_password_required_msg';
    this.gaState = 'PasswordProtected';

    QOWTException.apply(this, arguments);
    this.name = 'PasswordError';
    Error.captureStackTrace(this, PasswordError);
  };

  PasswordError.prototype = Object.create(QOWTException.prototype);
  PasswordError.prototype.constructor = PasswordError;

  return PasswordError;
});