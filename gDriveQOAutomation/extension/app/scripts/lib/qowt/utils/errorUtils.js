// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview This module is a temporary solution to handle the error info
 * in QOWT sent as a string, until qowt:error objects are properly cleaned up -
 * see crbug 308670.
 * It provides some simple methods to extract the required error info from
 * a DCP response object into a string and methods to parse this string.
 * Example of error string: "fof; Category: CorruptFile".
 * TODO(jliebrand): Remove this module when crbug 308670 is done.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([], function() {

  'use strict';

  var category_ = 'Category';

  var api_ = {

    /**
     * stripping the standard stack down to something smaller
     * so that clients like GA better handle it (it has a limit of
     * 150 char per exception)
     *
     * @param {Error} error the error object
     */
    stripStack: function(error) {
      // use a regex to strip the call stack
      var formatStr = '';
      var stack = error.stack ? error.stack.split('\n') : undefined;
      if (stack) {
        // first "frame" is the error description
        formatStr += stack[0] + ';';
        for (var i = 1; i < stack.length; i++) {
          var frame = stack[i];
          // frame looks like " at someFunc (in/some/file.js:80:30)"
          // this regex finds:
          //    the first match on the word after " at " (eg the function)
          //    the second match on filename
          //    the third match on the line number, and
          //    the fourth match on the column number
          var matches = frame.match(/\s*at\s*(\S*)\s*(\S*):(\d+):(\d+)\)/);
          if (matches) {
            // NOTE: if our regex didn't match (eg a line number was missing)
            // we end up not sending *anything* to GA. This is on purpose. We
            // do not want to run the risk of sending PII data to the server,
            // so if we can't identify the frame, then we end up dismissing it.

            // the first match in the array is the whole frame;
            // remove it and then join the rest
            matches.shift();

            // just get the final filename from the path
            var lastSlash = matches[1].lastIndexOf('/');
            matches[1] = lastSlash !== -1 ?
                matches[1].substr(lastSlash + 1) : matches[1];

            formatStr += matches.join(':') + ';';
          }
        }
      }
      return formatStr;
    },


    /**
     * Extracts the error info from the failing DCP response.
     * At the moment we are interested only in the legacy error code and
     * in the category, when required we can extract more error info from
     * the response.
     *
     * @param {object} response The DCP response for this command.
     * @returns {String} the error info.
     */
    errorInfo: function(response) {
      var errorInfo;
      if (response) {
        errorInfo = response.e;
        if (response.e_info && response.e_info.category) {
          errorInfo += '; ' + category_ + ': ' + response.e_info.category;
        }
      }
      return errorInfo;
    },

    /**
     * Extracts the legacy error code from the error info string.
     *
     * @param {string} errorInfo the error info.
     * @return {string} the legacy error code.
     */
    errorCode: function(errorInfo) {
      return errorInfo && errorInfo.split(';', 1)[0];
    },

    /**
     * Extracts the error category from the error info string.
     *
     * @param {string} errorInfo the error info.
     * @return {string} the error category.
     */
    category: function(errorInfo) {
      return getValue_(errorInfo, category_);
    }
  };

  /**
   * Extract a property value from the error info string.
   *
   * @param {string} errorInfo the error info.
   * @param {string} property the property name.
   * @return {string} the value.
   */
  var getValue_ = function(errorInfo, property) {
    var properties = errorInfo.split(';');
    for (var i = 1; i < properties.length; i++) {
      var pair = properties[i].split(':');
      if (pair[0].trim() === property) {
        return pair[1].trim();
      }
    }
    return '';
  };

  return api_;
});
