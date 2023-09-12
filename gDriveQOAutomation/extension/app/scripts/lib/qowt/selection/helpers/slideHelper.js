/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview selection helper for qowt contentType 'slide'
 *
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([], function() {

  'use strict';

  var SlideSelectionHelper = function() {
    // constants
    this.contentType = 'slide';
  };


  // api
  SlideSelectionHelper.prototype = {
    __proto__: Object.prototype,

    /**
     * Activate the helper;
     */
    activate: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * Deactivate the helper;
     */
    deactivate: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * Take a snapshot of the existing slide selection
     */
    snapshot: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * When we modify the DOM programmatically, the caret may get stuck in
     * invalid places. This may be called to fix that up.
     */
    fixupInvalidCaret: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * Reset the selection to a previous snapshot.
     * Will ONLY attempt to reset the selection if the current snapshot
     * does not match our stored snapshot.
     */
    restoreSnapshot: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * @return {boolean} return true if the node intersects (greedily) with
     *                   the current text selection.
     */
    nodeIntersects: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * If the selection has not changed we do not need to process the selection
     * a second time.
     * @param {Object} newData The new eventData.
     * @param {Object} currentSelection current selection object.
     * @return {Boolean}
     */
    selectionContextsEqual: function(newData, currentSelection) {
      return !!(currentSelection && newData &&
          (currentSelection.contentType === newData.contentType));
    }
  };
  return SlideSelectionHelper;
});
