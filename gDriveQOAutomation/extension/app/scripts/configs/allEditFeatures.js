/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Defines a set of feature overrides that enables editing in all of the
 * editors.
 *
 * @author elqursh@google.com (Ali Elqursh)
 */

(function() {


  // NOTE : this code runs as a background page; it therefore
  // sets the overrides in the more global localStorage rather
  // than session storage

  // If we update the `overrides` here, do update the `_getFeatureOverrides` in
  // application.js.

  var kId = 'featureOverrides';
  var overrides = {};
  // make sure to extend existing features set in local storage
  var overridesStr = window.localStorage.getItem(kId);
  if (overridesStr) {
    overrides = JSON.parse(overridesStr);
  }

  // add/overwrite 'edit' feature
  overrides.edit = true;
  overrides.pointEdit = true;
  window.localStorage.setItem(kId, JSON.stringify(overrides));

})();
