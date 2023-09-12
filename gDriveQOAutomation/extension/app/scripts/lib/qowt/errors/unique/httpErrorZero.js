define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for HTTPErrorZero's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var HTTPErrorZero = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialized correctly
    this.title = 'http_error_zero_short_msg';
    this.details = 'http_error_zero_msg';
    this.gaState = 'HTTPErrorZero';

    QOWTException.apply(this, arguments);
    this.name = 'HTTPErrorZero';
    this.message = 'HTTP ERROR: 0';
    Error.captureStackTrace(this, HTTPErrorZero);
  };

  HTTPErrorZero.prototype = Object.create(QOWTException.prototype);
  HTTPErrorZero.prototype.constructor = HTTPErrorZero;

  return HTTPErrorZero;
});
