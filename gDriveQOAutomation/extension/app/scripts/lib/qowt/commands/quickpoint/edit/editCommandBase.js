// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview A generic factory for point edit commands. These can be
 * optimistic or non-optimistic.
 *
 * Point edit commands will follow same flow for user initiated edit and service
 * requested undo-redo actions. This, essentially, means that point base command
 * need to handle this intelligence on behalf of all commands extending it.
 *
 * Instances of these objects are created from 2 flows...
 *   (1) normal user initiated actions, and
 *   (2) the inverse commands that apply the 'undo' (send by service).
 *
 * This base class must be instantiated by an extending object. It is not
 * directly usable.
 *
 * Clients must implement _api.changeHtml() as a function which acts upon the
 * HTML to achieve the desired result.
 *
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager'
], function(CommandBase, SaveStateManager) {

  'use strict';

  var _factory = {
    /**
     * Creates a point edit base command instance and returns it.
     *
     * @param {String=} opt_name Optional command name.
     * @param {Boolean=} opt_optimistic Flag about optimistic rendering.
     *     Render / change HTML before sending command to service otherwise
     *     wait for service response for command and then change HTML
     *     Default is true in command base.
     * @param {Boolean=} opt_callsService Flag about service call. Call service
     *     if true, otherwise do not call
     *     Default is false in command base.
     * @param {Boolean=} opt_markDirty Flag about whether edit operation needs
     *     to be immediately saved. Useful to avoid saving in case of selecting
     *     a shape or text-box.
     *
     * @return {Object} A new point edit base command object.
     *
     * @throws {Error} When both, opt_optimistic and opt_callsService are false
     *     or undefined
     *
     * Note:
     * For user initiated commands
     *     opt_optimistic can be true or false
     *     opt_callsService, in most cases, will be true
     * For service generated commands (cause of undo-redo)
     *     opt_callsService, must be false and hence opt_optimistic must be true
     */
    create: function(opt_name, opt_optimistic, opt_callsService,
        opt_markDirty) {
      opt_markDirty = (opt_markDirty !== false) ? true : false;

      // use module pattern for instance object
      var module = function() {
        // extend default (pipe line-able) command
        // (optimistic==true, callsService==opt_callsService)
        opt_name = opt_name || 'pointEditCmdBase';
        var _api = CommandBase.create(opt_name, opt_optimistic,
            opt_callsService);

        // As default assignment (when not passed as construction parameter) for
        // optimistic and callService is done at commandBase module, retrieve
        // actual values using _api and validate below scenario
        if (!(_api.isOptimistic() || _api.callsService())) {
          // If optimistic and callService, both are false/undefined then there
          // is no meaning for this command. Throw error accordingly.
          throw new Error('pointEditCmdBase: Command should either optimistic' +
              ' or it should call service');
        }

        var whenToRender = opt_optimistic ? 'doOptimistic' : 'onSuccess';
        // Provide a doOptimistic / onSuccess that cannot be
        // overwritten/deleted.
        Object.defineProperty(_api, whenToRender, {
          value: _changeHTML,
          writable: false});

        /**
         * Change HTML as per edit command in both cases, optimistic and
         * non-optimistic. This method must be overridden in extending objects.
         *
         * Note: It is very rare case that sub classes (concrete edit commands)
         * do not want to change HTML; but if this is the case, then client
         * needs to provide a blank changeHTML method to api.
         *
         * In case of non-optimistic command, this method (when overridden) gets
         * DCP response as parameter.
         *
         * @throws {Error} When extending object do not implement changeHtml()
         *     method
         */
        _api.changeHtml = function() {
          // This method must be overrideen in extending objects.
          throw new Error('pointEditCmdBase changeHtml() is not overridden');
        };

        if (_api.isOptimistic()) {

          /**
           * Define doRevert to enforce it's implementation by extending objects
           *
           * Called by command framework when command is optimistic and service
           * is failed to do operation.
           * This method is implemented here, just to make sure that optimistic
           * commands do provide it's concrete implementation.
           *
           * @throws {Error} When extending object do not implement doRevert()
           *     method when it is optimistic
           */
          _api.doRevert = function() {
            // This method must be overridden in extending objects in case of
            // optimistic

            // TODO (kunjan.thakkar): When doRevert() is called on an optimistic
            // command SaveStateManager should be reverted to its previous
            // version.
            // Currently, SaveStateManager does not have this capability.
            // This needs to be fixed once SaveStateManager starts supporting
            // reverting to an older version.
            throw new Error('pointEditCmdBase: doRevert() is not overridden' +
                'for optimistic command');
          };
        }

        if (_api.callsService()) {
          /**
           * Define dcpData to enforce it's implementation by extending objects
           *
           * Called by command framework when command is callsService.
           * This method is implemented here, just to make sure that
           * callsService commands do provide it's concrete implementation.
           *
           * @throws {Error} When extending object do not implement dcpData()
           *     method when it is callsService
           */
          _api.dcpData = function() {
            // This method must be overrideen in extending objects.
            throw new Error('pointEditCmdBase dcpData() is not overridden' +
                ' for a command that calls service.');
          };
        }

        // vvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        /**
         * Function to change HTML in both cases, optimistic and non-optimistic.
         *
         * For optimistic command, this gets executed when doOptimistic is
         * called by command framework.
         * For non-optimistic command, this gets executed when onSuccess is
         * called by command framework.
         *
         * Note: It is very rare case that sub classes (concrete edit commands)
         * do not want to change HTML; but if this is the case, then client
         * needs to provide a blank changeHTML method to api.
         *
         * @param {Object} response The response object in case of
         *     non-optimistic command
         * @private
         */
        function _changeHTML(response) {
          if (opt_markDirty) {
            // Let the SaveStateManager know that an edit operation has been
            // performed which is not yet saved.
            SaveStateManager.markAsDirty();
          }

          // Modify the html.
          _api.changeHtml(response);
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
