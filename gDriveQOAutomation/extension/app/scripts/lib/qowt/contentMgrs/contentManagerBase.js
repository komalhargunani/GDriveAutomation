define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/pubsub/pubsub'], function(
    CommandManager,
    PubSub) {

  'use strict';

  var factory_ = {
    create: function(contentType, supportedCommands) {
      function module() {
        var contentType_ = contentType;
        var supportedCommands_ = supportedCommands;
        var initialized_ = false;
        var token_;

        var api_ = {
          init: function() {
            if (!initialized_) {
              token_ = PubSub.subscribe('qowt:doAction',
                  api_.handleAction_.bind(api_));
              initialized_ = true;
            }
          },


          disable: function() {
            PubSub.unsubscribe(token_);
            token_ = undefined;
          },


          handleAction_: function() {
            throw (new Error('handleAction_ is not overridden!'));
          },


          createAndAddCmd_: function(signalData) {
            var command = supportedCommands_[signalData.action];
            if (command) {
              CommandManager.addCommand(
                  command.create(signalData.context.command));
            } else {
              throw new Error('Could not find command named: ' +
                  signalData.action);
            }
          },


          get contentType() {
            return contentType_;
          },


          get supports() {
            return supportedCommands_;
          },


          get supportedActions() {
            return Object.keys(supportedCommands_);
          }
        };

        return api_;
      }
      return module();
    }
  };

  return factory_;
});
