/**
 *  Binary resource locator to maintain binary resource paths and give full
 *  path to such resource.
 *
 *  @author saurabh.gangarde@quickoffice.com (Saurabh Gangarde)
 */
define([], function() {

  'use strict';

    var binaryFilePaths = {};
    var api_ =  {

      /**
       * Gives platform specific url to binary file for given file path.
       *
       * @param {string} path The resource identifier in question.
       * @return {string} The fully qualified URL to the specified resource.
       */
      pathToUrl: function(path){
        return binaryFilePaths[path];
      },

      /**
       * Register binary file url for given path
       *
       * @param {string} path The resource identifier in question.
       * @param {string} url The fully qualified URL to the specified resource.
       *
       * TODO (dtilley): See the unit test
       * html-office/crx/app/scripts/test/
       *             qowt/variants/chrome/utils/resourceLocator-test.js
       * This should probably have data validation and error checking,
       * being able to register a URL for undefined is likely not intended.
       */
      registerUrl: function(path, url){
          binaryFilePaths[path] = url;
      },


      unregisterUrl: function(path) {
        if (binaryFilePaths[path]) {
          delete binaryFilePaths[path];
        }
      },

      /**
       * Looks for a path given a url.
       *
       * @param {string} url Existing URL to the resource.
       * @return {string|undefined} Path to the URL or undefined if the search
       *                            does not succeed.
       */
      findPath: function(url) {
        var keys = Object.keys(binaryFilePaths),
            keyCount = keys.length;
        for (var i = 0; i < keyCount; ++i) {
          var thisKey = keys[i],
              thisValue = binaryFilePaths[thisKey];
          if (thisValue === url) {
            return thisKey;
          }
        }
        return undefined;
      }
  };

  return api_;
});
