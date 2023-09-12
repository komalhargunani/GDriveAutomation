// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview non-fatal error for when row deletion fails.
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

      evt.errorId = "sheet_delete_row_error";
      evt.fatal = false;

      return evt;
    }
  };

  return factory_;
});
