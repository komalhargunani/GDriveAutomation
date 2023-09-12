// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to send an deleteText dcp command to core
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
    'qowtRoot/commands/domMutations/base/mutationBaseCmd'
  ], function(
    MutationBaseCmd
  ) {

  'use strict';

  var _factory = {

    /**
     * Creates a new deleteText command and returns it.
     *
     * @param {Object} context
     * @param {String} context.spanEid
     * @param {String} context.nodeId
     * @param {Number} context.offset
     * @param {String} context.text
     * @param {Boolean} context.isInverse
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: delete text cmd missing context');
      }
      if (context.spanEid === undefined) {
        throw new Error('Error: delete text cmd missing spanEid');
      }
      if (context.offset === undefined) {
        throw new Error('Error: delete text cmd missing offset');
      }
      if (context.text === undefined) {
        throw new Error('Error: delete text cmd missing text');
      }

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==false, callsService==true)
        var _api = MutationBaseCmd.create('deleteText', false, true, context);

        /**
         * DCP JSON for deleteText command
         *
         * @see pronto/src/dcp/schemas/requests/delete-text.json
         * @return  {Object} The JSON Payload to send to the dcp service
         * {string} name: 'deleteText' The op.code.
         * {string} spanId: The element id of the span we are deleting from.
         * {integer} offset: The (zero-based) offset within the span to delete
         *                   from.
         * {integer} length: The number of characters to remove from the run.
         */
        _api.dcpData = function() {
          var dcp = {
            name: _api.name,
            // JELTE TODO: rename spanId to spanEid in dcp schema?
            spanId: context.spanEid,
            offset: context.offset,
            length: context.text ? Array.from(context.text).length : 0
          };

          return dcp;
        };


        // vvvvvvvvvvvvvvvvvvvvvvvvvv Private vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

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
