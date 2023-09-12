/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview feature overrides for Chrome. This module defines feature
 * capability for both Chrome and ChromeOS platforms.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


(function() {

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

  // Our 'save' capability relies on underlying platform APIs.
  // (different APIs for Chrome/ChromeOS)
  overrides.save = !!(window.chrome &&
    (window.chrome.fileSystem && window.chrome.fileSystem.chooseEntry));

  window.sessionStorage.setItem(kId, JSON.stringify(overrides));
})();