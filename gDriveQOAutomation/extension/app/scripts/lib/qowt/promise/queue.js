// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview FIFO queue based on promises. This queue is the promise-based
 * analog to a blocking queue. If the user calls deQ(), and the queue is empty,
 * instead of blocking (impossible in Javascript), deQ() returns a promise.
 *
 * The implementation is based on a mechanism of pegs and holes.
 *
 * If there have been more enQs than deQs, we've accumulated a series of pegs.
 * If there have been more deQs than enQs, we've dug a series of holes.
 * At any moment, we have eitehr holes or pegs, but not both.
 *
 * When the user calls enQ(), pretend the user is handing us a peg.
 *  - If we have holes, fill the oldest hole with the peg.
 *  - Otherwise, add the peg to our horde of pegs.
 *
 * When the user calls deQ(), pretend the user is asking for a peg.
 *  - If we have pegs, hand the user the oldest peg.
 *  - Otherwise, dig a hole, and make the user a promise to fill the hole with a
 *    a peg, after all older holes have been filled.
 */
define([
    'qowtRoot/promise/deferred'
  ], function(
    Deferred) {

  'use strict';

  var Queue = function() {
    // Elements are either ALL:
    //  * pegs  (objects passed to the enQ function)
    //  * holes (deferred resolve() methods)
    // mode_ tells us whether we are in peg mode or hole mode.
    this.items_ = [];

    // When items_ contains pegs, this is kMODE_PEGS_.
    // When items_ contains holes, this is kMODE_HOLES_.
    // It's initialized to undefined, for when items_ is empty, the value of
    // mode_ does not matter.
    this.mode_ = undefined;
  };

  Queue.prototype = {};
  Queue.prototype.constructor = Queue;

  /**
   * @returns {boolean} whether the queue is empty. Another way to think of it
   * is it returns true if deQ.callCount >= enQ.callCount.
   */
  Queue.prototype.isEmpty = function() {
    return this.isZero_() || this.mode_ === kMODE_HOLES_;
  };

  /**
   * Enqueues an item to the back of the queue.
   * @param peg {Object} the item to add to the queue.
   */
  Queue.prototype.enQ = function(peg) {
    this.handleModes_(kMODE_PEGS_,
        function onPegs_() {
          this.items_.push(peg);
        }.bind(this),
        function onHoles_() {
          var hole = this.items_.shift();
          hole(peg);
        }.bind(this));
  };

  /**
   * Dequeues an item from the front of the queue. If the queue has no items
   * presently, return a promise.
   * @return {Object|Promise} the item in the front of the queue.
   */
  Queue.prototype.deQ = function() {
    return this.handleModes_(kMODE_HOLES_,
        function onPegs_() {
          var peg = this.items_.shift();
          return peg;
        }.bind(this),
        function onHoles_() {
          var deferred = new Deferred();
          var hole = deferred.resolve;
          this.items_.push(hole);
          return deferred.promise;
        }.bind(this));
  };

  /**
   * Helper function. Calls onPegs in pegs mode, calls onHoles in holes mode,
   * and transitions the mode when isZero_ is true.
   * @private
   */
  Queue.prototype.handleModes_ = function(newModeOnZero, onPegs, onHoles) {
    if (this.isZero_()) {
      this.mode_ = newModeOnZero;
    }

    if (this.mode_ === kMODE_PEGS_) {
      return onPegs();
    } else { // kMODE_HOLES_
      return onHoles();
    }
  };

    /**
   * @returns {boolean} whether deQ.callCount === enQ.callCount
   * @private
   */
  Queue.prototype.isZero_ = function() {
    return this.items_.length === 0;
  };

  var kMODE_HOLES_ = 'holes';
  var kMODE_PEGS_ = 'pegs';

  return Queue;
});