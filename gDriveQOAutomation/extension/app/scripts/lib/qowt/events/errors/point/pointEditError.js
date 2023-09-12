// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * Generic Error module for point edit.
 * This can be used as the base module for point edit error events.
 *
 * Specific errors can derive from this guy and override what they need.
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';

  var _factory = {

    create: function(errorId, fatal) {

      // use module pattern for instance object
      var module = function() {

        var evt = ErrorEvent.create();

        evt.errorId = errorId;
        evt.fatal = fatal;

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
