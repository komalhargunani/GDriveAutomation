// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'add Shape' button for generic use.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/configs/buttonConfigs/drawing/shapeItems'],
function(
    ShapeItems) {

  'use strict';

  /**
   * Returns a button configuration.
   * Here 'this' is bound to button widget generated from this config.
   *
   * @param {object} returns A button configuration.
   * @param {string} returns config.type The type of widget to create.
   * @param {boolean} returns config.label True for a textual dropdown.
   * @param {string} returns config.action The widgets requested action.
   * @param {boolean} returns config.opt_scrollable True to make the
   *                          button menu scrollable.
   * @param {object} returns config.items The non-localisable strings
   *                          to use for the button menu items.
   */
  return {
    type: 'addShapeDropdown',
    label: true,
    action: 'initAddShape',
    opt_scrollable: true,
    items: ShapeItems,
    subscribe: {
      /**
       * Update the button status to enabled if Presentation is Non-Empty, else
       * disabled if the presentation is empty.
       */
      'qowt:presentationNonEmpty': function() {
        this.setEnabled(true);
      },
      'qowt:presentationEmpty': function() {
        this.setEnabled(false);
      }
    }
  };
});
