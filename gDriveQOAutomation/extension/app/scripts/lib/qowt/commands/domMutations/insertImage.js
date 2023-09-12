define([
  'qowtRoot/commands/domMutations/base/mutationBaseCmd'
], function(
    MutationBaseCmd) {

  'use strict';

  var factory_ = {

    /**
     * Creates an insertImage command.
     *
     * @param {Object} context Initialisation data.
     * @param {string} context.nodeId - The id to use for the new element.
     * @param {string} context.parentId - Element id of the parent of the new
     *                                    node
     * @param {string| undefined} context.siblingId - The id of the previous
     *                                    sibling of the new node (optional).
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: insertImage cmd missing context');
      }
      if (context.nodeId === undefined) {
        throw new Error('Error: insertImage cmd missing nodeId');
      }
      if (context.parentId === undefined) {
        throw new Error('Error: insertImage cmd missing parentId');
      }
      if (context.src === undefined) {
        throw new Error('Error: insertImage cmd missing src of image');
      }
      if (context.frmt === undefined) {
        throw new Error('Error: insertImage cmd missing format of image');
      }

      var module = function() {
        var api_ = MutationBaseCmd.create('insertImage', false /*optimistic*/,
            true /*callsService*/, context);

        /**
         * DCP JSON for insertImage command.
         *
         * @return  {Object} The JSON Payload to send to the dcp service
         * {string} name: The op.code. 'insertImage'
         * {string} nodeId: The id to use for the new element.
         * {string} parentId: The element id of the parent of the new node.
         * {string} siblingId: The id of the previous sibling of the new node.
         * {string} src: image src.
         * {string} frmt: the image format.
         */
        api_.dcpData = function() {
          var dcp = {
            'name': api_.name,
            'nodeId': context.nodeId,
            'parentId': context.parentId,
            'siblingId': context.siblingId,
            'src': context.src,
            'frmt': context.frmt
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
