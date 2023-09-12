define([
  'qowtRoot/commands/domMutations/base/mutationBaseCmd',
], function(
    MutationBaseCmd) {

  'use strict';

  var factory_ = {

    /**
     * Creates an insertBBD command.
     *
     * @param {Object} context - Initialisation data.
     * @param {string} context.loc - location of image relative to root.
     * @param {ArrayBuffer} context.data - binary blob
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: insertBBD cmd missing context');
      }
      if (context.loc === undefined) {
        throw new Error('Error: insertBBD cmd missing location');
      }

      var module = function() {
        var api_ = MutationBaseCmd.create('insertBBD', false/*optimistic*/,
            true/*callsService*/, context);

        /**
         * DCP JSON for insertBBD command.
         *
         * @return  {Object} The JSON Payload to send to the dcp service
         * {string} name: The op.code. 'insertBBD'
         * {string} loc: file name relative to root
         * {ArrayBuffer} data: binary blob.
         */
        api_.dcpData = function() {
          // The BBD data will be sent in two parts @ transport.js
          // 1: {'name': 'insertBBD', 'loc': 'URI pointing to image data'}
          // 2: The Array Buffer

          var dcp = {
            'name': api_.name,
            'loc': context.loc,
            'data': context.data
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
