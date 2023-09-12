/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview override session cookies for use by 'gapi' api
 * See:
 * https://sites.google.com/a/google.com/apiary-eng/auth/api-session-cookie
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/third_party/when/when',
  'qowtRoot/utils/driveErrors'
  ], function(
    when,
    DriveErrors) {

  'use strict';

  var api_ = {
    /**
     * Get google session cookies, and "override" them by
     * placing them in the global window object, so that
     * gapi will use them. Returns a promise when done.
     *
     * NOTE: this promise does NOT timeout; it is up to the caller to
     * add some timeouts to the returned promise if desired.
     *
     * @return {Promise} resolves when cookies have been successfully set
     */
    setCookies: function() {
      return when.all([
        cleanWindowObject_(),
        setSAPISID_()
      ]);
    },

    setCookiesOlderWay: function() {
      return when.all([
        cleanWindowObject_(),
        setSID_(),
        setSAPISID_OlderWay_()
      ]);
    }
  };


  // -------------------- PRIVATE ----------------
  var GOOGLE_URL = 'http://*.google.com/';
  var GOOGLE_SECURE_URL = 'https://*.google.com/';

  var SID = 'SID';
  var OVERRIDE_SID = '__OVERRIDE_SID';

  var SAPISID = 'SAPISID';
  var SECURE_1_PAPISID = '__Secure-1PAPISID';
  var SECURE_3_PAPISID = '__Secure-3PAPISID';
  var OVERRIDE_SAPISID = '__SAPISID';

  function cleanWindowObject_() {
    window[OVERRIDE_SAPISID] = undefined;
    window[OVERRIDE_SID] = undefined;
    return when.resolve();
  }

  function setSID_() {
    return override_(GOOGLE_URL, SID, OVERRIDE_SID);
  }

  function setSAPISID_OlderWay_() {
    // note httpS for SAPISID
    return override_(GOOGLE_SECURE_URL, SAPISID, OVERRIDE_SAPISID, true);
  }

  function setSAPISID_() {
    // For __SAPISID, use the first one that is available in the following order
    // a. __Secure-1PAPISID
    // b. SAPISID
    // c. __Secure-3PAPISID
    return whenFoundTheCookieReject_(GOOGLE_SECURE_URL, SECURE_1_PAPISID)
    .then(function() {
      return whenFoundTheCookieReject_(GOOGLE_SECURE_URL, SAPISID);
    }).then(function() {
      return whenFoundTheCookieReject_(GOOGLE_SECURE_URL,
          SECURE_3_PAPISID);
    }).then(function() {
      // reject with an object containing the 'invalid creds'
      // code to ensure the correct error dialog is displayed
      return Promise.reject({status: DriveErrors.INVALID_CREDENTIALS});
    }).catch(function(error) {
      if(!error) {
        // When found the cookie, `whenFoundTheCookieReject_` rejects the
        // Promise. Resolving the Promise now, since `__SAPISID` is set.
        return Promise.resolve();
      } else {
        return Promise.reject(error);
      }
    });
  }

  // If cookie is read successfully, no need to search for the next
  // cookie. So, this function rejects the Promise in that case.
  // Else resolves.
  function whenFoundTheCookieReject_(url, name) {
    return new Promise(function(resolve, reject) {
      chrome.cookies.get({
        url: url,
        name: name
      }, function(cookie) {
        if (cookie && cookie.value !== undefined) {
          window[OVERRIDE_SAPISID] = cookie.value;
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  function override_(url, name, overrideName, useValue) {
    return when.promise(function(resolve, reject) {
      chrome.cookies.get({
        url: url,
        name: name
      }, function(cookie) {
        if (cookie && cookie.value !== undefined) {
          window[overrideName] = useValue ? cookie.value : !!cookie.value;
          resolve();
        } else {
          // reject with an object containing the 'invalid creds'
          // code to ensure the correct error dialog is displayed
          reject({status: DriveErrors.INVALID_CREDENTIALS});
        }
      });
    });
  }

  return api_;
});