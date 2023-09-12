/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview selection helper for qowt contentType 'shape'
 *
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/widgets/factory'
], function(
    PubSub,
    TypeUtils,
    WidgetFactory) {

  'use strict';

  var ShapeSelectionHelper = function() {
    // constants
    this.contentType = 'shape';
  };


  // api
  ShapeSelectionHelper.prototype = {
    __proto__: Object.prototype,

    /**
     * Activate the helper;
     */
    activate: function() {
      // TODO (bhushan.shitole): if necessary, implement this method
    },

    /**
     * Deactivate the helper;
     */
    deactivate: function() {
      // TODO (bhushan.shitole): if necessary, implement this method
    },

    /**
     * Take a snapshot of the existing shape selection
     */
    snapshot: function() {
      this.snapshot_ = getSnapshot_();
      return this.snapshot_;
    },

    /**
     * When we modify the DOM programmatically, the caret may get stuck in
     * invalid places. This may be called to fix that up.
     */
    fixupInvalidCaret: function() {
      // TODO (bhushan.shitole): if necessary, implement this method
    },

    /**
     * Reset the selection to a previous snapshot.
     * Will ONLY attempt to reset the selection if the current snapshot
     * does not match our stored snapshot.
     */
    restoreSnapshot: function(snapshot) {
      var restoreTo = snapshot || this.snapshot_;
      if (restoreTo) {
        // Only restore to cached snapshot_ if it is different from
        // the current; no point otherwise (and costs time).
        var newSnapshot = getSnapshot_();
        if (!compareSnapshots_(restoreTo, newSnapshot)) {
          // Select the shape
          var shape = WidgetFactory.create({fromId: restoreTo.eid});
          if (shape && TypeUtils.isFunction(shape.select)) {
            PubSub.publish('qowt:clearSlideSelection');
            shape.select();
          } else {
            console.warn('Could not get the shape for saved selection ' +
                'snapshot; Restore snapshot failed.');
          }
        }
      }
    },

    /**
     * @return {boolean} return true if the node intersects (greedily) with
     *                   the current text selection.
     */
    nodeIntersects: function() {
      // TODO (bhushan.shitole): if necessary, implement this method
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
          (currentSelection.contentType === newData.contentType) &&
          (currentSelection.scope === newData.scope) &&
          (currentSelection.scope.id === newData.scope.id));
    }
  };

  /**
   * Returns the snapshot object containing eid of active shape
   * @return {object} object containing eid of active shape
   * @private
   */
  function getSnapshot_() {
    var snapshot = {};
    var activeElement = document.activeElement;

    if (activeElement.getAttribute('qowt-divType') === 'shape') {
      snapshot = {
        eid: activeElement.id
      };
    }
    return snapshot;
  }

  /**
   * compare two snapshots, return true if they are the same
   *
   * @param {object} snapshotA first snapshot to compare
   * @param {object} snapshotB second snapshot to compare
   * @return {boolean} return true if both snapshots are the same
   */
  function compareSnapshots_(snapshotA, snapshotB) {
    return snapshotA.eid === snapshotB.eid;
  }

  return ShapeSelectionHelper;
});
