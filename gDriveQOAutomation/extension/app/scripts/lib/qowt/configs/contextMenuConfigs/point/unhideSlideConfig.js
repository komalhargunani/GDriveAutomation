// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'Unhide Slide' context menu item for Point.
 *
 * Here 'this' is bound to the menuitem widget generated from this config.
 *
 * @return {Object} A context menuitem configuration.
 * @return {string} config.type The type of widget to create.
 * @return {string} config.stringId The string Id to use in context menu
 * @return {string} config.action The widgets requested action.
 * @return {object} config.context The widgets context object.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */
define([], function() {

  'use strict';

  return {
    type: 'menuItem',
    stringId: 'menu_item_unhideslide',
    action: 'showSld',
    context: {
      contentType: 'slideManagement',
      'command': {
        showSlide: true
      }
    },
    /**
     * Triggers unhide operation on menu item select
     *
     * @param {Object} selection current selection object
     */
    onSelect: function(/* selection */) {
      this.set(true);
    },
    subscribe: {
      /**
       * Detect changes that enable or disable this menu item.
       * @param {String} signal name of the signal recieved
       * @param {Object} signalData data related to menu updation
       */
      'qowt:updateSlideMenu': function(signal, signalData) {
        signal = signal || '';
        if (signalData && signalData.hide !== undefined) {
          this.setEnabled(!signalData.hide);
        }
      }
    }
  };
});
