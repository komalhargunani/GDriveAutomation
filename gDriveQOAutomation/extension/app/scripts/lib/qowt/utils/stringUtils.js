// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview simple module for some string utility functions
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    /**
     * ensure the string is surrounded by double quotes
     * if it wasn't already
     *
     * @param {string} str string to wrap in double quotes
     */
    doubleQuote: function(str) {
      // can probably do this with one regex, but this'll do for now
      var s = str.replace(/^([^"])/, '"$1');
      s = s.replace(/([^"]$)/, '$1"');
      return s;
    },

    /**
     * strip all non ascii characters from string
     * so that it can be used as a css selector
     *
     * @param {string} str string to make css friendly
     */
    cssFriendly: function(str) {
      return str.replace(/[^a-z0-9]/gi, '');
    },

    /**
     * Capitalize the first letter of the string.
     * input: "hello"
     * output: "Hello"
     *
     * @param {string} str string to title case
     * @return title cased string
     */
    titleCase: function(str) {
      return str[0].toUpperCase() + str.slice(1);
    },
    /**
     * JS represents the astral symbols as surrogate pair whereas C++ considers
     * it as a single character. For undo and redo operations core sends the
     * offset considering the length of astral character as 1. This causes
     * mismatch between qowt and core. This functions increments the offset for
     * each astral symbol encountered and corrects the offset so that qowt can
     * work correctly.
     * @param text - source text which may contain astral symbol
     * @param offset - offset within the text
     * @returns {number} - corrected offset
     */
    astralCorrections: function(text, offset) {
      var correctedOffset = 0;
      var counter = 0;
      while (counter < offset) {
        if (isAstralCodePoint(text.charCodeAt(correctedOffset))) {
          correctedOffset += 1;
        }
        correctedOffset += 1;
        counter++;
      }
      return correctedOffset;
    },

    insertTextAt: function(text, textToInsert, position) {
      return (text.substr(0, position) + textToInsert + text.substr(position));
    }

  };
  function isAstralCodePoint(codePoint) {
    return codePoint >= 0xD800 && codePoint<= 0xDBFF;
  }

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
