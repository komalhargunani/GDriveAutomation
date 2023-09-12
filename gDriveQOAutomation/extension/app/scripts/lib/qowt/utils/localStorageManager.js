define([
  'qowtRoot/errors/qowtException'
], function(
    QOWTException) {

  'use strict';

  var api_ = {

    /**
     * This method is used to store key name in local storage. When passed
     * a key name and value, it will add that key to the storage or update
     * that key's value if it already exists.
     *
     * @param {string} name A valid name string
     * @param {string} value A valid value string
     */
    setItem: function(name, value) {
      try {
        window.localStorage.setItem(name, value);
      }
      catch (exception) {
        throw new QOWTException({
          title: 'storage_quota_exceed_error_short_msg',
          details: 'storage_quota_exceed_error_msg',
          message: exception.message
        });
      }
    },

    /**
     * Returns the value for passed key name
     *
     * @param {string} name A valid name string
     * @return {string} - A valid value of the key name
     */
    getItem: function(name) {
      return window.localStorage.getItem(name);
    }

  };

  return api_;
});
