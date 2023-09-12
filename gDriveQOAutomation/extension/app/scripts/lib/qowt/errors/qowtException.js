/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal qowt exception object. Used for exceptions
 * like NaCl crashed, where the user can not continue (eg fatal error)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/localisedError'
], function(LocalisedError) {

  'use strict';

  var QOWTException = function() {
    LocalisedError.apply(this, arguments);
    this.name = 'QOWTException';
    Error.captureStackTrace(this, QOWTException);
    this.fatal = true;
  };

  QOWTException.prototype = Object.create(LocalisedError.prototype);
  QOWTException.prototype.constructor = QOWTException;

  // make this available on the global window object to make casting of
  // errors across the message bus easier
  window.QOWTException = QOWTException;

  return QOWTException;
});