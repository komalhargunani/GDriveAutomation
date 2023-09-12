
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A keyboard shortcut filter. Initialised with a specific
 * accelerator key sequence this module will return true or false for any
 * given key press combination, showing whether the key press matches the
 * shortcut.
 * @author dskelton@google.com (Duncan Skelton)
 */

define([], function() {

  'use strict';

  /**
   * @private
   * The modifier keys we support for keyboard shortcuts.
   * 'cmd' is the Apple Command key (metaKey).
   */
  var _kMODIFIERS = ['shift', 'alt', 'cmd', 'ctrl'];

  var _factory = {

    /**
     * Create a new filter for a the specied keyboard shortcut.
     *
     * @param {object} config A decsription of a shortcut key sequence.
     * @returns {object} A new filter instace for the given shortcut.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _api = {
          /**
           * Processes a key combination to see if it matches this shortcut.
           * @param {event} keyEvent A key event.
           * @returns true if the key event matches this shortcut, else false.
           */
          process: function(keyEvent) {
            var match = true;

            // check we have only the required modifiers.
            _kMODIFIERS.forEach(function(modifier) {
              var modifierRequired = config.indexOf(modifier) !== -1;
              var modifierKey = (modifier === 'cmd') ?
                  'metaKey' :
                  modifier + 'Key';
              var modifierPressed = keyEvent[modifierKey];

              if ((!modifierRequired && modifierPressed) ||
                  (modifierRequired && !modifierPressed)) {
                match = false;
              }
            });

            // if we matched the modfiers check the actual key char.
            if (match) {
              if (_keyChar !== -1) {
                var hotkey =
                    String.fromCharCode(keyEvent.keyCode).toLowerCase();
                match = (hotkey === _keyChar);
              } else {
                match = (keyEvent.keyCode === _keyCode);
              }
            }

            return match;
          }
        };


        /**
         * Constructs the shortcut filter.
         * @private
         *
         * @param name {boolean} argument for x y z
         */
        function _init() {
          config = config.toLowerCase();
          _keyChar = config.split('+').pop();

          // DuSk TODO: Support keys other than 'alphanum', eg 'enter'
          if (_keyChar.length > 1) {
            if (_keyChar[0] === '#') {
              // the config is a key code.
              _keyCode = parseInt(_keyChar.substring(1), 10);
              _keyChar = -1;
            }
          }
        }

        var _keyChar,
            _keyCode;

        _init();
        return _api;
      };

      // vvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvv


      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});

