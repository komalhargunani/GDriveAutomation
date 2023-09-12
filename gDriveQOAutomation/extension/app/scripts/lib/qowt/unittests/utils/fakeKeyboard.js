/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview helper utility for the text tool unit
 * tests. This module allows us to programmatically "edit"
 * the document by faking key events. In order for the
 * events to work, we need to simulate key down + key press +
 * textInput + key up events....
 *
 * TODO dtilley: remove this module once all E2E tests have
 * been migrated to the new mock keyboard.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var _api = {

    setTarget: function(target) {
      _target = target;
    },

    isIdle: function() {
      return _state === 'idle';
    },

    isIdleOrNotStarted: function() {
      return _state === 'idle' || _state === 'not started';
    },

    reset: function() {
      _state = 'not started';
      _target = document;
    },

    typeText: function(textToType) {
      _addToBuffer(textToType);
    },

    hitEnter: function() {
      _addToBuffer('\n');
    },

    hitCR: function() {
      _addToBuffer('\r\n');
    },

    /*
    // LM NOTE: It seems that the browser does not recognise/allow fake
    // tab keystrokes, so I'm commenting out this method with a note,
    // (rather than removing it) incase someone tries to introduce
    // a similar method later on and wonders why their test doesn't work
    hitTab: function() {
      _addToBuffer('\t');
    },
    */

    /**
     * Create keyboard events with key modifiers.
     * @param {Object} modifiers Key modifiers in an Object
     *                 modifiers.osCmd (Set Meta on OSX, Ctrl on Win/Unix)
     *                 modifiers.control
     *                 modifiers.alt
     *                 modifiers.shift
     *                 modifiers.meta
     *                 modifiers.altGraph
     * @param {String} key
     */
    modifiedKeydown: function(modifiers, key) {
      _modKeyBuffer.push({modifiers: modifiers, key: key});
      // Note: using the form-feed character to indicate a modified key press
      // as I don't think there is a way to create this character naturally
      // via text input from the keyboard, so hijacking it should be ok.
      _addToBuffer('\f');
    },

    // WARNING: this will fire directly; even if the keyboard
    // is still typing!
    hitEscape: function() {
      var dispatchKeyboardEvent = function(target) {
        var evt = document.createEvent('KeyboardEvent');
        evt.initKeyboardEvent.apply(evt,
            Array.prototype.slice.call(arguments, 1));
        try {
          Object.defineProperty(evt, 'keyCode',
              { get: function() { return 27; }});
        } catch (err) {}
        try {
          Object.defineProperty(evt, 'which', {get: function() { return 27; }});
        } catch (err) {}
        target.dispatchEvent(evt);
      };
      dispatchKeyboardEvent(_target, 'keydown', true, true,
          document.defaultView, 'U+0027', 0);
      dispatchKeyboardEvent(_target, 'keyup', true, true, document.defaultView,
          'U+0027', 0);
    },

    /**
     * hit shift + enter.
     */
    hitShiftEnter: function() {
      _modKeyBuffer.push({modifiers: {shift: true}, key: '\r'});
      _modifiedKeydown();
      _modKeyBuffer.push({modifiers: {shift: true}, key: '\r'});
      _modifiedKeyup();
    }
  };

  // PRIVATE ===================================================================

  var _target = document,
      _textBuffer = '',
      _modKeyBuffer = [],
      _state = 'not started',
      _isMacOs = (navigator.userAgent.indexOf('Mac OS X') !== -1);


  function _addToBuffer(text) {
    _textBuffer += text;
    if (_state !== 'typing') {
      _state = 'typing';
      window.setTimeout(_keyboardWork, 0);
    }
  }

  function _modifiedKey(keypressType) {
    var thisParams = _modKeyBuffer.pop(),
        modifiers = thisParams.modifiers,
        key = thisParams.key;
    if (modifiers.osCmd) {
      modifiers[_isMacOs ? 'meta' : 'control'] = true;
    }
    var code = key.charCodeAt(0);
    var e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent(
        keypressType, true, true,
        window,
        key,
        0,
        !!modifiers.control,
        !!modifiers.alt,
        !!modifiers.shift,
        !!modifiers.meta,
        !!modifiers.altGraph);
    // The above init method does not set the keyCode, charCode or which
    // properties, now we try to force these properties onto the object.
    Object.defineProperty(e, 'charCode', {get: function() {return code;}});
    Object.defineProperty(e, 'keyCode', {get: function() {return code;}});
    Object.defineProperty(e, 'which', {get: function() {return code;}});
    _target.dispatchEvent(e);
  }

  function _modifiedKeydown() {
    _modifiedKey('keydown');
  }

  function _modifiedKeyup() {
    _modifiedKey('keyup');
  }

  function _keyboardWork() {
    if (_textBuffer.length > 0) {
      _state = 'typing';
      var letter = _textBuffer[0];
      _textBuffer = _textBuffer.substring(1);
      if (letter === '\f') {
        _modifiedKeydown();
      } else {
        document.execCommand("insertText", false, letter);
      }
      window.setTimeout(_keyboardWork, 0);
    } else {
      _state = 'idle';
    }
  }

  return _api;

});
