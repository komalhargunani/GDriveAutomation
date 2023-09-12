/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/**
 * little module for different search algorithms
 */
define([], function() {

  'use strict';

  var _api = {

    array: {
      // We could extend the 'precision' to also include a true
      // 'nearest', which should return either the low or high boundary,
      // whichever is truly nearest to the searched value. Not required
      // right now, but should be trivial to add if needed

      /**
       * binary search an array - return closest match (nearest low)
       *
       * @param array {array} the array to search
       * @param find {item} the item to search for
       * @param precision {string} optional precision indicator, either 'low',
       *                           'high', or 'exact'. Defaults to 'exact',
       *                           Precision is used when an exact match can
       *                           not be found, at which point either the
       *                           nearest low (floor) match is returned or
       *                           the nearest high (ceiling) match is returned.
       * @param comparator {function} optional function to compare the items
       *                              in the array, defaults to using simple
       *                              numeric comparison
       */
      binSearch: function(array, find, precision, comparator) {
        return _binSearch({
          precision: precision,
          searchValue: find,
          itemCount: array.length,
          getItem: function(index) {
            return array[index];
          },
          comparator: comparator
        });
      }
    },

    /**
     * Same binary search as outlined above, just a different (slightly
     * more useful) API, allowing you to search an arbitrary data set
     * by providing a getItem function and itemCount, rather than a specific
     * array. Used by the Page Widget to search through its content which
     * is distributed over potentiall multiple sections
     *
     * @param config {object} object containing:
     *        config.precision
     *        config.getItem
     *        config.itemCount
     *        config.searchValue
     *        config.comparator
     */
    binSearch: function(config) {
      return _binSearch(config);
    }
  };

  // ---------------------- PRIVATE

  function _binSearch(config) {
    if (config.comparator === undefined) {
      config.comparator = _numericCompare;
    }
    if (config.precision === undefined) {
      config.precision = 'exact';
    }
    var result = -1;
    if (config.itemCount > 0) {
      var low = 0,
        high = config.itemCount - 1,
        i, comparison;
      while (low <= high) {
        i = Math.floor((low + high) / 2);
        comparison = config.comparator(config.getItem(i), config.searchValue);
        if (comparison < 0) {
          low = i + 1;
          continue;
        }
        if (comparison > 0) {
          high = i - 1;
          continue;
        }
        // exact match found, return it - done
        // warning! breaking out of the loop by bluntly returning
        // causing multiple exits out of this function...
        return i;
      }

      // exat match not found. Return i or i+1 depending on
      // config.precision requested and the last comparison
      switch (config.precision) {
        case 'low':
          result = (comparison > 0) ? i - 1 : i;
          result = Math.max(result, 0);
          break;
        case 'high':
          result = (comparison < 0) ? i + 1 : i;
          result = Math.min(result, config.itemCount - 1);
          break;
        default:
          break;
      }
    }
    return result;
  }


  // return greater than zero if a>b
  // return lesser than zero if b>a
  // return zero if a === b
  function _numericCompare(a, b) {
    if ((typeof(a) !== 'number') || (typeof(b) !== 'number')) {
      throw ('error: attempt to numerically compare non numeric values');
    }
    return a - b;
  }

  return _api;
});