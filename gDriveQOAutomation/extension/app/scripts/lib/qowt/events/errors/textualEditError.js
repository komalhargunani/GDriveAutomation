/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview fatal error for when any of the textual
 * editing commands failed to revert.
 * This is fatal because if we can not revert after a core
 * failure, then our HTML will be out of sync with the core.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';

  var _factory = {

    errorId: 'textual_edit_error',
    create: function() {

      // use module pattern for instance object
      var module = function() {

        var evt = ErrorEvent.create();

        evt.errorId = _factory.errorId;
        evt.fatal = true;

        return evt;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
