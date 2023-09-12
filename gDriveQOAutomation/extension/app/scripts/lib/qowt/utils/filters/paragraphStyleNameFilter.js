
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Filter Function to order an array of strings to be presentable
 * to a user, assuming the strings are names of paragraph styles.
 * This is where we implement the policy on what style names should be shown
 * in what order.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/utils/typeUtils'
      ], function(
    TypeUtils) {

  'use strict';

  var _api = {
    /**
     * Filter function for our style array.
     * For each styleObject passed in, return true to accept it, and return
     * false to skip it.
     *
     * @param {object} styleObject The style object to filter.
     * @return {boolean} True to accept, false to skip.
     * @public
     */
    filter: function(styleObject) {
      var accept = true;
      if (styleObject.type !== 'par' || styleObject.type === 'defaults' ||
          styleObject.name === '') {
        // Filter out style objects which are not paragraph styles,
        // DocumentDefault style, and styles with no name.
        accept = false;
      }
      return accept;
    },

    /**
     * Sort function for our style name array.
     * We want to ensure that Normal is at the top of the list.
     * Followed by the Headings 1, 2, and 3.
     * We're removing blank style names as there shouldn't be any.
     *
     * @param {Array} styleArray An array of style names.
     * @returns {Array} The sorted list of styles.
     * @public
     */
    sort: function(styleArray) {
      if (TypeUtils.isList(styleArray)) {
        return styleArray.sort(_sort);
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Custom array sort function to manipulate Word Paragraph Style list
   * into a presentable order. It is called repeatable with pairs of
   * strings and sorts them against each other.
   *
   * @private
   * @param {string} a Array string 1.
   * @param {string} b Array string 2.
   * returns {integer} < 0 : sort a to be at a lower index than b.
   *                     0 : a and b should be considered equal - not sorted.
   *                   > 0 : sort a to be at a higher index than b.
   */
  function _sort(a, b) {
    // These are the items we want at the top our sorted list,
    // specified in ascending priority order - it makes the comparison easier.
    var _reservedSlotsAsc = [
      'heading3',
      'heading2',
      'heading1',
      'normal'];

    function _normalise(name) {
      var style = name.replace(/\s/g, '');
      return style.toLowerCase();
    }

    var _aIx = _reservedSlotsAsc.indexOf(_normalise(a));
    var _bIx = _reservedSlotsAsc.indexOf(_normalise(b));

    if (_aIx === -1 && _bIx === -1) {
      return (a < b) ? -1 : 1;
    } else {
      return (_aIx > _bIx) ? -1 : 1;
    }
  }

  return _api;
});
