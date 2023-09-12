// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to duplicate slide(s)
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/pubsub/pubsub'
], function(
    CommandBase,
    PresentationControl,
    PubSub) {

  'use strict';

  var _factory = {
    /**
     * Creates a new duplicateSlide command and returns it.
     *
     * @param {Object} command command data for the command
     * @return {Object} duplicate command object
     */
    create: function(command) {
      // don't try to execute if it's missing crucial data
      if (command === undefined) {
        throw new Error('Duplicate slide command missing command data');
      }
      if (command.slideNumbers === undefined) {
        throw new Error('Duplicate slide cmd missing slideNumbers');
      }

      // When the command is created lock the screen so that user cannot
      // perform any other operation.
      PubSub.publish('qowt:lockScreen');

      // use module pattern for instance object
      var module = function() {
        var _api = CommandBase.create('duplicateSlide', false /*optimistic*/,
            true /*calls service*/);
        // Create dcpData only if its a user operation and command needs to be
        // sent to Core.
        // TODO (rahul.tarafdar): this needs to be a part of EditCommandBase.
        // EditCommandBase should be able to abstract this logic in its
        // framework - similar to abstraction of onSuccess() and doOptimistic()
        // in changeHtml()
        if (command.type !== 'dcpCommand') {
          /**
           * Return an object with the data to be used as the payload of the
           * DCP request.
           * Request manager will add the unique ID to this payload to track
           * and match client-server request-response
           * The name property is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           * @see     TODO need dcp schema reference.
           */
          _api.dcpData = function() {
            command.name = 'duplicateSlide';
            return command;
          };
        } else {
          // If its a Core generated command then the operation has already been
          // performed on Core so doRevert should not be defined.
          _api.doRevert = undefined;
        }
        /**
         * @override
         */
        _api.changeHtml = function() {
          PresentationControl.duplicateSlides(command.slideNumbers);
        };

        /**
         * @override
         */
        _api.onFailure = function() {
          PubSub.publish('qowt:unlockScreen');
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
