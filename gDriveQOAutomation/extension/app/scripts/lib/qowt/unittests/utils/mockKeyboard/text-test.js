/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/mockKeyboard/text',
  'qowtRoot/utils/typeUtils'], function(
  text,
  TypeUtils) {

  'use strict';

  describe('Mock Keyboard - text', function() {

    it('should handle any number of parameters', function() {
      var result = text('hello');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(5);
      result = text('hello', 'world');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(10);
      result = text('hello', 'world', '!');
      expect(result).toBeDefined();
      expect(result.keySequence.length).toBe(11);
    });

    it('should return an object that provides the ' +
       'execute method', function() {
        var result = text('goodbye');
        expect(result).toBeDefined();
        expect(result.execute).toBeDefined();
        expect(TypeUtils.isFunction(result.execute)).toBe(true);
    });

    it('execute should return a Promise', function() {
      var result = text('Do Something');
      var promise = result.execute();
      expect(promise).toBeDefined();
      expect(TypeUtils.isPromise(promise)).toBe(true);
    });

  });

  return {};

});
