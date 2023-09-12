/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Simple module for some array utility functions.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var api_ = {

    /**
     * True if all the items in the first array appear in the second array
     * Note: This does not work for arrays that contain arrays or objects
     * because Array.indexOf uses identity equality.
     * Note: This is only intended for use with unique arrays, arrays with
     * multiple items could be considered a subset when the superset only
     * contains a single item.
     * @param {Array} subArr First array, the subset.
     * @param {Array} supArr Second array, the superset.
     * @return {Boolean} True if first array is subset of second array.
     */
    subset: function(subArr, supArr) {
      if (!Array.isArray(subArr) || !Array.isArray(supArr)) {
        return false;
      }
      var subset = true,
          ai, at = subArr.length;
      for (ai = 0; ai < at; ai++) {
        if (supArr.indexOf(subArr[ai]) < 0) {
          subset = false;
          break;
        }
      }
      return subset;
    },

    /**
     * Compares two arrays, true if array A is equal to array B.
     * Note: Arrays that contain object literals will never be equal,
     * because ({} === {}) is false, object references will match correctly.
     * @param {Array} arrA
     * @param {Array} arrB
     * @return {Boolean}
     */
    equal: function(arrA, arrB) {
      if (!arrA || !arrB ||
         (arrA.length !== arrB.length)) {
        return false;
      }
      return arrA.every(function(itemA, i) {
        if (itemA instanceof Array) {
          return api_.equal(itemA, arrB[i]);
        } else {
          return (itemA === arrB[i]);
        }
      });
    },

    /**
     * Move element inside the array. If either new or old
     * index are out of bounds, this method does nothing.
     * @param {Array} array The array to move element within
     * @param {Integer} oldIndex The index of the element to move.
     * @param {Integer} newIndex The new location for the element.
     */
    moveItem: function(array, oldIndex, newIndex) {
      if (oldIndex >= 0 && oldIndex < array.length &&
          newIndex >= 0 && newIndex < array.length) {
        array.splice(newIndex, 0, array.splice(oldIndex,1)[0]);
      }
    },

    /**
     * Remove any duplicates from a given array.
     * @param {Array} array The array containing duplicates.
     * @return {Array} A new array without duplicates.
     */
    unique: function(array) {
      return array.filter(function(elem, pos) {
        return array.indexOf(elem) === pos;
      });
    },

    /**
     * Remove an element from an array.
     * Does nothing if the element can not be found in the array.
     * @param {Array} array The array to remove the element from.
     * @param {*} obj The element to remove from the list.
     */
    removeElement: function(array, obj) {
      var index = array.indexOf(obj);
      if (index !== -1) {
        array.splice(index, 1);
      }
    },

    /**
     * Sort the elements of an array in a case insensitive fashion.
     * @param {Array} array The array to sort.
     * @return {Array} A sorted array.
     */
    sortCaseInsensitive: function(array) {
      return array.sort(function(a, b) {
        return a.toString().toLowerCase().localeCompare(
            b.toString().toLowerCase());
      });
    },

    /**
     * Returns a new array with those objects that are present in
     * array1 but not in array2.
     *
     * @return {Array} A new array.
     */
    difference: function(array1, array2) {
      return array1.filter(function(obj) {
        return array2.indexOf(obj) === -1;
      });
    }
  };

  return api_;

});
