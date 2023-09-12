/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Sequence base class used by the keys & text modules.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/mockKeyboard/keyCodes',
  'qowtRoot/utils/mockKeyboard/events'], function(
  TypeUtils,
  KeyCodes,
  Events) {

  'use strict';

  var SeqClass = function() {
    this.repetitions = 1;
    this.keySequence = [];
    this.fullSequence = function() {
      return this.keySequence.concat(this.keySequence.slice(0).reverse());
    };
    var a, arg, thisKey;
    if (this.implement) {
      // Loop through the arguments.
      for (a = 0; a < arguments.length; a++) {
        arg = arguments[a];
        // Validate the argument.
        if (TypeUtils.isString(arg)) {
          if (this.implement === 'keys') {
            thisKey = KeyCodes.lookup(arg);
            if (thisKey) {
              // Only add valid keys to the sequence.
              this.keySequence.push(thisKey);
            }
          } else {
            // Loop through each character of the argument.
            for (var c = 0; c < arg.length; c++) {
              // Validate the character.
              thisKey = KeyCodes.lookup(arg[c]);
              if (thisKey) {
                // Only add valid character keys to the sequence.
                this.keySequence.push(thisKey);
              }
            }
          }
        }
      }
    }
  };
  SeqClass.prototype = {
    __proto__: Object.prototype,

    /**
     * @param {String} implement Determine if this should provide the sequence
     *                 in a linear fashion for text or interleaved for keys.
     *                 ENUM(keys|text)
     */
    setImplementation: function(implement) {
      this.implement = implement;
    },

    /**
     * The keyboard will call this execute function for each
     * object passed to its type method. This will create and
     * return a promise that dispatches all the keyboard and
     * textInput events for each key in the sequence.
     * @param {Node} target The target node for event dispatch.
     * @return {Promise}
     */
    execute: function(target) {
      return new Promise(
        function(resolve) {
          keyList_.call(this).reduce(
            function(sequence, thisKey, index) {
              return sequence.then(function() {
                if (this.implement === 'keys') {
                  return isInFirstHalf_(index, this.fullSequence().length) ?
                    Events.dispatchEvents(thisKey, target, 'down') :
                    Events.dispatchEvents(thisKey, target, 'up');
                } else {
                  return Events.dispatchEvents(thisKey, target);
                }
              }.bind(this));
            }.bind(this), Promise.resolve()
          ).then(
            function(val) {
              resolve(val);
            }
          );
        }.bind(this)
      );
    },

    /**
     * Set the number of times the key sequence should be executed.
     * Ignores invalid parameters.
     * @param {Integer} reps The number of repetitions.
     * @return {Object} This object so that this function can be chained.
     */
    repeat: function(reps) {
      if (TypeUtils.isInteger(reps)) {
        this.repetitions = reps;
      }
      return this;
    }
  };

  /**
   * Used in the execute function to determine the current
   * interleaving within a list of repeated key sequences.
   * @param {Integer} index The current index of the full list.
   * @param {Even Integer} groupSize The size of each key sequence.
   * @return {Boolean} True if the index is in the first half of a group.
   */
  function isInFirstHalf_(index, groupSize) {
    return ((index - (Math.floor(index / groupSize) * groupSize)) <
            (groupSize / 2));
  }

  var keyList_ = function() {
    var list, r;
    if (this.implement === 'keys') {
      list = this.fullSequence();
      for (r = 1; r < this.repetitions; r++) {
        list = list.concat(this.fullSequence());
      }
    } else {
      list = this.keySequence;
      for (r = 1; r < this.repetitions; r++) {
        list = list.concat(this.keySequence);
      }
    }
    return list;
  };

  return SeqClass;

});
