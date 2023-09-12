/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mock for page num field widget
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _factory = {

    creationCounter: 0,

    create: function() {

      _factory.creationCounter++;

      // use module pattern for instance object
      var module = function() {

          var _api = {
            update: function() {
              return undefined;
            }
          };

          return _api;
        };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});