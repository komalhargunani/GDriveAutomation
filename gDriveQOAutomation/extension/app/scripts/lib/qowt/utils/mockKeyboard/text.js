/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Mock Keyboard text() function.
 * Used to send text commands to the mock keyboard.
 * Keystrokes will be created for the string, for example:
 * text('hi') would produce:
 * keydown(h) keyup(h) keydown(i) keyup(i)
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define(['qowtRoot/utils/mockKeyboard/sequence'], function(Sequence) {

  'use strict';

  // Return a function that can be used in the mock keyboards type method.
  return function() {
    var instance = new Sequence();
    instance.setImplementation('text');
    Sequence.apply(instance, arguments);
    return instance;
  };

});
