/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Mock Keyboard keys() function.
 * Used to send individual key commands to the mock keyboard.
 * Keystrokes will be interleaved, for example:
 * keys('ctrl', 'alt', 'del') would produce:
 * keydown(ctrl) keydown(alt) keydown(del) keyup(del) keyup(alt) keyup(ctrl)
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define(['qowtRoot/utils/mockKeyboard/sequence'], function(Sequence) {

  'use strict';

  // Return a function that can be used in the mock keyboards type method.
  return function() {
    var instance = new Sequence();
    instance.setImplementation('keys');
    Sequence.apply(instance, arguments);
    return instance;
  };

});
