define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/events/errors/point/pointEditError',
  'qowtRoot/pubsub/pubsub',

  'third_party/lo-dash/lo-dash.min'
], function(
    EditCommandBase,
    PointEditError,
    PubSub) {

  'use strict';

  var factory_ = {

    create: function(context) {

      // don't try to execute if it's missing mandatory data.
      if (!context) {
        throw new Error('formatObject missing context');
      }
      if (!context.command) {
        throw new Error('formatObject missing command object');
      }
      if (!context.command.eid && !context.command.node) {
        throw new Error('formatObject missing eid or node');
      }

      var callsService = true;
      if (context.command.type === 'dcpCommand') {
        callsService = false;
      }

      // extend default command (optimistic==true, callsService==true)
      var api_ = EditCommandBase.create('formatObject', true, callsService);

      handleDeletedProperties_(context);

      // Get the shape element to format if it wasn't already given
      var shapeElement_ = context.command.node || document.getElementById(
          context.command.eid);

      var originalFormatting_ = _.cloneDeep(shapeElement_.model);

      // Create dcpData only if its a user operation and command needs to be
      // sent to Core.
      if (context.command.type !== 'dcpCommand') {
        /**
         * Revert the action of changeHtml.
         * Invoked when a command has failed and the command queue
         * has been invalidated.
         * This is necessary to ensure the HTML remains in sync with the DOM.
         */
        api_.doRevert = function() {
          shapeElement_.decorate(originalFormatting_);
        };

        /**
         * DCP JSON for format object command
         *
         * @return {Object} The JSON Payload to send to the dcp service.
         * {string} name: 'formatObject' The op.code.
         * {string} eid: The id to use for the new element.
         * {Object} formatting: The new formatting object of the shape.
         * {string} sn: current slide number.
         */
        api_.dcpData = function() {
          return context.command;
        };
      } else {
        // If its a Core generated command then the operation has already been
        // performed on Core so doRevert should not be defined.
        api_.doRevert = undefined;
      }
      /**
       * Optimistically update properties of the given object node.
       */
      api_.changeHtml = function() {
        if (shapeElement_ && shapeElement_.isQowtElement &&
            shapeElement_.decorate) {
          var formatting = _.cloneDeep(context.command.formatting);
          shapeElement_.decorate(formatting);
        }

        // Let the dropdown button know that the formatting is changed, so that
        // current selected value is reflected properly.
        PubSub.publish('qowt:formattingChanged', {node: shapeElement_});
      };

      /**
       * Handles DCP failures.
       */
      api_.onFailure = function(e) {
        console.error('format_object_error', e);
        var error = PointEditError.create('format_object_error', false);
        PubSub.publish('qowt:error', error);
      };

      return api_;
    }
  };

  function handleDeletedProperties_(context) {
    // This method aligns with the 'hackContext_' method of formatQowtElement
    context.command.formatting = context.command.formatting || {};

    var toDelete = context.command.del_formatting || [];

    for (var i = 0; i < toDelete.length; i++) {
      // add each formatting property that we should remove, as an undefined
      // in the shape property object
      context.command.formatting[toDelete[i]] = undefined;
    }
    delete context.command.del_formatting;
  }

  return factory_;
});
