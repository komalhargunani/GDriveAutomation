define([
  'qowtRoot/errors/qowtException'
], function(
  QOWTException) {

  'use strict';

  /**
   * An error that is raised when detect a file format that we have not yet
   * implemented support for. Allows you to pass in a message for more
   * detailed GA exception logging (as opposed to only the application state).
   * @constructor
   */
  var UnsupportedFileFormat = function() {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'unsupported_file_format_error_title';
    this.details = 'unsupported_file_format_error_details_p1';
    this.gaState = 'UnsupportedFileFormat';

    QOWTException.apply(this, arguments);
    this.name = 'UnsupportedFileFormat';
    Error.captureStackTrace(this, UnsupportedFileFormat);

    // TODO(jonbronson) Make this error non-fatal and provide user an option
    // to convert to docs format.
  };

  UnsupportedFileFormat.prototype = Object.create(QOWTException.prototype);
  UnsupportedFileFormat.prototype.constructor = UnsupportedFileFormat;

  return UnsupportedFileFormat;
});
