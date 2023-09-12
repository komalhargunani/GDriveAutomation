/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview apiary client.js loader. Note, we should
 * not include the client.js statically for reasons
 * described here: https://goto.google.com/local-apiary
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/third_party/when/when',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/driveErrors'
  ], function(
    when,
    DomUtils,
    DriveErrors) {

  'use strict';

  var api_ = {
    /**
     * Load the apiary client.js; returns a promise which resolves when
     * the script is loaded and the 'gapi' api is available for use.
     *
     * NOTE: this promise does NOT timeout; it is up to the caller to
     * add some timeouts to the returned promise if desired.
     *
     * @return {Promise} resolves when client.js is loaded
     */
    load: function() {
      if (!navigator.onLine) {
        // note: we could be slightly less strict here by retrying
        // a few times with a second interval delay or something, in
        // the hope that the user is only temporarily offline, but
        // for now keeping this as simple as possible. If we see this
        // failing a lot in GA data, we can change this strategy.
        // Reject with an object containing the 'offline' code
        // to ensure the correct error dialog is displayed
        return when.reject({status: DriveErrors.OFFLINE});
      }
      return when.promise(function(resolve) {
        /**
         * need a global function on the window object for
         * apiary to call once it's loaded. This function
         * will remove itself from the global window object
         * when done; to avoid pollution.
         */
        window[EXPORTED_NAME] = function() {
          window[EXPORTED_NAME] = undefined;
          resolve();
        };

        addScript_();
      });
    }
  };

  // -------------------- PRIVATE ----------------
  var APIARY_SCRIPT_ID = '__apiary_script';
  var APIARY_URL = 'https://apis.google.com/js/client.js';
  var EXPORTED_NAME = '__apiaryLoaded';


  function addScript_() {
    // remove previous script tag if it exists
    DomUtils.removeNode(APIARY_SCRIPT_ID);

    var scriptElement = document.createElement('script');
    scriptElement.id = APIARY_SCRIPT_ID;
    scriptElement.src = APIARY_URL + '?onload=' + EXPORTED_NAME;

    document.getElementsByTagName('head')[0].appendChild(scriptElement);
  }


  return api_;
});