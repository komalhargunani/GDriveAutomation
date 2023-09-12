// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview pure optimistic command to break a text run
 * at a given character offset.
 * nothing is sent to the CORE; the optimistic changes should be
 * monitored by the Dom Mutation Observer (in our Text Tool) which
 * will in return result in commands being generated to be sent to
 * the core service
 *
 * @author jelte@google.com (Jelte Liebrand)
 */



define([
  'qowtRoot/features/utils',
  'qowtRoot/commands/commandBase'], function(
    Features,
    CommandBase) {

  'use strict';

  var _factory = {

    create: function(context) {

      // Error check parameters
      if (!context) {
        throw new Error('BreakRunCmd missing context');
      }
      if (!context.node) {
        throw new Error('BreakRunCmd missing context.node');
      }
      if (context.offset === undefined) {
        throw new Error('BreakRunCmd missing context.offset');
      }


      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==true, callsService==false)
          var _api = CommandBase.create('breakRun', true, false);

          /**
           * optimistically break the text run. This will only break the
           * run if needed, and ensure the selection if set will be reset
           * in the correct place.
           */
          _api.doOptimistic = function() {
            var node = context.node.nodeType === Node.TEXT_NODE ?
                context.node.parentNode : context.node;

            if (node instanceof QowtWordRun || node instanceof QowtPointRun) {
              node.breakRun(context.offset);
            } else {
              throw new Error('BreakRun error: node is not a QowtRun!');
            }
          };

          _api.onSuccess = function() {
            if (Features.isEnabled('logMutations')) {
              console.log(_api.name + ' success');
            }
          };

          _api.onFailure = function(response) {
            console.error(_api.name + " command - failed: " + response.e);
          };

          /**
           * We do not need to revert anything. Revert is needed when the
           * dcp returned an error; but we do not send anything to dcp
           * Instead the DomMutation commands will ensure things get
           * reverted if somethign went wrong on dcp side
           */
          _api.doRevert = function() {};

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