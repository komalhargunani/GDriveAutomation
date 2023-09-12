// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview non optimistic qowt command to delete shape which deletes
 * the shape non optimistically after sending data to the core through the
 * payload object.
 * On success from core it deletes the shape from the DOM.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase'
], function(
    EditCommandBase
) {

  'use strict';

  var _factory = {

    /**
     * Creates a new deleteShape command and returns it.
     *
     * @param {Object} context. This object contains command object which is
     *     compatible for user driven and undo operation. Command object is
     *     consists of eid - shape eid required to delete shape.
     * @param {Object} ContainerWidget The widget which provides Delete shape
     *     API for the shape to Delete.
     * @param {Number} containerNumber The number of the container.
     *     e.g. in Point it is slide number
     * @return {Object}
     */
    create: function(context, ContainerWidget, containerNumber) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Delete Shape cmd missing context');
      }
      if (context.command === undefined) {
        throw new Error('Delete Shape cmd missing command');
      }
      if (context.command.eid === undefined) {
        throw new Error('Delete Shape cmd missing shape eid');
      }
      if (ContainerWidget === undefined) {
        throw new Error('Delete Shape cmd missing container widget');
      }
      if (containerNumber === undefined) {
        throw new Error('Delete Shape cmd missing container number');
      }
      var _dcpCommand = 'false', _shapeId = context.command.eid;

      _dcpCommand = (context.command.type &&
          context.command.type === 'dcpCommand') ? true : false;

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true, callsService== _dcpCommand)
        var _api = EditCommandBase.create('deleteShape',
            _dcpCommand, !_dcpCommand);

        // If its a Core generated command then the operation has already been
        // performed on Core so doRevert should not be defined.
        if (_dcpCommand) {
          /**
           * Revert the action of changeHtml.
           * Invoked when a command has failed and the command queue has been
           * invalidated.
           * The caller has already verified the optimistic part has been done,
           * so only minimal check required here.
           */
          _api.doRevert = undefined;
        } else {
          /**
           * Return an object with the data to be used as the payload of the DCP
           * request.
           * Request manager will add the unique ID to this payload to track and
           * match client-server request-response
           * The name property is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           * @see     TODO need dcp schema reference!
           */
          _api.dcpData = function() {
            var payload = {
              name: 'deleteShape',
              cn: containerNumber,
              eid: _shapeId
            };
            return payload;
          };
        }
        /**
         * Non optimistically deletes the specified shape from the slide.
         * @override
         */
        _api.changeHtml = function() {
          ContainerWidget.removeShape(_shapeId);
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
