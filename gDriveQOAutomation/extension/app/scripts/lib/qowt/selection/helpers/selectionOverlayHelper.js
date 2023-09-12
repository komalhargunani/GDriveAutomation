define([], function() {

  'use strict';

  // TODO(umesh.kadam): This is not the right design. There are too many empty
  // functions in helpers. The helpers should have a base class and override
  // only the required functions. Currently I could not do it since there are
  // some irrelevant Karma UT's failing. Could not reason them currently.
  // TODO change the implementation to have inheritance.

  var SelectionOverlayHelper = function() {
    // constants
    this.contentType = 'selectionOverlay';
  };


  // api
  SelectionOverlayHelper.prototype = {
    __proto__: Object.prototype,

    /**
     * Activate the helper;
     */
    activate: function() {
      // do nothing
    },

    /**
     * Deactivate the helper;
     */
    deactivate: function() {
      // do nothing
    },

    /**
     * Take a snapshot of the existing selection
     */
    snapshot: function() {
      // do nothing
    },

    /**
     * When we modify the DOM programmatically, the caret may get stuck in
     * invalid places. This may be called to fix that up.
     */
    fixupInvalidCaret: function() {
      // do nothing
    },

    /**
     * Reset the selection to a previous snapshot.
     * Will ONLY attempt to reset the selection if the current snapshot
     * does not match our stored snapshot.
     */
    restoreSnapshot: function() {
      // do nothing
    },

    /**
     * @return {boolean} return true if the node intersects (greedily) with
     *                   the current selection.
     */
    nodeIntersects: function() {
      // do nothing
    },

    /**
     * Checks whether current and previoys selection contexts are equal.
     * @param {Object} newSelection The new eventData.
     * @param {Object} currentSelection current selection object.
     * @return {Boolean}
     */
    selectionContextsEqual: function(/* newSelection, currentSelection */) {
      // do nothing
    },

    /**
     * Saves any given info
     * @param {Object} info - information to be saved
     */
    saveInfo: function(info) {
      this.info = info;
    },

    /**
     * @param {Element} elm - underlay element to checked if it was selected
     * @return {boolean} True if elm was selected false otherwise.
     */
    wasElmSelected: function(elm) {
      var focusLostOn = _.get(this, 'info.focusLostOn');
      return !!(elm.id && elm.id === _.get(this, 'info.nodeId') &&
          focusLostOn === 'onDeleteKey' || focusLostOn === 'onUndoRedo');
    }
  };
  return SelectionOverlayHelper;
});
