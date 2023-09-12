// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @module commandBase
 * @overview Command base class represents user oriented actions within the
 *           application.
 * Command objects participate in the 'Command' design pattern.
 *
 * Please read http://goto.google.com/qowtcmd for the Command design doc.
 *
 * Every command has 3 futures that are run in sequence:
 *
 * 1. Optimistic Phase - this is rendering to be done before sending a DCP
 *    message to core Use this if your command can be rendered independently of
 *    core, and we can just rely on core confirming its success afterwards.
 *    It may have to be reverted if core returns a failure result.
 * 2. DCP send - this sends the message to core to execute the command. If an
 *    error occurs in core, a revert will be triggered.
 * 3. DCP response processing - this renders the response from core, using
 *    DCPManager. This is to be used when the optimistic phase cannot completely
 *    render the command.
 *
 * These steps must occur in order. No steps can be skipped. The flow and timing
 * are controlled by the CommandManager.
 *
 * Compound commands can be made by adding children. A command can have any
 * number of children. When added to CommandManager, compound commands will be
 * flattened into a linear sequence of commands, by pre-order tree traversal.
 *
 * Commands have a strict total ordering. They must appear on screen and be sent
 * to core in order.
 *
 * Methods to override to define your command:
 * doRevert: routine for reverting the optimistic phase of your command
 * onSuccess: routine for handling DCP success
 * onFailure: routine for handling DCP failure
 * doOptimistic: routine for optimistic phase of your command
 * createOptimisticWorkFuture: as an alternative to doOptimistic, routine for
 *     returning a future that performs the optimistic phase work. Using a
 *     future instead of a function permits you to do a multi-turn optimistic
 *     phase (doing the work in chunks separated by setTimeouts). This increases
 *     UI responsiveness, as it allows the browser to do other things concurrent
 *     to the current task.
 * preExecuteHook: routine executed immediately before sending DCP message
 * responseHook: routine executed after a response in received, which can
 *     potentially alter the response
 *
 * @see src/commands/unitTests/qowtCommand-test.js
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/utils/idGenerator',
    'qowtRoot/commands/revertManager',
    'qowtRoot/dcp/dcpManager',
    'qowtRoot/models/env',
    'qowtRoot/commands/coreFailure',
    'qowtRoot/comms/request',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/utils/promiseUtils',
    'qowtRoot/utils/functionUtils'
  ], function(
    PubSub,
    IdGenerator,
    RevertManager,
    DcpManager,
    EnvModel,
    CoreFailure,
    Request,
    TypeUtils,
    PromiseUtils,
    FunctionUtils) {

  'use strict';

  var _factory = {

    /**
     * Determines whether an object is a CommandBase. In other words, is it an
     * object created by the create method below.
     *
     * @param obj {Object} the object being tested.
     * @returns {boolean} whether it was created by the create method below.
     */
    isCommand: function(obj) {
      return _commandType.isOfType(obj);
    },

    /**
     * Create a new command object.
     *
     * @param {string || undefined} cmdName A unique name for this command.
     * @param {boolean} optimistic True if optimistic, false for non-opt.
     *                             Default is true.
     * @param {boolean} callsService True if sent to service, otherwise false.
     *                               Defuault if false.
     * @return {Object} A new command object.
     */
    create: function(cmdName, optimistic, callsService) {
      // A constructor function that always returns a new object instance
      // by virtue of using the module pattern.
      var module = function() {

        var _api = {

          /**
           * This is the parent/container node that processed DCP responses will
           * be attached to. Ensures the command knows the root node to process
           * DCP responses into. By default this is the rootNode for our
           * environment.
           * Override this where necessary in concrete commands.
           * Specify either a DOM node or document fragment.
           *
           * @method rootEl-member
           */
          rootEl: EnvModel.rootNode,


          /**
           * Name is public data rather than query method
           * since this is currently how other qowt components expect it.
           * TODO: make this an accessor method and change all client to use it
           * as such.
           *
           * @method name : member
           */
          name: cmdName || undefined,

          /**
           * Query if this is an optimistic command
           * ie, if the handlers visit the command prior to gett a response.
           *
           * @return {boolean} True if handlers visit optimistically else False.
           * @method isOptimistic()
           */
          isOptimistic: function() {
            return _optimistic;
          },


          /**
           * Query if this command calls the service
           *
           * @return {boolean} True is sent to the service, otherwise False.
           * @method callsService()
           */
          callsService: function() {
             return _callsService;
           },


          /**
           * Query the parent command reference of this command.
           *
           * @return {object} The parent command object if set, else undefined.
           * @method parent()
           */
          parent: function() {
              return _parent;
          },


          /**
           * Add a new command as a child of this command. If the child list
           * has been frozen by freezeChildren, this will throw an exception.
           * freezeChildren is a feature used by CommandManager so that it can
           * do traverse the children without the possibility that the list will
           * change sometime later.
           *
           * @param  {object} command The command to add to this command bucket.
           *                  Note that command may itself have child commands.
           * @method addChild(command)
           */
          addChild: function(command) {
            if (!_factory.isCommand(command)) {
              throw new Error('addCommand given a non-command object');
            }
            if (_commandTreeDone) {
              throw new Error (name + ' command tree is done, cannot add ' +
                  'child ' + command.name);
            }
            _children.push(command);

            command.setParent(_api);
          },

          /**
           * Returns the child commands of this command. Used by CommandManager
           * to do child command execution.
           * @returns {Array} a list of child commands of this command.
           */
          getChildren: function() {
            return _children.slice(0);
          },

          /**
           * Query the number of child commands (not descendants)
           *
           * @return {integer}   The number of child commands.
           * @method childCount()
           */
          childCount: function() {
            return _children.length;
          },

          /**
           * Make an optimistic command a 'null' command, meaning it has no
           * effect. When processing optimistic commands, DCP handlers may deem
           * the commandto be unecessary, and need to ensure the generated
           * command has no effect.
           *
           * Since this command may be involved in a command tree, it cannot
           * just be removed. Rather, it is marked as an 'empty' command, does
           * not call the service, and self-completes so as to invoke any child
           * commands.
           *
           * Making a command a null command thus only has meaning for
           * optimistic commands such that they do not get sent to the service.
           *
           * Called by DCP Handlers
           * @see     src/handlers/handlerManager.js
           * @see     src/handlers/charRunHandler.js
           * @see     src/handlers/textSplicer.js
           * @see     src/handlers/paragraphHandler.js
           * @method makeNullCommand()
           */
          makeNullCommand: function() {
            _nullCommand = true;
            _optimistic = false;
            _callsService = false;
          },


          /**
           * Hook for any command-specific behaviour you may have.
           * Invoked after the framework has processed any DCP response
           * Only called for after successful responses
           *
           * Override this in concrete commands for command-specific behaviour.
           *
           * @param {object} response The DCP response for this command.
           * @param {object} opt_params JSON object with command-specific data.
           * @private
           * @method onSuccess(response,params)
           */
          onSuccess: function(/* response, opt_params */) {
            // override in concrete commands where necessary
          },

          /**
           * Command-specific failure behaviour. Does nothing by default.
           * Override in concrete command classes for additional
           * command-specific behaviours.
           *
           * @param {object} response The DCP response for this command.
           * @param {object} errorPolicy A policy object used to determine what
           *          behaviour to use in handling the response.
           * @method onFailure(response,errorPolicy)
           */
          onFailure: function(/* response, errorPolicy */) {
            // override in concrete commands where necessary
          },

          /**
           * Returns whether this command can construct an inverse of itself.
           * If you override getInverse, assign true to this.
           */
          canInvert: false,

          /**
           * Returns the inverse of this command. An inverse is a command that
           * undoes the original command, fully, in both QOWT and Core.
           *
           * To make your command invertible, override this method, and set
           * canInvert to true.
           *
           * Invert only this command and ignore its children. The inverse of
           * this command can be a compound command.
           *
           * @return {Command|Promise<Command>|
           *         QueueableCommand|Promise<QueueableCommand>} The inverse
           *     command, or a future that returns the inverse command. The
           *     command could be QueueableCommand or CommandBase.
           */
          getInverse: function() {
            throw new Error('getInverse not implemented');
          },

          /**
           * Store a reference to the parent command
           * Thus signifying this command is part of a more complex transaction.
           *
           * @param  {object} command A reference to the parent command or the
           *                          command manager.
           * @method setParent(command)
           */
          setParent: function(command) {
            if (!_factory.isCommand(command)) {
              throw new Error('setParent given non-command object');
            }
            _parent = command;
          },

          /**
           * Query if the command has any parent command.
           * @return {boolean} True if this command is the root of the connected
           *                   graph, else False.
           */
          isRootCommand: function() {
            return _parent === undefined;
          },

          /**
           * Query the id of this command
           *
           * @return {string} The id of this command.
           * @method id()
           */
          id: function() {
            return _id;
          },

          /**
           * Runs the optimistic phase of the command.
           * Can only be called once.
           *
           * @params cancelPromise {Promise} reject this to cancel processing.
           * @returns {Promise|Object} the return value from doOptimistic.
           *     if this is a promise, it must be waited on before proceeding
           *     with the DCP phase or the next command's optimistic phase.
           */
          runOptimisticPhase: FunctionUtils.onceCallableFunction(
              _runOptimisticPhase),

          /**
           * @returns {boolean} whether runOptimsticPhase has been called or
           *     not. For testing purposes.
           */
          hasOptimisticPhaseStarted: function() {
            return _optimisticPhaseStarted;
          },

          /**
           * Runs the DCP request-response phase of the command.
           * Can only be called once. This will not make forward progress until
           * the optimistic phase has completed.
           *
           * @params cancelPromise {Promise} reject this to cancel processing.
           * @returns {Promise} wait on this before starting the next command's
           *     DCP phase.
           */
          runDcpPhase: FunctionUtils.onceCallableFunction(
              _runDcpPhase),

          /**
           * @returns {boolean} whether runDcpPhase has been called. For
           *     testing purposes.
           */
          hasDcpPhaseStarted: function() {
            return _dcpPhaseStarted;
          },

          /**
           * Fires the event signifying that the command is completely done.
           * @returns
           */
          commandTreeDone: function() {
            if (_commandTreeDone) {
              throw new Error('commandTreeDone called multiple times');
            }
            _commandTreeDone = true;
            _sendCmdEvent(_kCMD_EVENT_STOP, true);
          }
        };

        // Private data
        var _optimistic = (optimistic === undefined) ? true : optimistic;
        var _callsService = (callsService === undefined) ? false : callsService;
        var _nullCommand = (cmdName) ? false : true;
        var _commandTreeDone = false;

        /**
         * Whether the execute method has already been called. The execute
         * method can be called at most once.
         * @private
         */
        var _parent;
        var _children = [];
        var _response;
        var _id = IdGenerator.getUniqueId();
        var _kCMD_EVENT_START = 'Start';
        var _kCMD_EVENT_STOP = 'Stop';
        var _optimisticPhaseStarted = false;
        var _dcpPhaseStarted = false;

        var _revertToken = RevertManager.createToken();

        function _runOptimisticPhase(cancelPromise) {
          // Avoid creating any promises here, so that the optimistic
          // phase runs in the current microtask, (as in, immediately)
          // which is expected behavior.
          _optimisticPhaseStarted = true;
          if (_optimistic && !_nullCommand) {
            if (TypeUtils.isFunction(_api.doRevert)) {
              _revertToken.schedule(_api.doRevert);
            }
            return _tryCall(_api.doOptimistic, cancelPromise);
          }
        }

        function _runDcpPhase(cancelPromise) {
          _dcpPhaseStarted = true;
          return _api.runOptimisticPhase.isCalled
              .then(function() {
                if (_callsService) {
                  return _callService(cancelPromise);
                }
              }).then(function() {
                return _isFailedResponse() ?
                    _handleFailure() :
                    _handleSuccess(cancelPromise);
              }).then(function() {
                // We call onSuccess even if there was a failure that
                // was ignored. In that case, both onFailure and onSuccess
                // have been called. This policy should be reviewed.
                return _api.onSuccess(_response);
              });
        }

        function _callService(cancelPromise) {
          return PromiseUtils.cast(_tryCall(_api.preExecuteHook))
              .then(function() {
                if (!_nullCommand) {
                  _sendCmdEvent(_kCMD_EVENT_START, undefined);
                  return _setResponse(
                      Request.send, _getPayload(), cancelPromise);
                }
              });
        }

        function _handleSuccess(cancelPromise) {
          _revertToken.complete();
          return PromiseUtils.cast(_setResponse(_api.responseHook, _response))
              .then(function() {
                if (_response) {
                  return DcpManager.processDcpResponse(
                      _response, _api.rootEl, undefined, cancelPromise);
                }
              });
        }

        /**
         * Handles DCP failures.
         */
        function _handleFailure() {
          var errorPolicy = {};
          // The call to onFailure sets the errorPolicy appropriately.
          // TODO(ganetsky): Review whether we should continue having
          // an errorPolicy.
          return PromiseUtils.cast(_api.onFailure(_response, errorPolicy))
              .then(function() {
                if (errorPolicy.ignoreError) {
                  _revertToken.complete();
                } else {
                  _sendCmdEvent(_kCMD_EVENT_STOP, false /* cmdSuccess */);
                  // By throwing an exception, we reject the promise chain,
                  // propagating the CoreFailure object to CommandQueueManager.
                  throw CoreFailure.create({
                    errorPolicy: errorPolicy,
                    error: _response.e || _response.error
                  });
                }
              });
        }

        function _isFailedResponse() {
          return _response && (!!_response.e || !!_response.error);
        }

        /**
         * TODO(ganetsky): See if we can get rid of _sendCmdEvent altogether.
         * @param {string} state Indicates a start or a stop state.
         * @param {boolean} success True for success, false for failure.
         * @private
         */
        function _sendCmdEvent(state, success) {
          var ev;
          if (state === _kCMD_EVENT_START) {
            ev = _kCMD_EVENT_START;
          } else {
            ev = _kCMD_EVENT_STOP;
          }

          var publish = PubSub.publish;
          publish('qowt:cmd' + ev + 'Execute', _api);
          publish('qowt:cmd' + cmdName + ev, {'success': success});
        }

        function _getPayload() {
          var payload = _tryCall(_api.dcpData) || {};
          return PromiseUtils.cast(payload)
              .then(function(payloadValue) {
                payloadValue.id = _id;
                return payloadValue;
              });
        }

        /**
         * Usage:
         * _tryCall(_api.onFailure, _response, errorPolicy)
         *
         * Does this:
         * if (TypeUtils.isFunction(_api.onFailure)) {
         *   return _api.onFailure(_response, errorPolicy);
         * }
         */
        function _tryCall(/* fn */) {
          var boundFn = _getBoundFn(arguments);
          if (boundFn) {
            return boundFn();
          }
        }

        /**
         * Usage:
         * _setResponse(_api.responseHook, _response)
         *
         * Does this:
         * if (TypeUtils.isFunction(_api.responseHook)) {
         *   return PromiseUtils.cast(_api.ResponseHook(_response))
         *       .then(function response) {
         *         _response = response;
         *       });
         * }
         */
        function _setResponse(/* fn */) {
          var boundFn = _getBoundFn(arguments);
          if (boundFn) {
            return PromiseUtils.cast(boundFn())
                .then(function(response) {
                  _response = response;
                });
          }
        }

        /**
         * Called by _tryCall and _setResponse with their arguments object.
         * Takes a list of arguments passed to _tryCall (for example) like...
         * _tryCall(_api.onFailure, _response, errorPolicy)
         *
         * checks if _api.onFailure is a function, returns undefined if not,
         * otherwise returns this...
         *
         * _api.onFailure.bind(_api, _response, errorPolicy)
         *
         * Essentially, returns the function that the caller of _tryCall
         * intended to call.
         */
        function _getBoundFn(arguments1) {
          var fn = arguments1[0];
          if (TypeUtils.isFunction(fn)) {
            var fnArgs = Array.prototype.slice.call(arguments1, 1);
            return fn.bind.apply(fn, [_api].concat(fnArgs));
          }
        }

        return _commandType.markAsType(_api);
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var cmdBase = module();
      return cmdBase;
    }
  };

  var _commandType = TypeUtils.createNewType('commandBase');

  return _factory;
});
