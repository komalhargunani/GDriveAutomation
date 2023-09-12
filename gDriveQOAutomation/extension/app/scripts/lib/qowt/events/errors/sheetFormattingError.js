// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Command-specific error for a failed formatCells command.
 * We were unable to set a particular formatting property (eg. bold, italic,
 * fort face, etc).
 */

define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';



  var _factory = {

    errorId: 'sheet_format_cells_error',
    create: function() {

      // use module pattern for instance object
      var module = function() {

        var evt = ErrorEvent.create();

        evt.errorId = _factory.errorId;
        evt.fatal = false;

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
