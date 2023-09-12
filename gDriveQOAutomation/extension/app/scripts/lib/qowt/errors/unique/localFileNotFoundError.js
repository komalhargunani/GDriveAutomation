define([
    'qowtRoot/errors/qowtException'
  ], function(QOWTException) {

    'use strict';

    /**
     * c'tor for LocalFileNotFoundError's
     *
     * @param {String|Object} opt_msg optional string or config object to pass
     *                                to base QOWTException c'tor.
     */
    var LocalFileNotFoundError = function(/* opt_msg */) {
      // unique details for this error; set these before base calling the
      // QOWTException c'tor so the this.message is initialized correctly
      this.gaState = 'LocalFileNotFoundError';

      QOWTException.apply(this, arguments);
      this.name = 'LocalFileNotFoundError';
      Error.captureStackTrace(this, LocalFileNotFoundError);
    };

    LocalFileNotFoundError.prototype = Object.create(QOWTException.prototype);
    LocalFileNotFoundError.prototype.constructor = LocalFileNotFoundError;

    return LocalFileNotFoundError;
  });