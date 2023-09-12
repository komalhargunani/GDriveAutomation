define([
  'qowtRoot/utils/typeUtils'
  ], function(
    TypeUtils) {

  'use strict';

  /*!
   * Public API
   */
  var api_ = {

    /**
    * Parse the url for base url, querty string, and query object
    *
    * @param {string} uri A valid url string
    * @return {object} returns an object containing the base url query string,
    * and query object. The query object contains properties that correspond to
    * the field-value pairs of the url query string.
    */
    parseURL: function(uri) {
      if(!TypeUtils.isString(uri)) {
        throw new Error('Invalid URI');
      }

      var parts = uri.split('?');
      var baseURL = parts[0];
      var queryString = parts.length > 1 ? parts[1] : '';
      var queryObject = this.parseQueryString(queryString);

      var result = {
        'baseURL': baseURL,
        'queryString' : queryString,
        'queryObject' : queryObject
      };

      return result;
    },

    /**
    * Parses a query string into an object of field-value pairs
    *
    * @param {string} quertyString a valid query string (from a url)
    * @return {object} returns an object containing properties that
    * correspond to the field-value pairs of the url query string.
    */
    parseQueryString: function(queryString) {
      if(!TypeUtils.isString(queryString)) {
        throw new Error('Invalid QueryString');
      }

      var queryObject;
      if (queryString) {
        queryObject = {};
        var fieldValuePairs = queryString.split(/[&;]/g);

        for (var i=0; i < fieldValuePairs.length; i++) {
          if (fieldValuePairs[i]) {
            var pair = fieldValuePairs[i].split('=');
            var field = decodeURIComponent(pair[0]).toLowerCase();
            var value = pair.length > 1 ?
                decodeURIComponent(pair[1]) : undefined;
            queryObject[field] = value;
          }
        }
      }

      return queryObject;
    },

    /**
    * Strips the query string off the current url in chrome omnibox
    */
    stripQueryString: function() {
      var urlObject = this.parseURL(window.location.href);
      window.history.replaceState({}, "", urlObject.baseURL);
    },

  };

  return api_;
});