/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview if any of our textual edit commands fail
 * we throw this fatal error, which will tall the user to
 * reload their document
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for TextualEditError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var TextualEditError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'textual_edit_error_short_msg';
    this.details = 'textual_edit_error_msg';
    this.gaState = 'TextualEditError';

    QOWTException.apply(this, arguments);
    this.name = 'TextualEditError';
    Error.captureStackTrace(this, TextualEditError);
  };

  TextualEditError.prototype = Object.create(QOWTException.prototype);
  TextualEditError.prototype.constructor = TextualEditError;

  return TextualEditError;
});