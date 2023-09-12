
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A mock optimistic command that does not call the service.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
    'qowtRoot/commands/commandBase',
  ], function(
    CommandBase) {

  'use strict';

  var _factory = {

    create: function(defaultValue1) {

      // use module pattern for instance object
      var module = function() {

          // Notice the arguments of optimistic = true, callsService = false
          var _api = CommandBase.create('optimisticOnlyCmd', true, false);

          var _dynamicData = defaultValue1 || "default";

          /**
           * Optional
           * Only relevant for optimistic commands
           * This is where, for an optimistic command you implement the
           * optimisitc hanlding. eg, insert text formatting at cursor
           * @method doOptimistic()
           */
          _api.doOptimistic = function() {
            return true;
          };

          /**
           * Optional
           * Only relevant for optimistic commands
           * This is the counterpart to doOptimistic() where you implement
           * the revert behaviour when you have to revert the optimistic
           * processing
           * @method doRevert()
           */
          _api.doRevert = function() {
            return true;
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


 