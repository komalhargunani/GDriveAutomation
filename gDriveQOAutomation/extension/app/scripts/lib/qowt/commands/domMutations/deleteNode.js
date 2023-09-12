// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Command to send a 'deleteNode' to core.
 *
 * TODO(chehayeb) deprecated modules should be deleted once Core-driven
 * Undo/Redo becomes production code (crbug 315503).
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
     * Creates a new deleteNodes command and returns it.
     *
     * @param {Object} context Context data for this object.
     * @param {String} context.nodeEid
     * @param {String} context.parentEid
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: delete node cmd missing context');
      }
      if (context.nodeEid === undefined) {
        throw new Error('Error: delete node cmd missing nodeEid');
      }

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = MutationBaseCmd.create('deleteNode', false, true, context);

        /**
         * DCP JSON for deleteNode command
         *
         * @return  {Object} The JSON Payload to send to the dcp service
         */
        _api.dcpData = function() {
          var dcp = {
            name: _api.name,
            nodeId: context.nodeEid,
            parentId: context.parentEid
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
