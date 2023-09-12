define([
  'qowtRoot/utils/platform',
  'qowtRoot/utils/mockKeyboard/keyboard',
  'qowtRoot/utils/mockKeyboard/text',
  'qowtRoot/utils/mockKeyboard/keys'], function(
  Platform,
  Keyboard,
  text,
  keys) {
  'use strict';

  describe('Mock Keyboard - System Test - Dispatching Events', function() {
    var undo_ = Platform.isOsx ? keys('cmd', 'z') : keys('ctrl', 'z'),
        redo_ = Platform.isOsx ? keys('cmd', 'y') : keys('ctrl', 'y');

    var eventCache_, eventOrder_,
        expectedKeyupDownEvent_ = {
          _a: {charCode: 0, keyCode: 65, keyIdentifier: 'U+0061'},
          _b: {charCode: 0, keyCode: 66, keyIdentifier: 'U+0062'},
          _c: {charCode: 0, keyCode: 67, keyIdentifier: 'U+0063'},
          _1: {charCode: 0, keyCode: 49, keyIdentifier: 'U+0031'},
          _2: {charCode: 0, keyCode: 50, keyIdentifier: 'U+0032'},
          _3: {charCode: 0, keyCode: 51, keyIdentifier: 'U+0033'}
        },
        expectedKeypressEvent_ = {
          _a: {charCode: 97, keyCode: 97, keyIdentifier: 'U+0061'},
          _b: {charCode: 98, keyCode: 98, keyIdentifier: 'U+0062'},
          _c: {charCode: 99, keyCode: 99, keyIdentifier: 'U+0063'},
          _1: {charCode: 49, keyCode: 49, keyIdentifier: 'U+0031'},
          _2: {charCode: 50, keyCode: 50, keyIdentifier: 'U+0032'},
          _3: {charCode: 51, keyCode: 51, keyIdentifier: 'U+0033'}
        };

    function captureEvt_(evt) {
      eventCache_[evt.type].push(evt);
      eventOrder_.push(evt.type);
    }

    // Takes an object that looks like eventCache_ matches any existing object
    // and properties to the corresponding index in the event cache
    function expectCapturedEvents_(toBe) {
      var evts = Object.keys(eventCache_);
      evts.forEach(function(evtName) {
        if (toBe[evtName]) {
          expect(eventCache_[evtName].length).toBe(toBe[evtName].length);
          toBe[evtName].forEach(function(evt, idx) {
            Object.keys(evt).forEach(function(attName) {
              var capAtt = eventCache_[evtName][idx][attName],
                  evtAtt = evt[attName];
              expect(capAtt).toBe(evtAtt);
            });
          });
        }
      });
    }

    // Takes an array of event names and matches to captured events names
    function expectEventsIn_(thisOrder) {
      expect(eventOrder_.length).toBe(thisOrder.length);
      thisOrder.forEach(function(evtName, idx) {
        expect(eventOrder_[idx]).toBe(evtName);
      });
    }

    beforeEach(function() {
      Keyboard.reset();
      eventCache_ = {
        keydown: [],
        keypress: [],
        keyup: []
      };
      eventOrder_ = [];
      document.addEventListener('keydown', captureEvt_, true);
      document.addEventListener('keypress', captureEvt_, true);
      document.addEventListener('keyup', captureEvt_, true);
    });

    afterEach(function() {
      document.removeEventListener('keydown', captureEvt_, true);
      document.removeEventListener('keypress', captureEvt_, true);
      document.removeEventListener('keyup', captureEvt_, true);
      eventCache_ = undefined;
      eventOrder_ = undefined;
    });

    it('should type text', function() {
      var expectedKeyupDownEvents = [
            expectedKeyupDownEvent_._a,
            expectedKeyupDownEvent_._b,
            expectedKeyupDownEvent_._c,
            expectedKeyupDownEvent_._1,
            expectedKeyupDownEvent_._2,
            expectedKeyupDownEvent_._3],
          expectedKeypressEvents = [
            expectedKeypressEvent_._a,
            expectedKeypressEvent_._b,
            expectedKeypressEvent_._c,
            expectedKeypressEvent_._1,
            expectedKeypressEvent_._2,
            expectedKeypressEvent_._3];
      runs(function() {
        Keyboard.type(text('abc'), text('123'));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expectCapturedEvents_({
          keydown: expectedKeyupDownEvents,
          keypress: expectedKeypressEvents,
          keyup: expectedKeyupDownEvents
        });
        expectEventsIn_([
          'keydown', 'keypress', 'keyup',
          'keydown', 'keypress',  'keyup',
          'keydown', 'keypress', 'keyup',
          'keydown', 'keypress',  'keyup',
          'keydown', 'keypress',  'keyup',
          'keydown', 'keypress',  'keyup'
        ]);
      });
    });

    it('should type keys', function() {
      runs(function() {
        Keyboard.type(keys('a', 'b', 'c'), keys('1', '2', '3'));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expectCapturedEvents_({
          keydown: [
            expectedKeyupDownEvent_._a,
            expectedKeyupDownEvent_._b,
            expectedKeyupDownEvent_._c,
            expectedKeyupDownEvent_._1,
            expectedKeyupDownEvent_._2,
            expectedKeyupDownEvent_._3],
          keypress: [
            expectedKeypressEvent_._a,
            expectedKeypressEvent_._b,
            expectedKeypressEvent_._c,
            expectedKeypressEvent_._1,
            expectedKeypressEvent_._2,
            expectedKeypressEvent_._3],
          keyup: [
            expectedKeyupDownEvent_._c,
            expectedKeyupDownEvent_._b,
            expectedKeyupDownEvent_._a,
            expectedKeyupDownEvent_._3,
            expectedKeyupDownEvent_._2,
            expectedKeyupDownEvent_._1]
        });
        expectEventsIn_([
          'keydown', 'keypress',
          'keydown', 'keypress',
          'keydown', 'keypress',
          'keyup', 'keyup', 'keyup',
          'keydown', 'keypress',
          'keydown', 'keypress',
          'keydown', 'keypress',
          'keyup', 'keyup', 'keyup'
        ]);
      });
    });

    it('should repeat text', function() {
      runs(function() {
        Keyboard.type(text('x').repeat(10));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(eventCache_.keydown.length).toBe(10);
        expect(eventCache_.keypress.length).toBe(10);
        expect(eventCache_.keyup.length).toBe(10);
        expect(eventOrder_.length).toBe(30);
      });
    });

    it('should repeat keys', function() {
      runs(function() {
        Keyboard.type(keys('i', 'j').repeat(5));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(eventCache_.keydown.length).toBe(10);
        expect(eventCache_.keypress.length).toBe(10);
        expect(eventCache_.keyup.length).toBe(10);
        expect(eventOrder_.length).toBe(30);
      });
    });

    it('should apply modifiers to keys', function() {
      runs(function() {
        Keyboard.type(keys('shift', 'x', '1'));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(eventCache_.keydown.length).toBe(3);
        expect(eventCache_.keypress.length).toBe(2);
        expect(eventCache_.keyup.length).toBe(3);
        expect(eventOrder_.length).toBe(8);
        // Shift key applied
        expect(eventCache_.keydown[0].shiftKey).toBe(true);
        expect(eventCache_.keydown[1].shiftKey).toBe(true);
        expect(eventCache_.keydown[2].shiftKey).toBe(true);
        expect(eventCache_.keypress[0].shiftKey).toBe(true);
        expect(eventCache_.keypress[1].shiftKey).toBe(true);
        expect(eventCache_.keyup[0].shiftKey).toBe(true);
        expect(eventCache_.keyup[1].shiftKey).toBe(true);
        expect(eventCache_.keyup[2].shiftKey).toBe(false);
      });
    });

    it('should not insert text for control / meta modified keys', function() {
      runs(function() {
        Keyboard.type(text('x'), undo_, redo_);
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(eventCache_.keydown.length).toBe(5);
        expect(eventCache_.keypress.length).toBe(1);
        expect(eventCache_.keyup.length).toBe(5);
        expect(eventOrder_.length).toBe(11);
        expectEventsIn_([
          'keydown', 'keypress', 'keyup',
          'keydown', 'keydown', 'keyup', 'keyup',
          'keydown', 'keydown', 'keyup', 'keyup'
        ]);
      });
    });

    it('should not insert text for shift alt modified keys', function() {
      runs(function() {
        Keyboard.type(keys('shift', 'alt', 'x'));
      });
      waitsFor(Keyboard.isIdle, 'Waiting for mock keyboard', 5000);
      runs(function() {
        expect(eventCache_.keydown.length).toBe(3);
        expect(eventCache_.keypress.length).toBe(0);
        expect(eventCache_.keyup.length).toBe(3);
        expect(eventOrder_.length).toBe(6);
        expectEventsIn_([
          'keydown', 'keydown', 'keydown',
          'keyup', 'keyup', 'keyup'
        ]);
      });
    });

  });

  return {};
});
