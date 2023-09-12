//Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview selection helper for qowt contentType 'slideManagement'
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([], function() {

  'use strict';

  var ThumbnailSelectionHelper = function() {
    // constants
    this.contentType = 'slideManagement';
  };


  // api
  ThumbnailSelectionHelper.prototype = {
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
     * Take a snapshot of the existing selection
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
     *                   the current selection.
     */
    nodeIntersects: function() {
      // TODO (kunjan.thakkar): if necessary, implement this method
    },

    /**
     * Checks whether current and previoys selection contexts are equal.
     * @param {Object} newSelection The new eventData.
     * @param {Object} currentSelection current selection object.
     * @return {Boolean}
     */
    selectionContextsEqual: function(/* newSelection, currentSelection */) {
      // In case of thumbnail even if the the same thumbnail is selected we need
      // to fire selectionChange event. This is because we need to handle
      // deselection of that thumbnail in case its selected again.
      // So always return false.
      return false;
    }
  };
  return ThumbnailSelectionHelper;
});
