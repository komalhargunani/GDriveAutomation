/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview One-way converter between rgb and its hex value
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */
define([], function() {

  'use strict';

  var _api = {
    from: 'rgb',
    to: 'hex',


// TODO(jliebrand): we should remove this converter in favour of colorString2hex
// because it does practically the same thing but without support for colour
// names so refactor such that we only use colorString2hex.

    /**
     * @param {Integer || String} r The first parameter is either
     *        an integer followed by two more that represent the red, green
     *        and blue values to be converted.
     *        OR
     *        a string in the form of "rgba(1,2,3,4)"
     */
    rgb2hex: function(r, g, b) {
      var match = /^rgba?\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3})[,\)]/.exec(r);
      if (match && match.length) {
        r = match[1];
        g = match[2];
        b = match[3];
      }

      return "#" + _componentToHex(parseInt(r, 10)) +
        _componentToHex(parseInt(g, 10)) +
        _componentToHex(parseInt(b, 10));
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Returns the hex value of a single RGB component.
   * @param c R/G/B component
   * @return hex equivalent of the component.
   */
  function _componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  return _api;

});