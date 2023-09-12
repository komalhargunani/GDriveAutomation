// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @module Tests for coreFailureHandler.
 * @author ganetsky@google.com (Jason Ganetsky)
 */
define([
  'qowtRoot/commands/coreFailure',
  'qowtRoot/commands/coreFailureHandler',
  'qowtRoot/commands/revertManager',
  'qowtRoot/events/errors/generic',
  'qowtRoot/pubsub/pubsub'
  ], function(
    CoreFailure,
    CoreFailureHandler,
    RevertManager,
    GenericError,
    PubSub) {

  'use strict';

  describe('commands/coreFailureHandler.js', function() {
    it('should revert and not publish an error by default', function() {
      return CoreFailureHandler.handle(CoreFailure.create({}));
    });

    it('should revert and not publish an error if already dispatched',
        function() {
      return CoreFailureHandler.handle(CoreFailure.create({
        errorPolicy: { eventDispatched: true },
        error: 'foo'
      }));
    });

    it('should revert and publish an error if the coreFailure object says so',
        function() {
      var expectedInfo = 'error text';
      var errorObj = GenericError.create();
      errorObj.additionalInfo = expectedInfo;

      expectedEvents.push(stripErrorObj_(errorObj));

      return CoreFailureHandler.handle(CoreFailure.create({
        errorPolicy: { eventDispatched: false },
        error: expectedInfo
      }));
    });

    var events;
    var expectedEvents;
    var subscribeTokens;
    var reverted;
    var revertCalled;
    beforeEach(function() {
      events = [];
      subscribeTokens = [];
      subscribeTokens.push(PubSub.subscribe('qowt:stateChange',
          function(eventName, eventData) {
        expect(eventName).toBe('qowt:stateChange');
        events.push(eventData);
        if (eventData.state === 'reverting') {
          expect(revertCalled).toBe(false);
          expect(reverted).toBe(false);
        }
        if (eventData.state === 'idle') {
          expect(revertCalled).toBe(true);
          expect(reverted).toBe(true);
        }
      }));
      subscribeTokens.push(PubSub.subscribe('qowt:error',
          function(eventName, eventData) {
        expect(eventName).toBe('qowt:error');
        events.push(stripErrorObj_(eventData));
        expect(revertCalled).toBe(true);
        expect(reverted).toBe(true);
      }));
      reverted = false;
      revertCalled = false;

      expectedEvents = [{
        module: 'commandManager',
        state: 'reverting'
      }, {
        module: 'commandManager',
        state: 'idle'
      }];

      spyOn(RevertManager, 'revertAll').andCallFake(function() {
        expect(events.length).toBe(1);
        expect(revertCalled).toBe(false);
        revertCalled = true;
        return Promise.resolve().then(function() {
          expect(reverted).toBe(false);
          reverted = true;
        });
      });
    });
    afterEach(function() {
      subscribeTokens.forEach(PubSub.unsubscribe);
      expect(events).toEqual(expectedEvents);
      expect(revertCalled).toBe(true);
      expect(reverted).toBe(true);
    });
  });

  function stripErrorObj_(error) {
    return {
      errorId: error.errorId,
      eventType: error.eventType,
      fatal: error.fatal,
      additionalInfo: error.additionalInfo
    };
  }
});