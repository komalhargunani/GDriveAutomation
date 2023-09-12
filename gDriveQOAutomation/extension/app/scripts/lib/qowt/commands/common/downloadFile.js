define(['qowtRoot/commands/commandBase'], function(CommandBase) {

  'use strict';

  var factory_ = {

    /**
     * Factory function to create a new command object.
     *
     * @return  {Object} A Download command.
     */
    create: function() {

      var cmdName = 'download',
          optimistic = false,
          callsService = true;
      var api_ = CommandBase.create(cmdName, optimistic, callsService);

      /**
       * Return a payload object with the data to be used as the DCP request.
       * The name property is mandatory.
       *
       * @return {Object} The JSON Payload data to send to the dcp service
       */
      api_.dcpData = function() {
        return {
          name: api_.name
        };
      };

      return api_;
    }
  };

  return factory_;
});
