// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A factory for 'zoom out' toolbar button configs.
 * Different apps can create a new config instance and extend it
 * with their desired content type.
 */

define(['qowtRoot/pubsub/pubsub'], function(PubSub) {

  'use strict';

  var _factory = {

    /**
     * Return a button configuration.
     *
     * @param returns {object} A button configuration.
     * @param returns {string} config.type The type of widget to create.
     * @param returns {string} config.action The widgets requested action.
     * @param returns {string} config.contentType Optional contentType.
     *                If present the widget will directly signal 'qowt:doAction'
     *                If absent the widget the will signal 'qowt:requestAction'
     * @param returns {object} config.subscribe Optional set of signals with
     *                callbacks that give button behaviours.
     */
    create: function() {

      // use module pattern for instance object
      var module = function() {
        return {
          type: 'button',
          action: 'zoomOut',
          // DuSk TODO: The shortcut should really live in a menuItem,
          // so move it when we get a View menu for this.
          shortcut: {
            'OSX': 'CMD+#189',
            'DEFAULT': 'CTRL+#189'
          },
          subscribe: {
            /**
             * Update the button status as a result of a changed zoom level.
             */
            'qowt:zoomChanged': function(signal,signalData) {
              signal = signal || '';
              if(signalData.current <= signalData.min) {
                PubSub.publish('qowt:zoomOutEmpty');
                this.setEnabled(false);
              } else {
                this.setEnabled(true);
              }
            }
          }
        };
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
