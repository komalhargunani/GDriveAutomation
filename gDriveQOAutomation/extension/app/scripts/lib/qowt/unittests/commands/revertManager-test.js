// Copyright 2013 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/revertManager',
  'qowtRoot/promise/testing/promiseTester'
], function(
    RevertManager,
    PromiseTester) {

  'use strict';

  describe('commands/revertManager.js', function() {
    var _events = [];
    var _tokens = [];
    var _nTokens = 10;
    beforeEach(function() {
      _events = [];
      _tokens = [];
      for (var i = 0; i < _nTokens; i++) {
        _tokens.push(RevertManager.createToken());
      }
    });
    var _scheduleToken = function(id) {
      _tokens[id].schedule(function() {
        Promise.resolve().then(function() {
          _events.push(id);
        });
      });
    };
    var _completeToken = function(id) {
      _tokens[id].complete();
    };
    describe('successful revert', function() {
      var expectedEvents;
      afterEach(function() {
        return new PromiseTester(RevertManager.revertAll())
            .onlyThen(function() {
          expect(_events).toEqual(expectedEvents);
        });
      });
      it('should revert the pending revert tokens in reverse order',
          function() {
        _scheduleToken(2);
        _scheduleToken(5);
        _scheduleToken(6);

        _completeToken(2);

        _scheduleToken(4);
        _scheduleToken(7);

        _completeToken(5);

        expectedEvents = [7, 4, 6];
      });

      it('should not revert if everything is cancelled',
          function() {
        _scheduleToken(2);
        _scheduleToken(5);
        _scheduleToken(6);

        _completeToken(2);

        _scheduleToken(4);
        _scheduleToken(7);

        _completeToken(5);

        RevertManager.cancelAll();

        expectedEvents = [];
      });

      it('should revert nothing if all tokens have completed', function() {
        _scheduleToken(2);
        _scheduleToken(5);
        _scheduleToken(6);

        _completeToken(2);

        _scheduleToken(4);
        _scheduleToken(7);

        _completeToken(5);
        _completeToken(6);
        _completeToken(4);
        _completeToken(7);

        expectedEvents = [];
      });
    });
    it('should throw exception if completion happens out of order', function() {
      _scheduleToken(2);
      _scheduleToken(5);
      _scheduleToken(6);
      _completeToken(2);

      expect(_completeToken.bind(this, 6)).toThrow();
    });
  });
});
