// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to insert a slide
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
    * Creates a new insertSlide command and returns it.
    *
    * @param {Object} command command data for the command
    * @return {Object} insert command object
    */
    create: function(command) {
      // don't try to execute if it's missing crucial data
      if (command === undefined) {
        throw new Error('Insert slide command missing command data');
      }
      if (command.sn === undefined) {
        throw new Error('Insert slide command missing slide number');
      }

      var callsService = (command.type && command.type === 'dcpCommand') ?
                         false :
                         true;

      // If the command is initiated through an undo operation then it should
      // be treated like an optimistic command
      var optimistic = (command.type && command.type === 'dcpCommand') ?
          true :
          false;

      //  When the command is created lock the screen so that user cannot
      // perform any other operation.
      PubSub.publish('qowt:lockScreen');

      // use module pattern for instance object
      var module = function() {
        var _api = CommandBase.create('insertSld', optimistic, callsService);
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
            command.name = 'insertSld';
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
          PresentationControl.insertSlide(command.sn - 1);
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
