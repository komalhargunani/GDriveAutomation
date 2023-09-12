// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to send an moveNode dcp command to core
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

    create: function(context) {

      // don't try to execute if it's missing crucial data
      // Note: the siblingId is optional I THINK... if not passed,
      // the node should be moved at the start of the children of the parent?
      // JELTE TODO: verify this with dcp and core guys
      if (context === undefined) {
        throw new Error('Error: move node cmd missing context');
      }
      if (context.nodeId === undefined) {
        throw new Error('Error: move node cmd missing nodeId');
      }
      if (context.parentId === undefined) {
        throw new Error('Error: move node cmd missing parentId');
      }
      if (context.oldParentId === undefined) {
        throw new Error('Error: move node cmd missing oldParentId');
      }

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = MutationBaseCmd.create('moveNode', false, true, context);

        /**
         * DCP JSON for moveNode command
         * See JELTE TODO: link to schema
         *
         * @return  {Object} The JSON Payload to send to the dcp service
         * {String} name: 'moveNode' The op.code.
         * {String} nodeId: The id of the element to move.
         * {String} parentId: The id of the new parent element for this node.
         * {String} oldParentId: The id of the old parent element.
         * {String} siblingId: The id of the new siblibling for this node.
         */
        _api.dcpData = function() {
          // TODO(elqursh): We should not need to have QOWT send oldParentId.
          // All the Cores should be capable of getting this directly as they as
          // the master source of data.
          var dcp = {
            'name': _api.name,
            'nodeId': context.nodeId,
            'parentId': context.parentId,
            'oldParentId': context.oldParentId,
            'siblingId': context.siblingId
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
