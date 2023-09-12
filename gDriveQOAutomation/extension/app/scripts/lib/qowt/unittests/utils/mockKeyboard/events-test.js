/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/mockKeyboard/events',
  'qowtRoot/utils/typeUtils'], function(
  Events,
  TypeUtils) {

  'use strict';

  describe('Mock Keyboard - Events', function() {

    it('should return a promise', function() {
      var result = Events.dispatchEvents({name: 'unittest'});
      expect(result).toBeDefined();
      expect(TypeUtils.isPromise(result)).toBe(true);
    });

  });

  return {};

});
