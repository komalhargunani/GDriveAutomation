// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview non-fatal error for when user tries to insert
 * too many rows in the sheet.
 * User is shown a notification and he can keep editing.
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/events/errors/generic'
  ], function(
    ErrorEvent) {

  'use strict';

  var factory_ = {

    create: function() {

      var evt = ErrorEvent.create();

      evt.errorId = "sheet_insert_row_exceed_error";
      evt.fatal = false;

      return evt;
    }
  };

  return factory_;
});

