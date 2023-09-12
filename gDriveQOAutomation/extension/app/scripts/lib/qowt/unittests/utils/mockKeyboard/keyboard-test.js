/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define(['qowtRoot/utils/mockKeyboard/keyboard'], function(Keyboard) {

  'use strict';

  describe('Mock Keyboard - keyboard', function() {

    beforeEach(function() {
      Keyboard.reset();
    });

    it('state property should be read only, ' +
       'and set to "not started"', function() {
      expect(Keyboard.state).toBeDefined();
      expect(Keyboard.state).toBe('not started');
      var lastState = Keyboard.state;
      expect(function() {
        Keyboard.state = 'XXX';
      }).toThrow();
      expect(Keyboard.state).toBe(lastState);
    });

    it('should be in an idle state after use, ' +
       'should be able to waitFor the keyboard state, ' +
       'and the state methods should return the correct value', function() {
      runs(function() {
        expect(Keyboard.state).toBe('not started');
        expect(Keyboard.isIdle()).toBe(false);
        expect(Keyboard.isIdleOrNotStarted()).toBe(true);
        Keyboard.type();
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(Keyboard.state).toBe('idle');
        expect(Keyboard.isIdle()).toBe(true);
        expect(Keyboard.isIdleOrNotStarted()).toBe(true);
      });
    });

  });

  return {};

});
