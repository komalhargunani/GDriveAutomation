define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/pubsub/pubsub'], function(
    CommandBase,
    PubSub) {

  'use strict';

  var factory_ = {

    create: function() {
      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('removeOverlay', true, false);

        _api.doOptimistic = function() {
          PubSub.publish('qowt:looseSelectionOverlay');
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      return module();
    }
  };

  return factory_;
});
