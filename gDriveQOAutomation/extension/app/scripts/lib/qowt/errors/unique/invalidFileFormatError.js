/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal exception when opening a document with an invalid
 * file format
 *
 * Contains the correct UI for the user messaging, and the right
 * google analytics state. Allows you to pass in a message for
 * more detailed GA exception logging (as opposed to only the
 * application state)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/models/fileInfo',
  'qowtRoot/errors/qowtException'
], function(
  FileInfo,
  QOWTException) {

  'use strict';

  /**
   * c'tor for InvalidFileFormatError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var InvalidFileFormatError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'invalid_file_format_short_msg';
    this.details = 'invalid_file_format_msg';
    this.gaState = 'InvalidFileFormat';

    // Distinguish iff errors that occur during cache restore from
    // first time read iff errors
    if (FileInfo.entryPoint === 'restore') {
      this.gaState = 'InvalidFileFormatFromRestore';
    }

    QOWTException.apply(this, arguments);
    this.name = 'InvalidFileFormatError';
    Error.captureStackTrace(this, InvalidFileFormatError);
  };

  InvalidFileFormatError.prototype = Object.create(QOWTException.prototype);
  InvalidFileFormatError.prototype.constructor = InvalidFileFormatError;

  return InvalidFileFormatError;
});