// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This module defines error codes that
 * may be returned in a failure response from the Drive server.
 *
 * The error code is stored in either the 'status' property
 * or in the 'result.error.code' property of the response object -
 *
 * @see utils/gdrive/driveUtils.js
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([],
    function() {

  'use strict';

  var codes = {

    /**
     * Indicates that a Drive request failed due to being/going offline
     */
    OFFLINE: -1,

    /**
     * Indicates that opening document from Drive or gmail attachment failed
     * due to invalid Drive credentials.
     * For example, cookies are not properly set to global window object,
     * so that gapi authorisation succeeds.
     */
    AUTHENTICATION_TOKEN_NOT_ISSUED: 400,

    /**
     * Indicates that a Drive request failed due to invalid Drive credentials.
     * For example, if the user is not logged into Drive
     */
    INVALID_CREDENTIALS: 401,

    /**
     * Indicates that a Drive request was forbidden.
     * For example, there have been too many recent requests to the Drive server
     */
    FORBIDDEN: 403,

    /**
     * Indicates that the specified Drive file could not be found.
     * For example, this is the error response that currently occurs
     * when you try to open a Drive file from a secondary Google account
     */
    FILE_NOT_FOUND: 404,

    /**
     * Indicates that there was an internal Drive server error
     */
    INTERNAL_SERVER_ERROR: 500,

    /**
     * Indicates that the Drive server took too long to respond and timed out
     */
    TIMEOUT: 503
  };

  return codes;
});