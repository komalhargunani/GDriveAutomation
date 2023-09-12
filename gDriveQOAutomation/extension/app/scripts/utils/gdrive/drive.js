/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Drive API wrapper to authenticate with Drive Web UI
 * and perform Drive requests such as get metadata, download,
 * upload and convert.
 *
 * Uses gapi with first party auth for each request.
 *
 * NOTE:
 * This module silently logs to GA any error response that it
 * receives from Drive. It does *not* cause any error UI screens,
 * dialogs or notifications to appear - it is the responsibility
 * of calling modules to process any error object that their returned
 * promise is rejected with, and display the appropriate UI for the error.
 *
 * The only error handling that is performed by this module is:
 *
 * - For a retryable error received from Drive, it retries the request once more
 * - For any error that is not retryable or if its retry fails too:
 *   - It silently logs the error to GA (and the console)
 *   - It returns the error to the caller
 *
 * @author jelte@google.com (Jelte Liebrand)
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/unique/scriptLoadingTimeout',
  'qowtRoot/utils/driveErrors',
  'utils/gdrive/firstPartyAuth',
  'utils/gdrive/apiaryLoader',
  'utils/gdrive/driveUtils',
  'qowtRoot/third_party/when/when'
], function(
  ErrorCatcher,
  QOWTSilentError,
  ScriptLoadingTimeout,
  DriveErrors,
  FirstPartyAuth,
  ApiaryLoader,
  DriveUtils,
  when) {

  'use strict';

  var Drive = {

    /**
     * Get the meta data for a given document id
     *
     * Note: since this is an aync promise, it also
     * has a timeout (for loading apiary for instance).
     * This function does *not* use when.done though...
     * So the caller is expected to use when.done to
     * ensure exceptions are not swallowed.
     *
     * @param {string} id the document identifier
     * @return {Promise} returns a promise
     */
    getMetaData: function(id, resourceKey) {
      return initApiary_().then(getMetaData_.bind(null, id, resourceKey));
    },

    /**
     * Download the file for a given document id
     *
     * Note: since this is an aync promise, it also
     * has a timeout (for loading apiary for instance).
     * This function does *not* use when.done though...
     * So the caller is expected to use when.done to
     * ensure exceptions are not swallowed.
     *
     * @param {string} id the the document identifier
     * @return (Promise) returns a promise
     */
    download: function(id, resourceKey) {
      return initApiary_().then(download_.bind(null, id, resourceKey));
    },

    /**
     * Uploads a new revision of a file. This will always
     * add a new revision on the drive server. When adding
     * auto-save, we may want to revisit the heuristics and
     * only create new revisions every so often, but right
     * now it's on every upload.
     *
     * Note: since this is an aync promise, it also
     * has a timeout (for loading apiary for instance).
     * This function does *not* use when.done though...
     * So the caller is expected to use when.done to
     * ensure exceptions are not swallowed.
     *
     * @param {string} id the document identifier
     * @param {Blob} blob the file blob to be uploaded
     * @param {boolean} newRevision Flags creation of a new Revision
     * @return {Promise} returns a promise
     */
    upload: function(id, blob, newRevision, resourceKey) {
      var request = {
        'path': '/upload/drive/v2/files/' + id,
        'method': 'PUT',
        'params': {
          'newRevision': newRevision ? 'true' : 'false',
          'uploadType': 'multipart',
          'alt': 'json',
          'supportsTeamDrives': true
        }
      };
      if (resourceKey) {
        request.headers = {
          'X-Goog-Drive-Resource-Keys': id + '/' + resourceKey
        };
      }

      return initApiary_()
          .then(getMetaData_.bind(null, id))
          .then(upload_.bind(null, blob, request));
    },

    /**
     * Create a new Drive-hosted file from an existing Drive-hosted file.
     * The new file will either be:
     *
     * - a Google Docs converted format copy of the current file
     * or
     * - an Office-format copy of the current file
     *
     * Either way, a new Drive file is created with a new DriveId.
     *
     * @param {String} id The document identifier of the existing Drive file
     * @param {Boolean} convertToDocsFlag True if the new file should be
     *                                    converted to Google Docs format;
     *                                    false if it should be in Office format
     * @param {Object} metadata Any relevant metadata to be used in the
     *                          Drive request, e.g. a title for the new file
     * return {Promise} returns a promise.
     */
     createFileFromDriveFile: function(id, convertToDocsFlag, metadata) {
      return initApiary_()
        .then(createFileFromDriveFile_.bind(null, id, convertToDocsFlag,
          metadata));
     },

     /**
      * Create a new Drive-hosted file from an existing non-Drive hosted file.
      * The new file will either be:
      *
      * - a Google Docs converted file created from the given
      *   private file blob content
      * or
      * - an Office-format file created from the given
      *   private file blob content
      *
      * @param {Blob} blob The file blob to use to create the new file
      * @param {Boolean} convertToDocsFlag True if the new file should be
      *                                    converted to Google Docs format;
      *                                    false if it should be in Office
      *                                    format
      * @param {Object} metadata Any relevant metadata to be used in the
      *                          Drive request, e.g. a title for the new file
      * @return {Promise} returns a promise.
      */
     createFileFromNonDriveFile: function(blob, convertToDocsFlag, metadata) {
      var request = {
        'path': '/upload/drive/v2/files/',
        'method': 'POST',
        'params': {
          'uploadType': 'multipart',
          'convert': convertToDocsFlag,
          'supportsTeamDrives': true
        },
      };

      return initApiary_()
        .then(upload_.bind(null, blob, request, metadata));
     },

    /**
     * If there is cached metadata this method clears it.
     * This ensures that the next time metadata is required
     * it is fetched from the Drive server (not from the cache).
     *
     * Used by Mocha tests
     */
     clearCachedMetaData: function() {
      metaData_ = undefined;
     },

    /**
     * Stores the user id that is provided in the URL of the
     * Drive file. This is used for authentication purposes -
     * for example, to facilitate opening Drive documents
     * from a secondary Google account
     */
     setUserId: function(id) {
      userId_ = id;
     }
  };

  // -------------------- PRIVATE ----------------
  var apiaryLoaded_ = false,
      metaData_,
      userId_;

  function initApiary_() {
    return apiaryLoaded_ ? when.resolve() :
      // 30 sec timeout to get the apiary script and setup our cookies
      when.all([
        ApiaryLoader.load(),
        FirstPartyAuth.setCookies()
      ])
      .timeout(30000, new ScriptLoadingTimeout('apiary script loading timeout'))
      .then(setApiKey_)
      .then(function() {apiaryLoaded_ = true;});
  }

  function setApiKey_() {
    // For api key see https://console.developers.google.com/project/
    // apps~quickoffice-fp/apiui/credential
    gapi.client.setApiKey('AIzaSyD-qQA49y2Lv7b0KJCQghmHKe0iMHFnIts');

    // for first party auth, we have to
    // a- tell gapi to make fpauth requests, and
    // b- set the cookies on the global window object. This is done
    // by the FirstPartyAuth module (see initApiary_)
    gapi.config.update('googleapis.config/auth/useFirstPartyAuth', true);

    // tell gapi which Google account is being used
    if(userId_) {
      gapi.config.update('googleapis.config/fogId', userId_);
    }
  }


  function getMetaData_(id, resourceKey) {
    var metaDataPromise;
    if(metaData_) {
      metaDataPromise = when.resolve(metaData_);
    }
    else {
      var request = {
        'path': '/drive/v2/files/' + id,
        'method': 'GET',
        'params': {
          'updateViewedDate': true,
          'supportsTeamDrives': true
        }
      };
      if (resourceKey) {
        request.headers = {
          'X-Goog-Drive-Resource-Keys': id + '/' + resourceKey
        };
      }

      metaDataPromise = sendGapiRequest_(request, 'Drive.getMetaData_')
        .then(function(response) {
          metaData_ = resolveResponse_(response);
          return metaData_;
        })
        .catch(rejectResponse_);
    }
    return metaDataPromise;
  }


  function download_(id, resourceKey) {
    var request = {
      'path': '/drive/v2/files/' + id + '?alt=media',
      'method': 'GET',
      'params': {
        'supportsTeamDrives': true
      } 
    };
    if (resourceKey) {
      request.headers = {
        'X-Goog-Drive-Resource-Keys': id + '/' + resourceKey
      };
    }
    var downloadPromise = sendGapiRequest_(request, 'Drive.download_')
      .then(createBlob_)
      .catch(rejectResponse_);

    return downloadPromise;
  }

  /**
   * Creates a new Drive-hosted file from an existing Drive-hosted file.
   *
   * @param {String} id The document identifier of the existing Drive file
   * @param {Boolean} convertToDocsFlag True if the new file should be in
   *                                    Google Docs format; false if it should
   *                                    be in Office format
   * @param {Object} metadata Any relevant metadata to be used in the
   *                          Drive request, e.g. a title for the new file
   * @return A Promise.
   */
  function createFileFromDriveFile_(id, convertToDocsFlag, metadata) {
    var request = {
      'path': '/drive/v2/files/' + id + '/copy',
      'method': 'POST',
      'params': {
        'convert': convertToDocsFlag,
        'supportsTeamDrives': true
      }
    };

    if(metadata.title) {
      request.body = {
        'title': metadata.title
      };
    }

    var createPromise = sendGapiRequest_(request,
      'Drive.createFileFromDriveFile_');
    return createPromise;
  }

  function upload_(fileBlob, request, metaData) {
    // TODO(jliebrand): replace this with gapi.client.media.Uploader
    // when that is available. See:
    // https://docs.google.com/a/google.com/document/d/
    //  1Kqj0pycRTY4BMdtmR0ZzJvRP2JhVSJ_XRW80P-UeSUA/edit#heading=h.iny2zw3m9b1o
    if (!metaData || !metaData.mimeType) {
      // We want metrics on this, but not to interrupt the user.
      // If the conversion is missing required info it will fail naturally.
      ErrorCatcher.handleError(
        new QOWTSilentError('Drive upload called with no mime type.'));
    }

    var deferred = when.defer();
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileBlob);
    reader.onload = function() {
      var contentType = metaData.mimeType;
      var base64Data = btoa(reader.result);
      var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metaData) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;
      request.headers = request.headers ? request.headers : {}; 
      request.headers['Content-Type'] = 'multipart/mixed; boundary="' +
        boundary + '"';
      request.body = multipartRequestBody;

      sendGapiRequest_(request, 'Drive.upload_')
        .then(deferred.resolve, deferred.reject);
    };
    return deferred.promise;
  }

  /**
   * Sends a request to Drive using gapi.
   *
   * Returns a promise that will either:
   * - Resolve with a success response from Drive
   * or
   * - Reject with an error response from Drive
   *
   * Note that if the request fails first time with an error
   * from Drive that is retryable then it will be retried once more
   *
   * @param {object} request The request to send to Drive
   * @param {string} caller The calling method, for log purposes
   */
  function sendGapiRequest_(request, caller) {
    var deferred = when.defer();
    gapi.client.request(request)
      .then(
        deferred.resolve,
        function(request, response) {
          if(isInvalidCredentialsError_(response)) {
            // User might have signed out and signed in again.
            // For authentication, we should set cookies again.
            when.all([
              FirstPartyAuth.setCookies()
            ]).done(function() {
                gapi.client.request(request).then(
                  deferred.resolve,
                  function(response) {
                    // We are here. This means, gapi requires older way
                    // of authentication.
                    // This condition (function) shall be removed, when gapi
                    // does not require it anymore.
                    if(isInvalidCredentialsError_(response)) {
                      when.all([
                        FirstPartyAuth.setCookiesOlderWay()
                      ]).done(function() {
                          gapi.client.request(request).then(
                            deferred.resolve,
                            logAndReject_.bind(null, deferred, caller));
                        }, function(error) {
                          deferred.reject(error);
                        });
                    } else {
                      logAndReject_(deferred, caller, response);
                    }
                  });
              }, function(error) {
                deferred.reject(error);
              });
          } else if(isRetryableError_(response)) {
            // if the initial failure was a retryable error then retry once,
            // otherwise reject immediately with the non-retryable response
            gapi.client.request(request).then(
              deferred.resolve,
              logAndReject_.bind(null, deferred, caller));
          }
          else {
            logAndReject_(deferred, caller, response);
          }
        }.bind(null, request));
    return deferred.promise;
  }

  /**
   * Determines if the given error response from Drive
   * is an error for which we should retry the request.
   * Retryable errors are:
   *
   * - 500 error (an internal Driver server error occurred)
   * - 503 error (the Drive server took too long to respond, i.e. timeout)
   * - 403 error with reason 'rateLimitExceeded' or 'userRateLimitExceeded'
   * (there have been too many recent requests to the Drive server)
   *
   * @param {object} response The error response
   * @return {boolean} True if the given error response
   *                   is a retryable error, otherwise false
   */
  function isRetryableError_(response) {
    var code = DriveUtils.getErrorCode(response);
    var reason = DriveUtils.getErrorReason(response);

    return (code === DriveErrors.INTERNAL_SERVER_ERROR) ||
      (code === DriveErrors.TIMEOUT) ||
      ((code === DriveErrors.FORBIDDEN) &&
      ((reason === 'rateLimitExceeded') ||
      (reason === 'userRateLimitExceeded')));
  }

  function isInvalidCredentialsError_(response) {
    var code = DriveUtils.getErrorCode(response);
    return (code === DriveErrors.INVALID_CREDENTIALS ||
        code === DriveErrors.AUTHENTICATION_TOKEN_NOT_ISSUED) ;
  }

  /**
   * Logs the specified error response to GA and to the console.
   * Then rejects the specified deferred promise with the error response
   *
   * @param {promise} deferred A deferred promise
   * @param {string} caller The calling method, for log purposes
   * @param {object} response The error response
   */
  function logAndReject_(deferred, caller, response) {
    var msg = caller + ' error:';
    var code = DriveUtils.getErrorCode(response);
    var errorMsg = DriveUtils.getErrorMessage(response);

    // log the error to GA without interrupting the flow.
    // Make sure we do not log the error.message to GA because it
    // might contain PII and would make clustering of errors not work.
    // Do log it to the console though
    console.error([msg, code, errorMsg].join(' '));
    ErrorCatcher.handleError(new QOWTSilentError(
      [msg, code].join(' ')));

    // reject the deferred promise with the response
    deferred.reject(response);
  }

  function createBlob_(downloadResponse) {
    // Note: apiary returns a UTF16 string which really is
    // the binary data. Unfortunately you can't create a blob
    // from that directly, as that would first convert the string
    // to UTF8. There are two options: you can base64 encode
    // the string and then use that to create the blob; which
    // is expensive in memory.
    // The second option is to use charCodeAt for each character
    // in the string. This sounds expensive, but since it's in a
    // tight loop it's not actually too bad.
    // TODO(jliebrand): The REAL solution here is for gapi to
    // return the file as a blob. Eg the 'alt=media' request
    // should be constructed with 'responseType': 'blob' such
    // that the entire file is returned as a blob (not in an envelope)
    // But gapi does not (yet) support this
    var binaryStr = downloadResponse.body;
    var len = binaryStr.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binaryStr.charCodeAt(i);
    }
    var blob = new Blob([view]);
    return blob;
  }

  function resolveResponse_(response) {
    return (response && response.result);
  }


  function rejectResponse_(response) {
    throw response;
  }

  return Drive;
});
