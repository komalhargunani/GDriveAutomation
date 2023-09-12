// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to send an insertText dcp command to core
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
     * Creates a new insertText command and returns it.
     *
     * @param {Object} context
     * @param {String} context.spanEid
     * @param {String} context.nodeId
     * @param {Number} context.offset
     * @param {String} context.text
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: insert text cmd missing context');
      }
      if (context.spanEid === undefined) {
        throw new Error('Error: insert text cmd missing spanEid');
      }
      if (context.offset === undefined) {
        throw new Error('Error: insert text cmd missing offset');
      }
      if (context.text === undefined) {
        throw new Error('Error: insert text cmd missing text');
      }

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==false, callsService==true)
        var _api = MutationBaseCmd.create('insertText', false, true, context);

        /**
         * DCP JSON for this insertText command.
         *
         * @see pronto/src/dcp/schemas/requests/insert-text.json
         * @return  {Object} The JSON Payload to send to the dcp service
         * {String} name: 'insertText' The op.code.
         * {String} spanId: Element id of the span we are inserting into.
         * {Integer} offset: Zero-based offset insertion point in the span.
         * {String} text: Character content to insert (supports >1 character).
         */
        _api.dcpData = function() {
          var dcp = {
            name: _api.name,
            // JELTE TODO: rename spanId to spanEid in dcp schema?
            spanId: context.spanEid,
            offset: context.offset,
            text: context.text
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
