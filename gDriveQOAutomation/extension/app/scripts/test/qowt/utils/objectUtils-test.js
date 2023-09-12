/**
 * @fileoverview
 * Mocha based unit test for the object utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/objectUtils'], function(
  ObjectUtils) {

  'use strict';

  describe('Object Utils.', function() {
    var objUtils, testObj;
    beforeEach(function() {
      objUtils = new ObjectUtils();
      testObj = {
        a: 'a',
        b: 'b'
      };
    });
    afterEach(function() {
      objUtils = undefined;
      testObj = undefined;
    });
    it('Should be able to clone an object', function() {
      assert.deepEqual(
        objUtils.clone(testObj), {
          a: 'a',
          b: 'b'
        }, 'clone object');
    });
    it('Should be able to append attributes', function() {
      objUtils.appendJSONAttributes(testObj, {c: 'c'});
      assert.deepEqual(
        testObj, {
          a: 'a',
          b: 'b',
          c: 'c'
        }, 'append attributes');
    });
  });
});
