/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview utility module containing some useful
 * functions on pathnames.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/utils/typeUtils'], function(TypeUtils) {

  'use strict';

  var _factory = {
    /**
     * factory constructor for path utils objects. Usage:
     *
     * var pu = PathUtils.create('/foo/bar/something.txt');
     * pu.fileName() // returns 'something.txt'
     * pu.baseName() // returns 'something'
     * pu.dirName() // returns '/foo/bar/'
     * pu.extension() // returns 'txt'
     *
     * Note: THIS MODULE ONLY OPERATES ON STRINGS; it does NOT check
     * for the existence of the actual file (nor can it due to sandbox
     * file systems on the web)
     *
     * @param fullPath {string} the full path of the file
     */
    create: function(fullPath) {

      // use module pattern for instance object
      var module = function() {

        var _api = {
          /**
           * @return {string} returns the extension for the path, or undefined
           *
           * var pu = PathUtils.create('/foo/bar/something.txt');
           * pu.extension() // returns 'txt'
           */
          extension: function() {
            return _extension;
          },

          /**
           * @return {string} returns the directory for the path, or undefined
           *
           * var pu = PathUtils.create('/foo/bar/something.txt');
           * pu.dirName() // returns '/foo/bar/'
           */
          dirName: function() {
            return _dirName;
          },

          /**
           * @return {string} returns the basename for the path, or undefined
           *
           * var pu = PathUtils.create('/foo/bar/something.txt');
           * pu.baseName() // returns 'something'
           */
          baseName: function() {
            return _baseName;
          },

          /**
           * @return {string} returns the filename for the path, or undefined
           *
           * var pu = PathUtils.create('/foo/bar/something.txt');
           * pu.fileName() // returns 'something.txt'
           */
          fileName: function() {
            return _fileName;
          },

          /**
           * @return {string} returns a 'smart' and hopefully unique baseName
           *                  based off of the existing baseName.
           *
           * NOTE1: these names are not validated against the file system!
           *        This is thus a laymans version for generating a
           *        unique fileName for a given file, but it's good
           *        enough for what we need.
           * NOTE2: this does NOT update the inner concept of this instance's
           *        baseName!
           *
           * Examples:
           *   foobar.doc   -> foobar-1
           *   foobar-4.doc -> foobar-5
           */
          smartBaseName: function() {
            // as per all APIs of this module; if we have a corrupt instance
            // (eg no baseName), then return undefined
            var name = _api.baseName();
            if (name) {
              // regular expression to find eg -23 and treat it as
              // a negative number. We can then decrease it to eg -24
              var re = /(-[0-9]+)$/g;
              var match = name.match(re);
              name = (match) ?
                  name.replace(re, --match) :
                  name + '-1';
            }

            return name;
          }

        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
        var _fileName,
            _extension,
            _baseName,
            _dirName;

        function _init() {
          if (fullPath && TypeUtils.isString(fullPath)) {
            var lastSlash = fullPath.lastIndexOf('/');
            _dirName = lastSlash !== -1 ?
                fullPath.substr(0, lastSlash + 1) : undefined;

            _fileName = lastSlash !== -1 ?
                fullPath.substr(lastSlash + 1) : fullPath;

            var lastDot = _fileName.lastIndexOf('.');
            _baseName = lastDot !== -1 ?
                _fileName.substr(0, lastDot) : _fileName;

            var fileNameLen = _fileName.length;
            _extension = lastDot !== -1 ?
                _fileName.substr(lastDot + 1, fileNameLen) : undefined;
          }
        }

        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
