// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @author Jason Ganetsky (ganetsky@google.com)
 * @fileoverview Tests for Queue.
 */

define([
    'qowtRoot/promise/queue',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/promise/testing/promiseTester'
  ], function(
    Queue,
    TypeUtils,
    PromiseTester) {

  'use strict';

  describe('promise/queue', function() {
    var queue, deQResults, emptyTransition;
    beforeEach(function() {
      queue = new Queue();
      deQResults = [];
      emptyTransition = undefined;
      expect(queue.isEmpty()).toBe(true);
    });
    afterEach(function() {
      expect(queue.isEmpty()).toBe(true);
      return new PromiseTester(Promise.all(deQResults))
          .onlyThen(function(deQValues) {
            expect(deQValues).toEqual([1, 2, 3]);
          });
    });

    it('should queue items up', function() {
      enQ_(1);
      isEmptyShouldBecome(false);
      enQ_(2);
      enQ_(3);
      deQ_();
      deQ_();
      deQ_();
      isEmptyShouldBecome(true);
    });

    it('should queue items up, take two', function() {
      enQ_(1);
      isEmptyShouldBecome(false);
      enQ_(2);
      deQ_();
      enQ_(3);
      deQ_();
      deQ_();
      isEmptyShouldBecome(true);
    });

    it('should not wait for promises', function() {
      enQ_(1);
      isEmptyShouldBecome(false);
      enQ_(2, isPromise_);
      enQ_(3);
      deQ_();
      deQ_(isPromise_);
      deQ_();
      isEmptyShouldBecome(true);
    });

    it('interleaved', function() {
      enQ_(1);
      isEmptyShouldBecome(false);
      deQ_();
      isEmptyShouldBecome(true);
      enQ_(2);
      isEmptyShouldBecome(false);
      deQ_();
      isEmptyShouldBecome(true);
      enQ_(3);
      isEmptyShouldBecome(false);
      deQ_();
      isEmptyShouldBecome(true);
    });

    it('deQs before enQs', function() {
      deQ_(isPromise_);
      enQ_(1);
      deQ_(isPromise_);
      enQ_(2);
      deQ_(isPromise_);
      enQ_(3);
    });

    it('deQs before enQs with promises', function() {
      deQ_(isPromise_);
      enQ_(1);
      deQ_(isPromise_);
      enQ_(2, isPromise_);
      deQ_(isPromise_);
      enQ_(3);
    });

    function enQ_(item, promisey) {
      checkIsEmpty(function() {
        queue.enQ(promisey ?
            Promise.resolve(item) :
            item);
      });
    }

   function deQ_(promisey) {
      checkIsEmpty(function() {
        var result = queue.deQ();
        expect(TypeUtils.isPromiseLike(result)).toEqual(!!promisey);
        deQResults.push(result);
      });
    }

    function checkIsEmpty(fn) {
      checkUnexpectedIsEmptyTransition();
      var oldEmpty = queue.isEmpty();
      fn();
      checkForIsEmptyTransition(oldEmpty);
    }

    function checkUnexpectedIsEmptyTransition() {
      if (emptyTransition !== undefined) {
        throw new Error('on last operation, queue empty() became ' +
            emptyTransition + ', please add emptyBecame(' + emptyTransition +
            ') to the test');
      }
    }

    function isEmptyShouldBecome(expectedValue) {
      if (emptyTransition === undefined) {
        throw new Error('on last operation, empty should have become ' +
            expectedValue + ', but did not transition');
      }
      expect(emptyTransition).toBe(expectedValue);
      emptyTransition = undefined;
    }

    function checkForIsEmptyTransition(oldValue) {
      if (oldValue !== queue.isEmpty()) {
        emptyTransition = queue.isEmpty();
      }
    }

    // To make the test more readable.
    var isPromise_ = true;
  });
});