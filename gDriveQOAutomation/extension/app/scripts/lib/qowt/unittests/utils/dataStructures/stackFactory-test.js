// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for stack data structure.
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/utils/dataStructures/stackFactory'
], function(StackFactory) {

  'use strict';

  describe('StackFactory', function() {
    it('should posses create method', function() {
      expect(StackFactory, 'create').toBeDefined();
    });

    it('should create a valid stack object', function() {
      var stackObject = StackFactory.create();
      expect(stackObject.m_arr).toBeDefined();
    });

    describe('Test StackFactory manipulation fuctions', function() {
      var stackObject;

      beforeEach(function() {
        stackObject = StackFactory.create();
      });

      afterEach(function() {
        stackObject.destroy();
      });

      it('should push object on the stack properly', function() {
        stackObject.push(1);
        expect(stackObject.m_arr.length).toBe(1);
        expect(stackObject.m_arr[0]).toBe(1);
      });

      it('should pop object on the stack properly', function() {
        stackObject.push(1);
        stackObject.push(2);
        expect(stackObject.m_arr.length).toBe(2);
        expect(stackObject.m_arr[0]).toBe(1);
        expect(stackObject.m_arr[1]).toBe(2);
        stackObject.pop();
        expect(stackObject.m_arr.length).toBe(1);
        expect(stackObject.m_arr[0]).toBe(1);
      });

      it('should clear the stack properly', function() {
        stackObject.push(1);
        stackObject.push(2);
        stackObject.clear();
        expect(stackObject.m_arr.length).toBe(0);
      });

      it('should return proper count', function() {
        stackObject.push(1);
        stackObject.push(2);
        expect(stackObject.count()).toEqual(2);
      });

      it('should destroy the stack object', function() {
        stackObject.push(1);
        stackObject.push(2);
        stackObject.destroy();
        expect(stackObject.m_arr).toBe(null);
      });

      it('should destroy the stack object', function() {
        stackObject.push(1);
        stackObject.push(2);
        stackObject.destroy();
        expect(stackObject.m_arr).toBe(null);
      });

      it('should peek the stack object', function() {
        stackObject.push(1);
        stackObject.push(2);
        expect(stackObject.peek()).toEqual(2);
      });

      it('should remove object from the stack', function() {
        stackObject.push(1);
        stackObject.push(2);
        stackObject.remove(function(thumbCheck) {
          return thumbCheck === 1;
        });
        expect(stackObject.count()).toEqual(1);
      });

      it('should iterate over the stack', function() {
        stackObject.push(1);
        stackObject.push(2);
        var dummyApiSet = {
          callback: function() {}
        };
        spyOn(dummyApiSet, 'callback');
        stackObject.iterate(dummyApiSet.callback);
        expect(dummyApiSet.callback.callCount).toBe(2);
      });

      it('should sort the stack elements', function() {
        stackObject.push(1);
        stackObject.push(2);
        spyOn(stackObject.m_arr, 'sort');
        stackObject.sort();
        expect(stackObject.m_arr.sort).toHaveBeenCalled();
      });

      it('should reverse the stack elements', function() {
        stackObject.push(1);
        stackObject.push(2);
        spyOn(stackObject.m_arr, 'reverse');
        stackObject.reverse();
        expect(stackObject.m_arr.reverse).toHaveBeenCalled();
      });
    });

  });
  return {};
});
