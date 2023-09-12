define([], function() {
  'use strict';

  return {
    /**
     * @param {String} str - string to be replaced with camel case equivalent
     * @return {String} camelCase equivalent of '_' separated string
     */
    _2CamelCase: function(str) {
      throwIfInvalidParam_(str);
      // remove the _ from the beginning
      if (str.startsWith('_')) {
        str = str.substr(1, str.length);
      }
      // remove the _ from the end
      if (str.endsWith('_')) {
        str = str.substr(0, str.length - 1);
      }
      return str.replace(/_(.)/g, function(match) {
        return match && match[1].toUpperCase();
      });
    },


    /**
     * @param {String} str - string to be replaced with '_' equivalent
     * @return {String} '_' equivalent of camelCase separated string
     */
    camelCase2_: function(str) {
      throwIfInvalidParam_(str);
      // convert to lower case the first parameter if any.
      str = str.replace(/^([A-Z])/, function(match) {
        return match.toLowerCase();
      });
      return str.replace(/([A-Z])/g, function(match) {
        return '_' + match.toLowerCase();
      });
    }
  };

  // Private functions
  function throwIfInvalidParam_(str) {
    if (typeof str !== 'string') {
      throw (new Error('Invalid parameter! Expected string'));
    }
  }
});
