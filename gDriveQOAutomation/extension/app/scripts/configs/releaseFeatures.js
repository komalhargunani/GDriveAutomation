/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview feature overrides for release builds
 *
 * We add an 'isRelease' feature to the overrides, and
 * also stub out the console.log function
 *
 * @author jelte@google.com (Jelte Liebrand)
 */


(function() {

  // mute logging in release builds
  // console.log = function() {};

  // NOTE: this code runs as a shim dependency on feature.utils
  // it therefore can set the overrides in the session storage
  // rather than local storage

  var kId = 'featureOverrides';
  var overrides = {};
  // make sure to extend existing features set in session storage
  var overridesStr = window.sessionStorage.getItem(kId);
  if (overridesStr) {
    overrides = JSON.parse(overridesStr);
  }

  // add/overwrite 'isRelease' feature
  overrides.isRelease = true;

  overrides.edit = false;
  window.sessionStorage.setItem(kId, JSON.stringify(overrides));

  // in case older debug builds stored feature overrides
  // or indeed any tests required to be baked in to the app
  // we want to be sure to get rid of that in this release build
  window.localStorage.removeItem('testsToInclude');
  window.localStorage.removeItem('builtInTests');

})();
