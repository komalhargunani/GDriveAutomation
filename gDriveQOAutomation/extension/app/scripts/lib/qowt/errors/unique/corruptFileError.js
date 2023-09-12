/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal exception when opening corrupt documents.
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
   * c'tor for CorruptFileError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var CorruptFileError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'file_open_error_short_msg';
    this.details = 'file_open_error_msg';
    this.gaState = 'CorruptFile';

    QOWTException.apply(this, arguments);
    this.name = 'CorruptFileError';
    Error.captureStackTrace(this, CorruptFileError);
  };

  CorruptFileError.prototype = Object.create(QOWTException.prototype);
  CorruptFileError.prototype.constructor = CorruptFileError;

  return CorruptFileError;
});