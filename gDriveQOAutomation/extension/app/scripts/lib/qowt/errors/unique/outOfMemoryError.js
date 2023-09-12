define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for OutOfMemoryError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var OutOfMemoryError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'out_of_memory_error_short_msg';
    this.details = 'out_of_memory_error_msg';
    this.nonRecoverable = true;
    this.gaState = 'OutOfMemory';

    QOWTException.apply(this, arguments);
    this.name = 'OutOfMemoryError';
    Error.captureStackTrace(this, OutOfMemoryError);
  };

  OutOfMemoryError.prototype = Object.create(QOWTException.prototype);
  OutOfMemoryError.prototype.constructor = OutOfMemoryError;

  return OutOfMemoryError;
});