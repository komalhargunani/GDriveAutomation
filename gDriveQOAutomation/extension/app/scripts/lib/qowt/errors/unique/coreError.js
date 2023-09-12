/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview This error is used to encapsulate
 * an error object returned from core.
 *
 * @author jonbronson@google.com (Jonathan Bronson)
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for CoreError's
   *
   * @param {String|Object} error   core JSON object
   */
  var CoreError = function(error) {
    error = error || {};
    this.title = error.title;
    this.details = error.details;
    QOWTException.apply(this, error);

    // override conflicting base object values
    this.name = error.name;
    this.message = error.message;
    this.origin = error.origin;

    Error.captureStackTrace(this, CoreError);
  };

  CoreError.prototype = Object.create(QOWTException.prototype);
  CoreError.prototype.constructor = CoreError;

  return CoreError;
});