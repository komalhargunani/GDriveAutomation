
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview logging module to prepend some log strings
 * with 'PHANTOM:' so that our phantomjs bootstrap routines can
 * sniff these out and spit them out on the console for
 * running unit tests from the commandline
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {

    log: function(str, color) {
      var text = (color !== undefined) ? _colorize_text(str, color) : str;
      _log('PHANTOM:\n' + JSON.stringify(text));
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  var _color_map = {
        'green' : 32,
        'red' : 31
      };


  function _log(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  }

  function _colorize_text(text, color) {
    var color_code = _color_map[color];
    var escape = String.fromCharCode(27);
    return escape + '[' + color_code + 'm' + text + escape + '[0m';
  }

  return _api;
});
