define([
  'qowtRoot/errors/qowtException'
], function(
  QOWTException) {

  'use strict';

  /**
   * An error that is raised when no file reference is available.
   * Allows you to pass in a message for more detailed GA exception logging
   * (as opposed to only the application state).
   * @constructor
   */
  var FileDoesNotExistError = function() {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'file_does_not_exist_error_title';
    this.details = 'file_does_not_exist_error_details';
    this.gaState = 'FileDoesNotExistError';

    QOWTException.apply(this, arguments);
    this.name = 'FileDoesNotExistError';
    Error.captureStackTrace(this, FileDoesNotExistError);
  };

  FileDoesNotExistError.prototype = Object.create(QOWTException.prototype);
  FileDoesNotExistError.prototype.constructor = FileDoesNotExistError;

  return FileDoesNotExistError;
});
