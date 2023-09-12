define([
  'qowtRoot/errors/qowtException'
], function(
    QOWTException) {

  'use strict';

  /**
   * An error that is raised when an HTTP Error 404 occurs.
   * @constructor
   */
  var HTTPErrorFileNotFound = function() {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialized correctly
    this.title = 'temporary_unable_to_open_error_short_msg';
    this.details = 'temporary_unable_to_open_error_msg';
    this.gaState = 'HTTPErrorFileNotFound';

    QOWTException.apply(this, arguments);
    this.name = 'HTTPErrorFileNotFound';
    this.message = 'HTTP ERROR: 404';
    Error.captureStackTrace(this, HTTPErrorFileNotFound);
  };

  HTTPErrorFileNotFound.prototype = Object.create(QOWTException.prototype);
  HTTPErrorFileNotFound.prototype.constructor = HTTPErrorFileNotFound;

  return HTTPErrorFileNotFound;
});
