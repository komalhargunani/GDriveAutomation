// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * Defines a 'Insert Slide' context menu item for Point, and returns a
 * context menu item configuration.
 *
 * Here 'this' is bound to the menuitem widget generated from this config.
 *
 * @return {Object} returns A context menuitem configuration.
 * @return {string} returns config.type The type of widget to create.
 * @return {string} returns config.stringId The string Id to use in context menu
 * @return {string} returns config.action The widgets requested action.
 * @return {Object} returns config.context context for requested action.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([], function() {

  'use strict';

  return {
    type: 'menuItem',
    stringId: 'menu_item_insertslide',
    action: 'insertSlide',
    context: {
      contentType: 'slideManagement'
    },
    /**
     * Triggers insert operation on menu item select
     *
     * @param {Object} selection current selection object
     */
    onSelect: function(/* selection */) {
      this.set(true);
    }
  };
});
