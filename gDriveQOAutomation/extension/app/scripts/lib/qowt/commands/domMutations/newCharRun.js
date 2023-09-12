// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to send an newCharRun dcp command to core
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
     * Creates a new command.
     *
     * @param {Object} context Initialisation data.
     * @param {string} context.nodeId The id to use for the new element.
     * @param {string} context.parentId Element id of the parent
     *        of the new node.
     * @param {string} context.siblingId The id of the previous sibling
     *        of the new node.
     */
    create: function(context) {

      // don't try to execute if it's missing crucial data
      // note context.textFormatting and context.siblingId are optional
      if (context === undefined) {
        throw new Error('Error: new char run cmd missing context');
      }
      if (context.nodeId === undefined) {
        throw new Error('Error: new char run cmd missing nodeId');
      }
      if (context.parentId === undefined) {
        throw new Error('Error: new char run cmd missing parentId');
      }

      // use module pattern for instance object
      var module = function() {
        context = context || {};
        // extend default command (optimistic==false, callsService==true)
        var _api = MutationBaseCmd.create('newCharRun', false, true, context);

        /**
         * DCP JSON for newCharRun command
         *
         * @see pronto/src/dcp/schemas/requests/new-charrun.json
         * @return {Object} The JSON Payload to send to the dcp service.
         * {string} name: 'newCharRun' The op.code.
         * {string} nodeId: The id to use for the new element.
         * {string} parentId: The element id of the parent of the new node.
         * {string} siblingId: The id of the previous sibling of the new node.
         */
        _api.dcpData = function() {
          var dcp = {
            name: _api.name,
            nodeId: context.nodeId,
            parentId: context.parentId,
            siblingId: context.siblingId,
            textFormatting: context.textFormatting
          };
          return dcp;
        };


        // vvvvvvvvvvvvvvvvvvvvvvvvvv Private vvvvvvvvvvvvvvvvvvvvvvvvvv

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
