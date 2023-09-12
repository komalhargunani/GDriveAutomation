/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Module to generate unique string identifiers.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([], function() {

  'use strict';

  var _id = 1;
  var _imageId = 1;

  var _api = {

    /**
     * Generates a unique identifier string.
     *
     * @param {string} opt_prefix Optional prefix label for the resulting id.
     * @return {string} An identifier string that is unique with this
     *                  environment.
     */
    getUniqueId: function(opt_prefix) {
      var uid = '';
      if (arguments[1] && typeof arguments[1] === 'number') {
        // If presented a number here then rebase our id counter to this.
        // This argument is for test purpose only. Note that if presented then
        // a first argument must be supplied to fill opt_prefix.
        _id = arguments[1];
      }
      opt_prefix = opt_prefix || '';
      uid = opt_prefix + _id;
      _id++;
      return uid;
    },


    /**
     * @return {string} An identifier string that is unique with this
     *                  environment.
     */
    getUniqueImageId: function() {
      return ('image-' + _imageId++);
    },

    /**
     * Helper function to return unique element ids.
     * Used by modules that dynamically created tagged HTML elements.
     *
     * @returns {string} An identifier of the form 'ELM-n'
     */
    getNewElementId: function() {
      var elmId = _api.getUniqueId('ELM-');
      return elmId;
    }

  };

  return _api;

});
