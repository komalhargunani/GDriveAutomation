/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview silent qowt error. Can be used to throw an
 * error, which will be for example logged to Google Analytics
 * but which will not show any ui to the user. That helps us
 * silently log error cases and make triaging of features/bugs
 * easier.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/localisedError'
], function(LocalisedError) {

  'use strict';

  var QOWTSilentError = function() {
    LocalisedError.apply(this, arguments);
    this.name = 'QOWTSilentError';
    Error.captureStackTrace(this, QOWTSilentError);
    this.fatal = false;
    this.silent = true;
  };

  QOWTSilentError.prototype = Object.create(LocalisedError.prototype);
  QOWTSilentError.prototype.constructor = QOWTSilentError;

  // make this available on the global window object to make casting of
  // errors across the message bus easier
  window.QOWTSilentError = QOWTSilentError;

  return QOWTSilentError;
});