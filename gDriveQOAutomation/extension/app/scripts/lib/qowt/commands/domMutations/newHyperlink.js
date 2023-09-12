define([
  'qowtRoot/commands/domMutations/base/mutationBaseCmd'],
function(MutationBaseCmd) {

  'use strict';

  var factory_ = {

    /**
     * Creates a newHyperlink command.
     *
     * @param {Object} context Initialisation data.
     * @param {string | undefined} context.nodeId
     *                             The id to use for the new element.
     * @param {string | undefined} context.parentId Element id of the parent
     *                             of the new node.
     * @param {string | undefined} context.siblingId The id of the previous
     *                             sibling of the new node (optional).
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: addHyperlink cmd missing context');
      }
      if (context.nodeId === undefined) {
        throw new Error('Error: addHyperlink cmd missing nodeId');
      }
      if (context.parentId === undefined) {
        throw new Error('Error: addHyperlink cmd missing parentId');
      }

      var module = function() {
        // extend default command (optimistic==true, callsService==true)
        var api_ = MutationBaseCmd.create('newHyperlink', true, true, context);


        /**
         * DCP JSON for newHyperlink command.
         *
         * @return  {Object} The JSON Payload to send to the dcp service
         * {string} name: The op.code. 'addHyperlink'
         * {string} nodeId: The id to use for the new element.
         * {string} parentId: The element id of the parent of the new node.
         * {string} siblingId: The id of the previous sibling of the new node.
         * {string} target: hyperlink target.
         */
        api_.dcpData = function() {

          var dcp = {
            'name': api_.name,
            'nodeId': context.nodeId,
            'parentId': context.parentId,
            'siblingId': context.siblingId,
            'target': context.hlkTarget ? context.hlkTarget : ''
          };
          return dcp;
        };

        return api_;
      };

      var instance = module();
      return instance;
    }
  };

  return factory_;
});
