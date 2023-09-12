// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @module coreFailureHandler
 * @desc Used by CommandManager to handle instances of CoreFailure thrown by
 * the DCP phase of CommandBase.
 * @author ganetsky@google.com (Jason Ganetsky)
 */
define([
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/commands/revertManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/generic'
  ], function(
    PromiseUtils,
    TypeUtils,
    RevertManager,
    PubSub,
    GenericError) {

  'use strict';

  function handle_(coreFailure) {
    TypeUtils.checkArgTypes('CoreFailureHandler', {
      coreFailure: [coreFailure, 'coreFailure']
    });
    return PromiseUtils.cast(revertAll_())
        .then(maybeDispatchEvent_.bind(undefined, coreFailure));
  }

  function revertAll_() {
    PubSub.publish('qowt:stateChange', {
      module: 'commandManager',
      state: 'reverting'
    });
    return PromiseUtils.cast(RevertManager.revertAll())
        .then(function() {
          PubSub.publish('qowt:stateChange', {
            module: 'commandManager',
            state: 'idle'
          });
        });
  }

  function maybeDispatchEvent_(coreFailure) {
    var errorPolicy = coreFailure.errorPolicy;
    var error = coreFailure.error;

    if (errorPolicy && !errorPolicy.eventDispatched) {
      // Here's our default policy for handling DCP response errors
      // when the failed commands choose not to handle it themselves.
      // TODO: we need to match up the error ids with the
      // response.e coming up from the service. Thus, commands need not do
      // any event dispatching - it can all be done by cmdManager
      var evt = GenericError.create();
      // add the original error as additional info so we can log it.
      evt.additionalInfo = error;
      // JELTE TODO: we should make the publish function smart enough
      // to take a single object argument (the event) and fish the
      // eventType from the event
      return PubSub.publish(evt.eventType, evt);
    }
  }

  return {
    handle: handle_
  };
});
