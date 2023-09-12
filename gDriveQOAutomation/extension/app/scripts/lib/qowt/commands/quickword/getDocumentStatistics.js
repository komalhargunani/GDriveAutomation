
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'getDocumentStatistics' command including
 * response behaviours.
 *
 * This is a non-optimistic command since it is a read-only command.
 * There are no specific response behaviours - the rerurned data is handled by
 * the appropriate dcp handler.
 * Failures in this command are ignored since it is a read-only command
 * supplying non-critical data.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/commandBase'
  ], function (
    CommandBase
  ) {

  'use strict';

  var _factory = {


    /**
     * Command to query document statistics.
     * This is a query command, so has nothing to render optimistically.
     *
     * @return {object} a new getDocumentStatistics command.
     */
    create: function () {

      // use module pattern for instance object
      var module = function () {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create('getDocumentStatistics', false, true);

        /**
         * Generates and returns a payload for this command.
         *
         * @return  {Object} The JSON Payload data to send to the dcp service.
         */
        _api.dcpData = function () {
          return {
            name: _api.name
          };
        };

        /**
         * Command-specific behaviour for an error response.
         * Only called for failure responses
         *
         * @override
         * @see     src/commands/qowtCommand.js
         * @param {Object} response The failing DCP response from service.
         * @param {Object}  errorPolicy A policy object used to determine what
         *                  behaviour to use in handling the response.
         */
        _api.onFailure = function (response, errorPolicy) {
          console.warn(_api.name + " command - failed: " + response.e +
              '. Failed command has been ignored.');

          // If there's an error just carry on regardless.
          if (errorPolicy) {
            errorPolicy.ignoreError = true;
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
