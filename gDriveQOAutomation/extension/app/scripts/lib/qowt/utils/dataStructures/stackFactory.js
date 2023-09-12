// Copyright 2014 Google Inc. All Rights Reserved.


/**
 * @fileoverview A simple stack factory to construct stack objects.
 *     Creates and returns a stack object, with standard stack method along with
 *     some non standard methods.
 *
 *     Standard stack methods =
 *     1. push
 *     2. pop
 *     3. clear
 *     4. count
 *     5. peek
 *
 *     Non-standard stack methods =
 *     1. remove (element from anywhere)
 *     2. sort
 *     3. reverse
 *
 *
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 */

define([], function() {

  'use strict';

  var _factory = {

    /**
     * Creates and returns a stack Object
     *
     * @return {object} A stack object.
     */
    create: function() {

      /**
       * Stack Constructor
       * @constructor
       */
      var Stack = function() {
        this.m_arr = [];
      };

      /**
       * Clears the stack, optionally accepting a callback function which is
       * called for every element in stack before stack is cleared.
       *
       * @param {Function=} opt_processingFunction A callback to be invoked for
       *     every object in stack before stack is cleared.
       */
      Stack.prototype.clear = function(opt_processingFunction) {
        if (opt_processingFunction) {
          var totalCount = this.m_arr.length;
          for (var count = 0; count < totalCount; count++) {
            opt_processingFunction(this.m_arr[count]);
          }
        }
        this.m_arr.length = 0;
      };

      /**
       * Returns the count of objects in stack.
       * Optionally accepts a filter callback function for counting.
       * Filter function is invoked for every object in stack and it is treated
       * as part of counting only if filter function returns true.
       *
       * @param {Function=} opt_filterFunction A callback, invoked for every
       *     object in stack. An object in stack is counted only if filter
       *     function returns true for it.
       * @return {number} Total objects in stack. If filter function is used,
       *     then total number of objects in stack for which filter function
       *     returns true.
       */
      Stack.prototype.count = function(opt_filterFunction) {
        var toReturn = this.m_arr.length;
        if (opt_filterFunction) {
          toReturn = 0;
          var totalCount = this.m_arr.length;
          for (var count = 0; count < totalCount; count++) {
            if (opt_filterFunction(this.m_arr[count])) {
              toReturn = toReturn + 1;
            }
          }
        }
        return toReturn;
      };

      /**
       * Destroys the stack
       */
      Stack.prototype.destroy = function() {
        this.m_arr = null;
      };

      /**
       * Peeks the stack (without removing it), with optionally accepting a
       * flag to peek at bottom.
       *
       * @param {Boolean=} opt_bottom Flag if bottom object needs to be peek
       * @return {Object} Object on the top of stack. If opt_bottom flag is true
       *     then bottom object of the stack
       */
      Stack.prototype.peek = function(opt_bottom) {

        if (this.m_arr.length === 0) {
          return null;
        }

        var toReturnIndex = this.m_arr.length - 1;
        if (opt_bottom) {
          toReturnIndex = 0;
        }

        return this.m_arr[toReturnIndex];
      };

      /**
       * Pops the object from stack. Removes and returns object at top of stack.
       * @return {Object} Top object of stack
       */
      Stack.prototype.pop = function() {
        if (this.m_arr.length === 0) {
          return null;
        }

        var o = this.m_arr[this.m_arr.length - 1];
        this.m_arr.length--;
        return o;
      };

      /**
       * Pushes object in stack. Places object on top of stack. Provides
       * optional processing callback function mechanism which gets invoked for
       * passed in object
       *
       * @param {Object} o An object to be pushed on stack
       * @param {Function=} opt_processOnPush Optional processing function,
       *     invoked against object being passed.
       */
      Stack.prototype.push = function(o, opt_processOnPush) {
        if (opt_processOnPush) {
          opt_processOnPush(o);
        }
        this.m_arr[this.m_arr.length] = o;
      };

      /**
       * Removes first elements from top for which filter function returns true
       * Note: This is not a valid method for a stack, but clients may need to
       *     remove an element from stack which is not on top, hence the
       *     provision.
       *
       * @param {Function} filterFunction The filter function which returns true
       *     if node needs to be deleted
       */
      Stack.prototype.remove = function(filterFunction) {
        // First iterate through all elements applying filter function and
        // gather index, then remove elements for which we have indices;
        // basically two pass for now
        var indexToDelete;
        var totalCount = this.m_arr.length;
        for (var count = totalCount - 1; count >= 0; count--) {
          if (filterFunction(this.m_arr[count])) {
            indexToDelete = count;
            break;
          }
        }
        if (indexToDelete !== undefined) {
          this.m_arr.splice(indexToDelete, 1);
        }
      };

      /**
       * Iterates through stack object from top to bottom.
       *
       * @param {Function} callback The callback function to be invoked against
       *     every object.
       */
      Stack.prototype.iterate = function(callback) {
        if (callback) {
          var totalCount = this.m_arr.length;
          for (var count = totalCount - 1; count >= 0; count--) {
            if (callback(this.m_arr[count])) {
            }
          }
        }
      };

      /**
       * Sorts the stack.
       * Note: This is not a valid function for a stack, but if client needs to
       * sort the stack, then here is the provision
       *
       * @param {Function} compareFunction The compare function similar to
       *     compare function for array sort
       */
      Stack.prototype.sort = function(compareFunction) {
        this.m_arr.sort(compareFunction);
      };

      /**
       * Reverse the stack.
       * Note: This is not a valid function for a stack, but if client needs to
       * reverse the stack, then here is the provision
       */
      Stack.prototype.reverse = function() {
        this.m_arr.reverse();
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      return new Stack();
    }
  };

  return _factory;
});



