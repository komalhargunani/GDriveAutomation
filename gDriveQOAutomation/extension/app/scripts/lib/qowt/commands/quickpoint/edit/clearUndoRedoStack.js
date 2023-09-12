// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to clear the undo/redo stack at Core
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/pubsub/pubsub'
], function(CommandBase, PubSub) {

  'use strict';

  var _factory = {
    /**
     * Creates a new clearUndoRedoStack command and returns it.
     *
     * @return {Object} clearUndoRedoStack command object
     */
    create: function() {
      // use module pattern for instance object
      // optimistic = false, callsService = true
      var module = function() {
        var _api = CommandBase.create('clearUndoRedoStack', false, true);
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
          var payload = {
            name: 'clearUndoRedoStack'
          };
          return payload;

        };
        /**
         * @override
         */
        _api.onSuccess = function() {
          //Disable the buttons/menu items for undo redo
          PubSub.publish('qowt:undoEmpty');
          PubSub.publish('qowt:redoEmpty');
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
