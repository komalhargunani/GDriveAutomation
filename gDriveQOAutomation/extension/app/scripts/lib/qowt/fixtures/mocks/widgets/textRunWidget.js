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
 * dummy text run widget with a creationCounter to test how ofter
 * this widget gets created
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
            balance: function() {
              return undefined;
            },

            addWidow: function() {
              return undefined;
            },

            addOrphan: function() {
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
