/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit tests for the Dom Listener module
 *
 * @author jelte@google.com (Jelte Liebrand)
 */



define([
  'qowtRoot/unittests/utils/fakeEvents',
  'qowtRoot/utils/domListener'
], function(
    FakeEvents,
    DomListener) {

  'use strict';

  describe('handlers', function() {

    var alphaListener1Handler;
    var betaListener1Handler;
    var betaListener2Handler;
    var naughtyListenerHandler;

    var alphaListener1 = {
      handleEvent: function(event) {
        expect(function() {
          this.doHandleEvent(event);
        }.bake(this)).not.toThrow();
      },
      doHandleEvent: function(event) {
        expect(event.type).toBe('qowt:alpha');
        expect(event.eventName).toBe('qowt:alpha');
        expect(event.detail).toBeDefined();
        expect(event.detail.foo).toBeDefined();
        expect(event.detail.foo).toBe('bar');
      }
    };
    var betaListener1 = {
      handleEvent: function(event) {
        expect(function() {
          this.doHandleEvent(event);
        }.bake(this)).not.toThrow();
      },
      doHandleEvent: function(event) {
        expect(event.type).toBe('qowt:beta');
        expect(event.eventName).toBe('qowt:beta');
        expect(event.detail).toBeDefined();
        expect(event.detail.foo).toBeDefined();
        expect(event.detail.foo).toBe('bar');
      }
    };
    var betaListener2 = {
      handleEvent: function(event) {
        expect(function() {
          this.doHandleEvent(event);
        }.bake(this)).not.toThrow();
      },
      doHandleEvent: function(event) {
        expect(event.type).toBe('qowt:beta');
        expect(event.eventName).toBe('qowt:beta');
        expect(event.detail).toBeDefined();
        expect(event.detail.foo).toBeDefined();
        expect(event.detail.foo).toBe('bar');
      }
    };
    var naughtyListener = {
      handleEvent: function(event) {
        expect(function() {
          this.doHandleEvent(event);
        }.bake(this)).toThrow();
      },
      doHandleEvent: function() {
        throw ('I am a naughty event handler');
      }
    };

    beforeEach(function() {
      spyOn(alphaListener1, 'handleEvent').andCallThrough();
      spyOn(betaListener1, 'handleEvent').andCallThrough();
      spyOn(betaListener2, 'handleEvent').andCallThrough();
      spyOn(naughtyListener, 'handleEvent').andCallThrough();

      alphaListener1Handler = alphaListener1.handleEvent.bake(alphaListener1);
      betaListener1Handler = betaListener1.handleEvent.bake(betaListener1);
      naughtyListenerHandler = naughtyListener.handleEvent.bake(
          naughtyListener);
      betaListener2Handler = betaListener2.handleEvent.bake(betaListener2);

      DomListener.addListener(document, 'qowt:alpha', alphaListener1Handler);
      DomListener.addListener(document, 'qowt:beta', betaListener1Handler);
      DomListener.addListener(document, 'qowt:beta', naughtyListenerHandler);
      DomListener.addListener(document, 'qowt:beta', betaListener2Handler);
    });

    afterEach(function() {
      DomListener.removeListener(document, 'qowt:alpha', alphaListener1Handler);
      DomListener.removeListener(document, 'qowt:beta', betaListener1Handler);
      DomListener.removeListener(document, 'qowt:beta', naughtyListenerHandler);
      DomListener.removeListener(document, 'qowt:beta', betaListener2Handler);
    });

    it('should notify correct observer for alpha event dispatch', function() {
      DomListener.dispatchEvent(document, 'qowt:alpha', {foo: 'bar'});
      expect(alphaListener1.handleEvent).wasCalled();
      expect(betaListener1.handleEvent).wasNotCalled();
      expect(naughtyListener.handleEvent).wasNotCalled();
      expect(betaListener2.handleEvent).wasNotCalled();
    });

    it('should notify correct observers for beta event dispatch even if ' +
        'one handler is naughty and throws', function() {
          DomListener.dispatchEvent(document, 'qowt:beta', {foo: 'bar'});
          expect(alphaListener1.handleEvent).wasNotCalled();
          expect(betaListener1.handleEvent).wasCalled();
          expect(naughtyListener.handleEvent).wasCalled();
          expect(betaListener2.handleEvent).wasCalled();
        });

    it('should remove all listeners against a specific ID', function() {
      var callbacks = {
        one: function() {
        },
        two: function() {
        },
        three: function() {
        }
      };
      var spy1 = spyOn(callbacks, 'one');
      var spy2 = spyOn(callbacks, 'two');
      var spy3 = spyOn(callbacks, 'three');
      var id = 'test';
      var x = document.createElement('div');
      DomListener.add(id, x, 'click', callbacks.one);
      DomListener.add(id, x, 'click', callbacks.three);

      FakeEvents.simulate(x, 'click');

      expect(callbacks.one).toHaveBeenCalled();
      expect(callbacks.two).not.toHaveBeenCalled();
      expect(callbacks.three).toHaveBeenCalled();

      spy1.reset();
      spy2.reset();
      spy3.reset();

      DomListener.removeGroup(id);

      FakeEvents.simulate(x, 'click');

      expect(callbacks.one).not.toHaveBeenCalled();
      expect(callbacks.two).not.toHaveBeenCalled();
      expect(callbacks.three).not.toHaveBeenCalled();

    });

  });

  describe('utils/domListener.js', function() {

    beforeEach(function() {
      this.handler1 = function() {};
      this.handler2 = function() {};
      this.handler3 = function() {};
      this.handler4 = function() {};
      spyOn(this, 'handler1').andCallThrough();
      spyOn(this, 'handler2').andCallThrough();
      spyOn(this, 'handler3').andCallThrough();
      spyOn(this, 'handler4').andCallThrough();
    });

    afterEach(function() {});

    it('should notify single listener to specific event', function() {
      DomListener.addListener(document, 'qowt:test', this.handler1);

      DomListener.dispatchEvent(document, 'qowt:test', {});

      expect(this.handler1).wasCalled();
      expect(this.handler1.callCount).toBe(1);

      // cleanup
      DomListener.removeListener(document, 'qowt:test', this.handler1);
    });

    it('should notify multiple listeners to a specific event', function() {
      DomListener.addListener(document, 'qowt:test', this.handler1);
      DomListener.addListener(document, 'qowt:test', this.handler2);
      DomListener.addListener(document, 'qowt:test', this.handler3);
      DomListener.addListener(document, 'qowt:test', this.handler4);

      DomListener.dispatchEvent(document, 'qowt:test', {});

      expect(this.handler1).wasCalled();
      expect(this.handler2).wasCalled();
      expect(this.handler3).wasCalled();
      expect(this.handler4).wasCalled();
      expect(this.handler1.callCount).toBe(1);
      expect(this.handler2.callCount).toBe(1);
      expect(this.handler3.callCount).toBe(1);
      expect(this.handler4.callCount).toBe(1);

      // cleanup
      DomListener.removeListener(document, 'qowt:test', this.handler1);
      DomListener.removeListener(document, 'qowt:test', this.handler2);
      DomListener.removeListener(document, 'qowt:test', this.handler3);
      DomListener.removeListener(document, 'qowt:test', this.handler4);
    });

    it('should only notify listeners of a specific event uppon that trigger; ' +
        'not listeners for other events', function() {
          DomListener.addListener(document, 'qowt:test', this.handler1);
          DomListener.addListener(document, 'qowt:someOtherEvent',
              this.handler2);
          DomListener.addListener(document, 'qowt:test', this.handler3);
          DomListener.addListener(document, 'qowt:test', this.handler4);

          DomListener.dispatchEvent(document, 'qowt:test', {});

          expect(this.handler1).wasCalled();
          expect(this.handler3).wasCalled();
          expect(this.handler4).wasCalled();
          expect(this.handler1.callCount).toBe(1);
          expect(this.handler3.callCount).toBe(1);
          expect(this.handler4.callCount).toBe(1);

          expect(this.handler2).not.wasCalled();
          expect(this.handler2.callCount).toBe(0);

          // cleanup
          DomListener.removeListener(document, 'qowt:test', this.handler1);
          DomListener.removeListener(document, 'qowt:someOtherEvent',
              this.handler2);
          DomListener.removeListener(document, 'qowt:test', this.handler3);
          DomListener.removeListener(document, 'qowt:test', this.handler4);
        });

    it('should no longer notify a listener once it has removed itself for a ' +
        'given event', function() {
          DomListener.addListener(document, 'qowt:test', this.handler1);
          DomListener.addListener(document, 'qowt:test', this.handler2);
          DomListener.addListener(document, 'qowt:test', this.handler3);
          DomListener.addListener(document, 'qowt:test', this.handler4);


          DomListener.removeListener(document, 'qowt:test', this.handler2);

          DomListener.dispatchEvent(document, 'qowt:test', {});

          expect(this.handler1).wasCalled();
          expect(this.handler3).wasCalled();
          expect(this.handler4).wasCalled();
          expect(this.handler1.callCount).toBe(1);
          expect(this.handler3.callCount).toBe(1);
          expect(this.handler4.callCount).toBe(1);

          expect(this.handler2).not.wasCalled();
          expect(this.handler2.callCount).toBe(0);

          // cleanup
          DomListener.removeListener(document, 'qowt:test', this.handler1);
          DomListener.removeListener(document, 'qowt:test', this.handler3);
          DomListener.removeListener(document, 'qowt:test', this.handler4);
        });
  });
});
