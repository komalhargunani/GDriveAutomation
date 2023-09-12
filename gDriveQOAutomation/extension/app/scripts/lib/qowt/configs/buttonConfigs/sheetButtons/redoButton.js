// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Defines a 'Redo' button for Sheet use, and returns a
 * button configuration.
 *
 * Here 'this' is bound to the button widget generated from this config.
 *
 * @author mikkor@google.com (Mikko Rintala)
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {function} config.init Function which is called when
 *                           the button is initialized
 * @param returns {object} config.subscribe Optional set of signals /w callbacks
 *                         that give button behaviours.
 */
define(['qowtRoot/utils/platform'], function(Platform) {

  'use strict';

  var prefix = Platform.isOsx ? '⌘' : 'Ctrl+';
  return {
    type: 'button',
    action: 'redo',
    shortCut: prefix + 'Y',
    init: function() {
      this.redoStackEmpty = true;
      this.enableAllowed = true;
      this.setEnabled(false);
    },
    subscribe: {
      'qowt:redoNonEmpty': function() {
        this.redoStackEmpty = false;
        this.setEnabled(this.enableAllowed);
      },

      'qowt:redoEmpty': function() {
        this.redoStackEmpty = true;
        this.setEnabled(false);
      },

      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var newSel = signalData && signalData.newSelection ?
          signalData.newSelection : undefined;
        if(newSel && newSel.contentType === "sheetText") {
          this.enableAllowed = false;
          this.setEnabled(false);
        } else {
          this.enableAllowed = true;
          this.setEnabled(!this.redoStackEmpty);
        }
      }
    }
  };

});
