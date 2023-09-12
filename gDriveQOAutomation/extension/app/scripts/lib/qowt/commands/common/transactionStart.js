
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A simple command container that specifies a new transaction.
 * This means that all participating commands must be guaranteed to be atomic
 * as a whole, such that if on one the participating commands fail then
 * they all fail.
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/selection/selectionManager'
], function(
    CommandBase,
    SelectionManager) {

  'use strict';


  var _factory = {

    // create function takes cmdName, optimistic, callsService and
    // opt_includeContext so that other commands can derive from this class and
    // override these values.
    create: function(cmdName, optimistic, callsService, opt_includeContext) {

      // use module pattern for instance object
      var module = function() {

        // if not overridden, set defaults
        if (cmdName === undefined) {
          cmdName = 'txStart';
        }
        if (optimistic === undefined) {
          optimistic = false;
        }
        if (callsService === undefined) {
          callsService = true;
        }
        if (opt_includeContext === undefined) {
          opt_includeContext = false;
        }

        var _api =
            CommandBase.create(cmdName, optimistic, callsService);
        var _context;

        if (opt_includeContext) {
          _context = SelectionManager.snapshot();
        }

        /**
         * Return the data to be used as the payload.
         * The name property is mandatory.
         *
         * @return {Object} The JSON Payload data to send to the dcp service
         * @see TODO need dcp schema reference!
         */
        _api.dcpData = function() {
          var payload = {
            name: "txStart"
          };
          if (opt_includeContext) {
            payload.context = JSON.stringify(_context);
          }
          return payload;
        };

        /**
         * JELTE TODO - for now ignore errors since the core will not
         * yet support this command. But once it does, add error handling!
         */
        _api.onFailure = function(response, errorPolicy) {
          console.error(_api.name + " command - failed: " + response.e);
          if (errorPolicy) {
            errorPolicy.ignoreError = true;
            errorPolicy.eventDispatched = true;
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

