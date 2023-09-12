define([
  'qowtRoot/errors/qowtException'
], function(
  QOWTException) {

  'use strict';

  /**
   * An error that represents a fatal exception when the nacl plugin fails to
   * load most likely reported using a timeout. Contains the correct UI for the
   * user messaging, and the right google analytics state. Allows you to pass in
   * a message for more detailed GA exception logging (as opposed to only the
   * application state)
   * @constructor
   */
  var NaclLoadError = function() {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'nacl_load_error_title';
    this.details = 'nacl_load_error_details';
    this.gaState = 'NaclLoadError';

    QOWTException.apply(this, arguments);
    this.name = 'NaclLoadError';

    Error.captureStackTrace(this, NaclLoadError);
  };

  NaclLoadError.prototype = Object.create(QOWTException.prototype);
  NaclLoadError.prototype.constructor = NaclLoadError;

  return NaclLoadError;
});