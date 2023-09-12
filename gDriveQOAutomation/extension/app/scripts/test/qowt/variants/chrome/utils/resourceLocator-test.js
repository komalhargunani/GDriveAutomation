/**
 * @fileoverview
 * Unit test to cover the Chrome Variant ResourceLocator.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/variants/utils/resourceLocator'], function(
  ResourceLocator) {

  'use strict';

  describe('Variants:Chrome:Utils:ResourceLocator', function() {
    beforeEach(function() {
      for (var i = 1; i <=3; i++) {
        ResourceLocator.registerUrl(
          'resource/binary/file' + i,
          '/tmp/binary/file' + i);
      }
    });

    it('Should return the URL for a registered path', function() {
      for (var i = 1; i <= 3; i++) {
        assert.strictEqual(
          ResourceLocator.pathToUrl('resource/binary/file' + i),
          '/tmp/binary/file' + i,
          'returned the registered URL');
      }
    });
    it('Should overwrite registered URLs', function() {
      ResourceLocator.registerUrl(
        'resource/binary/file2',
        'XXX');
      assert.strictEqual(
          ResourceLocator.pathToUrl('resource/binary/file2'),
          'XXX',
          'returned the overwritten URL');
    });
    it('Should convert path to a string', function() {
      ResourceLocator.registerUrl(
        undefined,
        'undefined url');
      ResourceLocator.registerUrl(
        [],
        'array url');
      ResourceLocator.registerUrl(
        {},
        'object url');
      assert.strictEqual(
          ResourceLocator.pathToUrl(),
          'undefined url',
          'returned the undefined URL');
      assert.strictEqual(
          ResourceLocator.pathToUrl([]),
          'array url',
          'returned the array URL');
      assert.strictEqual(
          ResourceLocator.pathToUrl({}),
          'object url',
          'returned the object URL');
    });
    it('Should return the path for a register URL', function() {
      for (var i = 1; i <= 3; i++) {
        assert.strictEqual(
          ResourceLocator.findPath('/tmp/binary/file' + i),
          'resource/binary/file' + i,
          'returned the registered path');
      }
    });
  });
});
