/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit tests for pahtUtils
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/pathUtils',
  'qowtRoot/utils/typeUtils'
], function(
    PathUtils,
    TypeUtils) {

  'use strict';

  // helper function; will return the given string with
  // single quotes around it, or undefined
  function _quote(str) {
    return str ? "'" + str + "'" : undefined;
  }

  // helper function: creates an instance of PathUtils
  // and calls the testFuncName on it, testing every
  // key-value pair within expectedResults object
  function _test(testFuncName, expectedResults) {
    for (var input in expectedResults) {
      it('should return ' + _quote(expectedResults[input]) + " for '" +
         input + "'",
         function() {
           var pu = PathUtils.create(input);
           expect(pu[testFuncName].call()).toBe(expectedResults[input]);
         });
    }
  }

  describe('PathUtils', function() {

    describe('extension()', function() {

      _test('extension', {
        'foo/something/bar.txt': 'txt',
        'foo/something/bar': undefined,
        'foo/something.txt/bar': undefined,
        'foo/something.xxx/bar.txt': 'txt',
        'foo/some dir with spaces/bar.txt': 'txt',
        'foo/some file with spaces.txt': 'txt'
      });

    });

    describe('dirName()', function() {

      _test('dirName', {
        'foo/something/bar.txt': 'foo/something/',
        '/foo/something/bar': '/foo/something/',
        'foo/something.txt/bar': 'foo/something.txt/',
        'foo/something/bar/': 'foo/something/bar/',
        'foo.txt': undefined,
        '/foo.txt': '/',
        'foo/some dir with spaces/bar.txt': 'foo/some dir with spaces/',
        'foo/some file with spaces.txt': 'foo/'
      });

    });

    describe('baseName()', function() {

      _test('baseName', {
        'foo/something/': undefined,
        'foo/something.txt/bar/': undefined,
        'foo/something/bar.txt': 'bar',
        '/foo/something/bar': 'bar',
        'foo/something.txt/bar/hello.txt': 'hello',
        'foo/some dir with spaces/bar.txt': 'bar',
        'foo/some file with spaces.txt': 'some file with spaces'
      });

    });

    describe('fileName()', function() {

      _test('fileName', {
        'foo/something/bar.txt': 'bar.txt',
        '/foo/something/bar': 'bar',
        'foo/something/': undefined,
        'foo/something.txt/bar/': undefined,
        'foo/something.txt/bar/hello.txt': 'hello.txt',
        'foo/some dir with spaces/bar.txt': 'bar.txt',
        'foo/some file with spaces.txt': 'some file with spaces.txt'
      });

    });

    describe('bad inputs', function() {

      // helper function: tests all API calls return undefined
      function _expectUndefined(pu, condition) {
        for (var api in pu) {
          if (TypeUtils.isFunction(pu[api])) {
            it(api + ' should return undefined if ' + condition, function() {
              expect(pu[api].call()).toBe(undefined);
            });
          }
        }
      }

      var pu;

      pu = PathUtils.create();
      _expectUndefined(pu, 'input is undefined');

      pu = PathUtils.create({});
      _expectUndefined(pu, 'input is an empty object');

      pu = PathUtils.create({foo: 'bar'});
      _expectUndefined(pu, 'input is an object');

      pu = PathUtils.create(345);
      _expectUndefined(pu, 'input is a number');

    });


    describe('getSmartSaveBasename', function() {

    it('should generate a "-1" basename for a non numbered file', function() {
      var pu = PathUtils.create('folder/A.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('A-1');
    });

    it('should generate a "-4" basename for an existing -3 file', function() {
      var pu = PathUtils.create('folder/A-3.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('A-4');
    });

    it('should generate a "-nnn" basename for a numbered file', function() {
      var pu = PathUtils.create('folder/A-350.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('A-351');
    });

    it('should generate a -nnn basename for a complex filename', function() {
      var pu = PathUtils.create('folder/A-45-23-350.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('A-45-23-351');
    });

    it('should generate a -n basename for a 0 ending filename', function() {
      var pu = PathUtils.create('folder/Draft0.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('Draft0-1');
    });

    it('should generate a -n basename for a -0 ending filename', function() {
      var pu = PathUtils.create('folder/Draft-0.doc');
      var basename = pu.smartBaseName();
      expect(basename).toBe('Draft-1');
    });
  });


  });

  return {};
});
