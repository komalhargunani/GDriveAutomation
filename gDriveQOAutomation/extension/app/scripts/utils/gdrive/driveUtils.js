// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Contains Drive utility methods
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([],
  function() {

  'use strict';

  var api_ = {

    /**
     * Returns the error code of the given Drive error response.
     * For example:
     *
     * - -1 indicates that the user is offline
     * - 401 indicates that the user has invalid credentials
     *   (e.g. perhaps they have logged out of Drive)
     * - 403 indicates that the user doesn't have sufficient file permissions
     *   (e.g. perhaps they only have read permission)
     * - 500 indicates that there was an internal Drive server error
     *
     * @param {object} response An error response from Drive
     * @return {integer || undefined} The error code, or undefined if
     *                                the response contains no error code
     */
    getErrorCode: function(response) {
      return (response && response.result && response.result.error &&
        response.result.error.code) || (response && response.status);
    },

    /**
     * Returns the error reason of the given Drive error response.
     * For example:
     *
     * - 'rateLimitExceeded' and 'userRateLimitExceeded' indicate
     *    that there have been too many recent server requests
     *
     * @param {object} response An error response from Drive
     * @return {string || undefined} The error reason, or undefined if
     *                               the response contains no error reason
     */
    getErrorReason: function(response) {
      return (response && response.result && response.result.error &&
        response.result.error.errors && response.result.error.errors[0] &&
        response.result.error.errors[0].reason);
    },

    /**
     * Returns the error message of the given Drive error response.
     * For example:
     *
     * - 'A network error occurred, and the request could not be completed.'
     *   indicates that an issue with the network caused a Drive request to fail
     *
     * @param {object} response An error response from Drive
     * @return {string || undefined} The error message, or undefined if
     *                               the response contains no error message
     */
    getErrorMessage: function(response) {
      return (response && response.result && response.result.error &&
        response.result.error.message) || (response && response.statusText);
    },

    isValidDriveId: function(id) {
      return id && /^[a-zA-Z0-9_-]+$/.test(id);
    }
  };

  return api_;
});