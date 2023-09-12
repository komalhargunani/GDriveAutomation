/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Mock Keyboard, provides a type function that generates
 * keyboard and textInput events to simulate user interaction.
 *
 * Usage:
 *
 * Make sure to import the text & keys modules from utils/mockKeyboard
 * which provide the text() and keys() methods.
 *
 * The two methods will generate different sequences of events,
 * sequential for text() and interleaved for keys().
 *
 * So for example:
 * Keyboard.type(text('ab')); would produce:
 * keydown(a) keyup(a) keydown(b) keyup(b)
 * However,
 * Keyboard.type(keys('a', 'b')); would produce:
 * keydown(a) keydown(b) keyup(b) keyup(a)
 *
 * Therefore text('⌘x') would not invoke the "cut" command,
 * but keys('⌘', 'x') would invoke the command.
 *
 * // Type 'hello'.
 * Keyboard.type(text('hello'));
 *
 * // Special keys can be mocked as well.
 * Keyboard.type(text('↵'));
 * Keyboard.type(keys('Enter'));
 *
 * // Use either modifiers or special names.
 * Keyboard.type(keys('shift', 'ctrl', 'alt', 'command'));
 * Keyboard.type(keys('⇧', '⌃', '⌥', '⌘'));
 *
 * // Use a character in a key call to mock a shortcut.
 * // Example: Cut, the Command key will be held down then the x key pressed.
 * Keyboard.type(keys('⌘', 'x'));
 *
 * // Keys and text can be repeated.
 * Keyboard.type(keys('⇧', 'up').repeat(4));
 * Keyboard.type(text('hello ').repeat(10));
 *
 * // Combine text and keys to create an interaction.
 * Keyboard.type(text('=sum(A1:B4)'), keys('enter'));
 *
 * Note: Promise implementation native from Chrome 32.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/typeUtils'], function(
  Features,
  TypeUtils) {

  'use strict';

  var Keyboard = function() {
    // Enabling the 'debugMockKeyboard' feature will
    // write out any generated events to the console.
    startListening_();
  };
  Keyboard.prototype = Object.create(
    Object.prototype,
    { state: { get: function() { return state_; } } }
  );
  Keyboard.prototype.constructor = Keyboard;

  /**
   * Used in unit tests to wait for the asynchronous
   * typing to finish before testing results.
   * @return {Boolean}
   */
  Keyboard.prototype.isIdle = function() {
    return (state_ === 'idle');
  };

  /**
   * Used in E2E tests to ensure all interaction and
   * resultant commands are complete before testing.
   * @return {Boolean}
   */
  Keyboard.prototype.isIdleOrNotStarted = function() {
    return ((state_ === 'idle') || (state_ === 'not started'));
  };

  /**
   * This is the main function to simulate
   * a user typing on a keyboard.
   * @param {Object} This function accepts any number of objects
   * created by either the keys or text functions. These two
   * functions return objects that should have the following method:
   *   execute: {Function} Returns a promise that creates events.
   * @return {Promise}
   */
  Keyboard.prototype.type = function() {
    state_ = 'typing';
    var keysAndText = Array.prototype.slice.call(arguments);
    return keysAndText.reduce(
      function(sequence, typePromise) {
        return sequence.then(function() {
          return typePromise.execute(target_);
        });
      }, Promise.resolve()
    ).then(function() {
      state_ = 'idle';
    });
  };

  /**
   * Set the node for keyboard & text events to target.
   * @param {Node} target.
   */
  Keyboard.prototype.setTarget = function(target) {
    if (TypeUtils.isNode(target)) {
      target_ = target;
    }
  };

  /**
   * Used by unit tests in between suites to ensure subsequent
   * tests are not interacting with previous tests.
   */
  Keyboard.prototype.reset = function() {
    stopListening_();
    startListening_();
    state_ = 'not started';
    target_ = document;
  };

  // PRIVATE ===================================================================

  var state_ = 'not started',
      target_ = document,
      singleton_ = new Keyboard();

  function startListening_() {
    document.addEventListener('keydown', logEvents_, true);
    document.addEventListener('keypress', logEvents_, true);
    document.addEventListener('textInput', logEvents_, true);
    document.addEventListener('keyup', logEvents_, true);
  }

  function stopListening_() {
    document.removeEventListener('keydown', logEvents_, true);
    document.removeEventListener('keypress', logEvents_, true);
    document.removeEventListener('textInput', logEvents_, true);
    document.removeEventListener('keyup', logEvents_, true);
  }

  var logColors_ = {
    keydown: 'background:#cff;',
    keypress: 'background:#fcf;',
    textInput: 'background:#fcc;',
    keyup: 'background:#cfc;'
  };

  function logEvents_(evt) {
    if (Features.isEnabled('debugMockKeyboard')) {
      if (evt && (evt.origin === 'mockKeyboard')) {
        var isKey = (evt.type !== 'textInput'),
            niceFormat = '%c%s = {\n';
        niceFormat += '  charCode: %s,\n';
        niceFormat += '  keyCode: %s,\n';
        if (isKey) {
          niceFormat += '  keyIdentifier: "%s",\n';
        } else {
          niceFormat += '  data: "%s",\n';
        }
        niceFormat += '  which: %s';
        if (isKey) {
          niceFormat += ',\n  altKey: %s,\n';
          niceFormat += '  ctrlKey: %s,\n';
          niceFormat += '  metaKey: %s,\n';
          niceFormat += '  shiftKey: %s';
        }
        niceFormat += '\n}\n';
        if (isKey) {
          console.log(niceFormat,
            logColors_[evt.type],
            evt.type,
            evt.charCode,
            evt.keyCode,
            (evt.keyIdentifier === undefined ? '' : evt.keyIdentifier),
            evt.which,
            evt.altKey,
            evt.ctrlKey,
            evt.metaKey,
            evt.shiftKey
          );
        } else {
          console.log(niceFormat,
            logColors_[evt.type],
            evt.type,
            evt.charCode,
            evt.keyCode,
            evt.data,
            evt.which
          );
        }
      }
    }
  }

  return singleton_;

});
