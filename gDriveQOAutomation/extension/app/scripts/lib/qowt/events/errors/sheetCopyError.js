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
define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';



  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var evt = ErrorEvent.create();

        evt.errorId = "copy sheet";
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
