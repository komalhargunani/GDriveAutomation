/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal exception when timing out while downloading a file.
 * Contains the right google analytics state. Allows you to pass in a message
 * for more detailed GA exception logging (as opposed to only the
 * application state)
 *
 * @author elqursh@google.com (Ali Elqursh)
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for TimeoutError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var TimeoutError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialized correctly
    this.gaState = 'TimeoutError';

    QOWTException.apply(this, arguments);
    this.name = 'TimeoutError';
    Error.captureStackTrace(this, TimeoutError);
  };

  TimeoutError.prototype = Object.create(QOWTException.prototype);
  TimeoutError.prototype.constructor = TimeoutError;

  return TimeoutError;
});
