// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview  Return a menu configuration.
 *
 * @param returns {object} A menu configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {boolean} config.opt_scrollable Optional, when true it
 *                          makes the menu scrollable.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([], function() {

  'use strict';

  var _api = {
    type: 'autocompleteMenu',
    action: 'injectAutocomplete',
    opt_scrollable: true
  };

  return _api;
});
