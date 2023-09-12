/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview this is an error observer which will hide
 * any UI the app might have presented if/when an error occurs.
 * For example if nacl crashed.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'ui/progressSpinner',
  ], function(
    ProgressSpinner) {

  'use strict';

  function hideUiOnError() {
    // remove any file loading spinner we might still have up
    ProgressSpinner.hide();
  }

  return hideUiOnError;
});