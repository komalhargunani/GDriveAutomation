// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A simple command container that specifies the end of a
 * transaction. This means that all preceeding commands must be guaranteed to
 * be atomic, such that if on one the participating commands fail then
 * they all fail.
 *
 * Note that by default this command is created as an optimistic command.
 */

define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/selection/selectionManager'
  ], function(
    CommandBase,
    PubSub,
    SelectionManager) {

  'use strict';


  var _factory = {

    // create function takes cmdName, optimistic, and callsService
    // so that other commands can derive from this class and override
    // these values.
    /**
     * Creates a transaction end command.
     *
     * @param {string} opt_cmdName Command name. If it's not specified 'txEnd'
     *                             will be used by default.
     * @param {boolean} opt_optimistic true if this has to be an optimistic
     *                                 command, false otherwise. By default
     *                                 this command is optimistic.
     * @param {boolean} opt_callsService True if this command requires DCP
     *                                   interaction, false otherwise. By
     *                                   default this command calls the DCP
     *                                   service.
     * @param {object} opt_context Selection context. If it's not specified,
     *                             then it will be captured during the
     *                             optimistic phase (in case this command
     *                             is optimistic).
     */
    create: function(
        opt_cmdName, opt_optimistic, opt_callsService, opt_context) {

      // use module pattern for instance object
      var module = function() {

          // if not overridden, set defaults
          if (opt_cmdName === undefined) {
            opt_cmdName = 'txEnd';
          }
          if (opt_optimistic === undefined) {
            opt_optimistic = true;
          }
          if (opt_callsService === undefined) {
            opt_callsService = true;
          }

          var _api = CommandBase.create(
                  opt_cmdName, opt_optimistic, opt_callsService),
              _context = opt_context;

          /**
           * Routine that perorms the optimistic phase of the command. Here
           * we capture the selection context in case it has not been
           * specified during the creation of this command. This is required
           * when undo/redo is driven by the Core, in which case we need to
           * store the selection context together with the transaction so
           * that we can restore it after an undo operation.
           */
          _api.doOptimistic = function() {
            // TODO(chehayeb) this does not fix the case for non-optimistic
            // commands. According to the design documentation associated to
            // the Command Manager, there are three queues (optimistic phase,
            // DCP request generation and DCP response processing), each one
            // with its own worker. Hence, we can have the case where the DCP
            // request for txEnd has been sent and we are still waiting for
            // the DCP response of the non-optimistic commmand
            if (!_context) {
              _context = SelectionManager.snapshot();
            }
          };

          /**
           * Return the data to be used as the payload. The name property is
           * mandatory. We also send the selection context, which will be used
           * to restore the selection after a Core-driven redo operation.
           *
           * @return {Object} The JSON Payload data to send to the dcp service
           * @see TODO need dcp schema reference!
           */
          _api.dcpData = function() {
            var payload = {
              name: "txEnd",
              context: JSON.stringify(_context)
            };
            return payload;
          };

          /**
           * Performs some status updates based on the info provided by the
           * DCP response.
           *
           * @param {object} response The DCP response for this command.
           * @param {object} opt_params JSON object with command-specific data.
           * @param {Boolean} response.canUndo true if it is possible to
           *                  perform an undo action, false otherwise.
           * @param {Boolean} response.canRedo true if it is possible to
           *                  perform a redo action, false otherwise.
           * @override
           */
          _api.onSuccess = function(response /* opt_params */) {
            // TODO(chehayeb) rename the event types once Core-driven
            // undo/redo becomes production code.
            var signal = (response.canUndo) ?
                'qowt:undoNonEmpty' : 'qowt:undoEmpty';
            PubSub.publish(signal);

            signal = (response.canRedo) ?
                'qowt:redoNonEmpty' : 'qowt:redoEmpty';
            PubSub.publish(signal);
          };

          /**
           * JELTE TODO - for now ignore errors since the core will not
           * yet support this command. But once it does, add error handling!
           */
          _api.onFailure = function(response, errorPolicy) {
            console.error(_api.name + " command - failed: " + response.e);
            if (errorPolicy) {
              errorPolicy.ignoreError = true;
              errorPolicy.eventDispatched = true;
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

