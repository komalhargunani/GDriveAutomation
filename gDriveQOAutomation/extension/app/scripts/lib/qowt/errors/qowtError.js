/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT Error object. Throw this to get a
 * modal dialog (eg non fatal).
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/localisedError'
], function(LocalisedError) {

  'use strict';

  var QOWTError = function() {
    LocalisedError.apply(this, arguments);
    this.name = 'QOWTError';
    Error.captureStackTrace(this, QOWTError);
    this.fatal = false;
  };

  QOWTError.prototype = Object.create(LocalisedError.prototype);
  QOWTError.prototype.constructor = QOWTError;

  // make this available on the global window object to make casting of
  // errors across the message bus easier
  window.QOWTError = QOWTError;

  return QOWTError;
});