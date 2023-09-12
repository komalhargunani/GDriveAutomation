/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * TODO WRITE ME
 */
define([
  'qowtRoot/events/errors/generic'
  ], function(GenericErrorEvent) {

  'use strict';



  var _factory = {

    errorId: "delete_file_error",
    create: function() {

      // use module pattern for instance object
      var module = function() {

        var evt = GenericErrorEvent.create();
        evt.errorId = _factory.errorId;

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
