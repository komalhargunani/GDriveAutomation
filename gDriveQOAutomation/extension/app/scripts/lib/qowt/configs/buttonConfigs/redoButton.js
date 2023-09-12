// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * Defines a 'Redo' button.
 *
 */

/**
 * Return a button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 */
define(['qowtRoot/utils/platform'], function(Platform) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  return {
    type: 'button',
    action: 'redo',
    shortCut: prefix + 'Y',
    init: function() {
      this.setEnabled(false);
    },
    subscribe: {
      'qowt:redoNonEmpty': function() {
        this.setEnabled(true);
      },

      'qowt:redoEmpty': function() {
        this.setEnabled(false);
      }
    }
  };

});