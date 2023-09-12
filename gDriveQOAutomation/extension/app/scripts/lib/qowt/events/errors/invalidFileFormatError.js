
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Qowt error module factory for creating instances of
 * 'invalid file format' errors.
 *
 * This error will typically be created by clients that are processing the
 * failure responses to file-opening commands.
 *
 * The intent is to tell the use that the targetted file is actively recognised
 * to not be any Office file that our app currently supports.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';

  var _factory = {

    errorId: 'invalid_file_format',
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
