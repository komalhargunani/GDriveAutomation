
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Handles all shortcut key/accelerator key processing.
 * Process every keystroke to see if it matches the shortcut sequence.
 *
 * Clients that have added this behaviour can add keyboard shortcuts (defined
 * as platform-specific strings), and supply a callback function.
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/widgets/behaviours/shortcutFilter',
  'qowtRoot/pubsub/pubsub'
], function(
  ShortcutFilter,
  PubSub) {

  'use strict';

  var _behaviour = {

    /**
     * Exentend the given module with our behaviour.
     * @param {object} The module instance to extend.
     */
    addBehaviour: function(module) {

      var extendModule = function() {
        /**
         * Register a keyboard accelerator sequence.
         * @params {object} config The accelerator descrption.
         * @params {string} config.mac Mac key sequence.
         * @params {string} config.win Windows key sequence.
         * @params {function} callback The behaviour to invoke when triggered.
         */
        module.addShortcut = function(config, callback) {
          _callback = callback;
          var shortcutConfigArr = config.split(',');
          shortcutConfigArr.forEach(function(shortcut) {
            _shortcutFilter.push(ShortcutFilter.create(shortcut));
          });
          PubSub.subscribe('qowt:shortcutKeys', _handleKeys);

        };

        // vvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        var _shortcutFilter = [],
            _callback;

        /**
         * Process a key sequence to see if it matches this shortcut instance.
         * If matched trigger the callback behaviour.
         * @param {string} signal The qowt signal for shortcut keys.
         * @param {object} signalDetail Contextual data from the signal.
         * @returns true if not matched, so the key press behaves normally,
         *          false if matched.
         */
        function _handleKeys(signal, signalDetail) {
          signal = signal || '';
          _shortcutFilter.forEach(function(shortcut) {
            if (shortcut.process(signalDetail.event)) {
              signalDetail.event.preventDefault();
              if (_callback) {
                _callback();
              }
            }
          });

        }
      };

      // actually extend the module with our behaviour
      extendModule();
    }
  };

  return _behaviour;
});
