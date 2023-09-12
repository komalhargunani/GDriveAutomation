/*!
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * This error message is for files which are secured through Microsoft
 * Information Right Management.
 */
define(['qowtRoot/events/errors/generic'], function(ErrorEvent) {

  'use strict';



  var _factory = {

    errorId: 'error_password_required',

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
