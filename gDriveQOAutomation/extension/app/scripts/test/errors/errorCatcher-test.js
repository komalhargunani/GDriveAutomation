/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for the errorCatcher
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/messageBus/messageBus'
  ], function(
    ErrorCatcher,
    MsgBus) {

  'use strict';

  describe("ErrorCatcher", function() {

    // we can't test uncaught exceptions, since jasmine catches them
    // so we just verify that we at least listen for them after init
    beforeEach(function() {
      sinon.spy(window, 'addEventListener');
      ErrorCatcher.init();
      sinon.assert.calledWith(window.addEventListener, 'error');
      window.addEventListener.restore();
      assert.equal(ErrorCatcher.observers.length, 0);

      // mock out msg bus so we can verify the sync logic works
      sinon.spy(MsgBus, 'pushMessage');
    });

    afterEach(function() {
      assert.equal(ErrorCatcher.observers.length, 0);

      sinon.spy(window, 'removeEventListener');
      ErrorCatcher.reset();
      sinon.assert.calledWith(window.removeEventListener, 'error');
      window.removeEventListener.restore();

      MsgBus.pushMessage.restore();
    });

    it("should allow me to add an observer", function() {
      assert.doesNotThrow(function() {
        ErrorCatcher.addObserver(function(){});
      });
    });

    it("should call observers for errors", function() {
      var callback = sinon.spy();
      ErrorCatcher.addObserver(callback);
      ErrorCatcher.handleError(new Error('foobar'));

      assert(callback.called);
    });

    it("should sync the error over the msg bus", function() {
      ErrorCatcher.handleError(new Error('foobar'));

      assert(MsgBus.pushMessage.called);
    });



  });
});

