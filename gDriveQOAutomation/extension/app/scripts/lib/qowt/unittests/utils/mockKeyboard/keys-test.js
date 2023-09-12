/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/mockKeyboard/keys',
  'qowtRoot/utils/typeUtils'], function(
  keys,
  TypeUtils) {

  'use strict';

  describe('Mock Keyboard - keys', function() {

    it('should handle any number of parameters', function() {
      var result = keys('a');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(1);
      result = keys('a', 'b');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(2);
      result = keys('a', 'b', 'c');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(3);
    });

    it('should return an object that provides the ' +
       'execute method', function() {
        var result = keys('⌘', 'x');
        expect(result).toBeDefined();
        expect(result.execute).toBeDefined();
        expect(TypeUtils.isFunction(result.execute)).toBe(true);
    });

    it('execute should return a Promise', function() {
      var result = keys('⌘', '⇧', '4');
      var promise = result.execute();
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
      expect(TypeUtils.isPromise(promise)).toBe(true);
    });

  });

  return {};

});
