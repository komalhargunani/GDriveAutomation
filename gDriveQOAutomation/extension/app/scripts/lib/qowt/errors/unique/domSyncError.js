/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview if we find a mismatch between our HTML
 * dom and the Core dom, then we throw this error, telling
 * the user to reload the page
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/qowtException'
], function(QOWTException) {

  'use strict';

  /**
   * c'tor for DomSyncError's
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var DomSyncError = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'qowt_doc_mismatch_title';
    this.details = 'qowt_doc_mismatch_text';
    this.gaState = 'DomSyncError';

    QOWTException.apply(this, arguments);
    this.name = 'DomSyncError';
    Error.captureStackTrace(this, DomSyncError);
  };

  DomSyncError.prototype = Object.create(QOWTException.prototype);
  DomSyncError.prototype.constructor = DomSyncError;

  return DomSyncError;
});