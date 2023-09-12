// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * Defines an 'Undo' button.
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
    action: 'undo',
    shortCut: prefix + 'Z',

    init: function() {
      this.setEnabled(false);
    },
    subscribe: {
      'qowt:undoNonEmpty': function() {
        this.setEnabled(true);
      },

      'qowt:undoEmpty': function() {
        this.setEnabled(false);
      }
    }
  };

});