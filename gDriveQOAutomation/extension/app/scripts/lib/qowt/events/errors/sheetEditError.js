/// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Command-specific error for a failed setCellContent command.
 * A user attempted to enter invalid text into a cell or cells.
 */

define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';



  var _factory = {

    errorId: 'sheet_set_cell_content_invalid_error',
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
