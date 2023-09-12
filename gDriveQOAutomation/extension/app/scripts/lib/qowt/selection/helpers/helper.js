/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview current helper; effectively an adapter interface over all
 * helpers.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/selection/helpers/selectionOverlayHelper',
  'qowtRoot/selection/helpers/textHelper',
  'qowtRoot/selection/helpers/shapeHelper',
  'qowtRoot/selection/helpers/thumbnailHelper',
  'qowtRoot/selection/helpers/slideHelper'
], function() {

  'use strict';
  var argArray = Array.prototype.slice.call(arguments, 0);

  var Helper = function() {
    this.helpers_ = {};
    this.currentHelper_ = undefined;

    // register all helpers
    argArray.forEach(function(Helper) {
      var helperInstance = new Helper();
      if (helperInstance && helperInstance.contentType &&
          helperInstance.activate && helperInstance.deactivate) {
        this.helpers_[helperInstance.contentType] = helperInstance;
      }
    }, this);
  };


  Helper.prototype = {
    __proto__: Object.prototype,

    /**
     * Activate the helper for a given contentType.
     * Will only do anything if the new helper is different from the
     * old. In which case it will deactivate existing helper and
     * activate the new helper.
     * If there is no new helper, it will merely deactivate existing helper
     *
     * @param contentType {string} content type for associated helper
     */
    activate: function(contentType) {
      var newHelper = this.helpers_[contentType];
      if (newHelper !== this.currentHelper_) {
        this.deactivate();

        this.currentHelper_ = newHelper;
        if (this.currentHelper_) {
          this.currentHelper_.activate();
        }
      }
    },

    /**
     * Deactivate the existing helper (if we have one active)
     */
    deactivate: function() {
      if (this.currentHelper_) {
        this.currentHelper_.deactivate();
        this.currentHelper_ = undefined;
      }
    },

    /**
     * Ask the active helper to take a snapshot (cache) of the current selection
     * @return {Object|undefined} returns the snapshot or undefined
     */
    snapshot: function() {
       if (this.currentHelper_ && this.currentHelper_.snapshot) {
         return this.currentHelper_.snapshot();
       }
     },

    /**
     * compare two snapshots objects. Will return true if they are
     * semantically the same
     * @return {Boolean} returns true if the two snapshots are identical
     */
    compareSnapshots: function(snapshotA, snapshotB) {
      if (this.currentHelper_ && this.currentHelper_.compareSnapshots) {
        return this.currentHelper_.compareSnapshots(snapshotA, snapshotB);
      }
    },

    /**
     * Ask the active helper to restore previous snapshot
     */
    restoreSnapshot: function(snapshot) {
      if (this.currentHelper_ &&
          this.currentHelper_.restoreSnapshot) {
        this.currentHelper_.restoreSnapshot(snapshot);
      }
    },

    /**
     * Ask the active helper if a node is intersecting with the selection.
     * Returns false if we do not have an active helper
     *
     * @param node {HTML Element} element to check
     * @return {boolean} whether or not the node intersects
     */
    nodeIntersects: function(node) {
      var intersects = false;
      if (this.currentHelper_ && this.currentHelper_.nodeIntersects) {
        intersects = this.currentHelper_.nodeIntersects(node);
      }
      return intersects;
    },

    /**
     * Checks current and new selection context.
     * @param {object} newData Information about the new selection context.
     * @param {object} currentSelection Current selection context
     * @return {boolean} whether or not context equal
     */
    selectionContextsEqual: function(newData, currentSelection) {

      var contextsEqual = false;
      var contentType = newData.contentType;
      var helper = this.helpers_[contentType];
      if (helper && helper.selectionContextsEqual) {
        contextsEqual = helper.selectionContextsEqual(newData,
            currentSelection);
      }
      return contextsEqual;
    },

    /**
     * Saves the given information for further reference. It is upto the
     * custom helpers to decided the usage of this info.
     * @param {Object} info - info object
     */
    saveInfo: function(info) {
      if (_.isFunction(_.get(this, 'currentHelper_.saveInfo'))) {
        this.currentHelper_.saveInfo(info);
      }
    },

    /**
     * @param {String} contentType - contentType to choose the helper
     * @param {Element} elm - elm to be queried
     * @return {boolean} True if elm was last selected, false otherwise
     */
    wasElmSelected: function(contentType, elm) {
      var helper = this.helpers_[contentType];
      return !!(helper && _.isFunction(helper.wasElmSelected) &&
          helper.wasElmSelected(elm));
    }

  };


  return Helper;
});
