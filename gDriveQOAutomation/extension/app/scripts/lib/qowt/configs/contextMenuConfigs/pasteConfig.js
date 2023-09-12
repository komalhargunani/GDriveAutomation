
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Defines a 'Paste' context menu item for generic use, and returns a
 * context menu item configuration.
 *
 * Here 'this' is bound to the menuitem widget generated from this config.
 *
 * @param returns {object} A context menuitem configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.stringId The string Id to use in context menu
 * @param returns {string} config.action The widgets requested action.
 */

define([], function() {

  'use strict';

  return {
    type: 'menuItem',
    stringId: 'menu_item_paste',
    action: 'paste'
  };
});