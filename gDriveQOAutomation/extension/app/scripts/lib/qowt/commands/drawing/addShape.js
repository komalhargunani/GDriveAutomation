// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview optimistic qowt command to Add shape which draws the shape
 * optimistically and sends the to the core through the payload object.
 * On failure from core it also reverts the shape which drawn optimistically.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'third_party/lo-dash/lo-dash.min'
], function(
    EditCommandBase
) {

  'use strict';

  var _factory = {

    /**
     * Creates a new addShape command and returns it.
     *
     * @param {Object} context. This object contains command object which is
     *     compatible for user driven and undo operation. Command object is
     *     consists of shapeJson - shape related data required for add shape.
     *     shapeJson object need to provide the details of shapeId, shape's
     *     preset ID and its transform in the form
     *     {ext:{cx:'',cy:''},off:{x:'',y:''}}[P.S. All the values of the
     *     transforms are in EMU]
     * @param {Object} ContainerWidget The widget which provides add shape API
     *     for the shape to add.
     * @param {Number} containerNumber The number of the container.
     *     e.g. in Point it is slide number
     * @return {Object}
     */
    create: function(context, ContainerWidget, containerNumber) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Add Shape cmd missing context');
      }
      if (context.command === undefined) {
        throw new Error('Add Shape cmd missing command');
      }
      if (context.command.sp === undefined) {
        throw new Error('Add Shape cmd missing shape Json');
      }
      if (ContainerWidget === undefined) {
        throw new Error('Add Shape cmd missing container widget');
      }
      if (containerNumber === undefined) {
        throw new Error('Add Shape cmd missing container number');
      }
      var _shapeJson = context.command.sp, _dcpCommand = 'false',
          _shapeId = _shapeJson.eid;

      _dcpCommand = context.command.type &&
          context.command.type === 'dcpCommand';

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true, callsService== _dcpCommand)
        var _api = EditCommandBase.create('insertShape', true, !_dcpCommand);
        /**
         * Optimistically insert the specified shape onto the slide.
         * Values are calculated in emu since the core and DCP manager both
         * work on the EMU
         * @override
         */
        _api.changeHtml = function() {
          var shapeJson = _.cloneDeep(_shapeJson);
          ContainerWidget.addShape(shapeJson);
        };

        // Implement doRevert() only if its a user action. If its a Core
        // generated command then the operation has already been performed on
        // Core so doRevert should not be defined.
        if (context.command.type !== 'dcpCommand') {
          /**
           * Revert the action of changeHtml.
           * Invoked when a command has failed and the command queue has been
           * invalidated.
           * The caller has already verified the optimistic part has been done,
           * so only minimal check required here.
           */
          _api.doRevert = function() {
            ContainerWidget.removeShape(_shapeId);
          };

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
              name: 'insertShape',
              cn: containerNumber,
              siblingId: -1,
              sp: _shapeJson
            };
            return payload;
          };
        } else {
          _api.doRevert = undefined;
        }

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
