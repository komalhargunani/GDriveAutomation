/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview error for when any of editing commands
 * in sheet failed to redo
 *
 * @author Venkatraman@google.com (Venkatraman Jeyaraman)
 */


define(
  ['qowtRoot/events/errors/generic'],
  function(ErrorEvent) {

  'use strict';

  var factory_ = {

    create: function() {
        var evt_ = ErrorEvent.create();

        evt_.errorId = "redo";
        evt_.fatal = false;

        return evt_;
    }
  };
  return factory_;
});