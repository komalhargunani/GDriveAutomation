define([
  'qowtRoot/commands/text/textCommandBase',
  'qowtRoot/variants/utils/resourceLocator'
], function(
    TextCmdBase,
    ResourceLocator) {

  'use strict';

  var _factory = {
    /**
     * Creates a new deleteQowtBBD command and returns it.
     *
     * @param {Object} context - context for the command creation
     * @param {String} context.loc - location of media
     * @return {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: deleteQowtBBD cmd missing context');
      }
      if (context.loc === undefined) {
        throw new Error('Error: deleteQowtBBD missing location of media');
      }

      // use module pattern for instance object
      var module = function() {
        var _api = TextCmdBase.create('deleteQowtBBD');

        /**
         * Optimistically delete the specified BBD from registry.
         * Note: this should only ever be called as part of a user-initiated
         * undo operation. In this context this command is required to reverse
         * the action of a prior insertBBD command.
         * @override
         */
        // TODO(umesh.kadam): changeHtml here does not make sense as this
        // command merely touches any "HTML". Moreover this command has nothing
        // to do with the text. This should extend some other class, likewise
        // there are other commands like addQowtDrawing/ addQowtImage etc that
        // need to be pulled out of textCommandBase and textCommandManifest.
        // Keeping them and this here for now as this CL is already large
        // enough.
        _api.changeHtml = function() {
          // Handle deletion of bbd here for now.
          var url = ResourceLocator.pathToUrl(context.loc);
          if (url) {
            window.URL.revokeObjectURL(url);
            ResourceLocator.unregisterUrl(context.loc);
          } else {
            throw (new Error(context.loc + ' is not registered to delete it'));
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
