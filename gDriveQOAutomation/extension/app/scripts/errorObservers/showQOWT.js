/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple error observer that will ensure
 * that QOWT is visible if ANY error occurs.
 * This takes care of the edge case, where an error has
 * occurred before we even made the QOWT Sandbox visible
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  function showQOWT(error) {
    // do not react to silent errors
    if (!error.silent) {
      var sandbox = document.getElementById('sandbox');
      sandbox.style.display = 'block';
    }
  }

  return showQOWT;
});