define([], function() {
  'use strict';

  var LinuxEn = Object.create(
    Object.prototype,
    {
      platform:  { value: 'LINUX' },
      locale:    { value: 'EN' },
      charCodes: { get: function() { return charCodes_; }},
      keyCodes:  { get: function() { return keyCodes_; }},
      keyIds:    { get: function() { return keyIds_; }},
      textInput: { get: function() { return textInput_; }},
      which:     { get: function() { return keyCodes_; }},
      shiftMap:  { get: function() { return shiftMap_; }}
    }
  );

  /** @private */

  var shiftMap_, charCodes_, keyCodes_, keyIds_, textInput_;

  shiftMap_ = {
    '0': ')',
    '1': '!',
    '2': '"',
    '3': '£',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '`': '¬',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '@',
    '#': '~',
    ',': '<',
    '.': '>',
    '/': '?'
  };

  charCodes_ = {
    'windows': 0
  };

  keyCodes_ = {
    'windows': 91,
    ')': 48,
    '!': 49,
    '"': 50,
    '£': 51,
    '$': 52,
    '%': 53,
    '^': 54,
    '&': 55,
    '*': 56,
    '(': 57,
    '¬': 192,
    '_': 189,
    '+': 187,
    '{': 219,
    '}': 221,
    '|': 220,
    ':': 186,
    '@': 222,
    '~': 51,
    '<': 188,
    '>': 190,
    '?': 191
  };

  keyIds_ = {
    'windows': 'Win'
  };

  textInput_ = {
    'windows': false
  };

  return LinuxEn;
});
