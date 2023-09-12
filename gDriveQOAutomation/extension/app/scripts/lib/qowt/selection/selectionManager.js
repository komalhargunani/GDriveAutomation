/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Generic Selection Manager tracks what is currently selected (agnostic of
 * content) by managing a stack of selection contexts it receives.
 *
 * When the current selection is modified it signals qowt:selectionChanged such
 * that system components can track the current selection.
 *
 * Active selections are updated based on the following signals:
 * - qowt:requestFocus: adds the new selection and signals toolManager according
 *                      to the new selections content type.
 *
 * - qowt:requestFocusLost: removes the current selection and signals
 *                          toolManager accordingly.
 *
 * - qowt:updateSelection: updates the current selection context with new data
 *                         providing the new data is of the same contentType as
 *                         the current context.
 *
 * @author dskelton@google.com (Duncan Skelton)
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/selection/helpers/helper',
    'qowtRoot/utils/navigationUtils'
  ], function(
    PubSub,
    Helper,
    NavigationUtils) {

  'use strict';

  // Internal representation of selected content
  // TODO: Enrich this representation as required (maybe a tree. Think Point).
  var _selection = [];

  /**
   * @private
   * The maximum size of our generic selection stack.
   */
  var _KStack_Max_Count = 10;

  /**
   * @private
   * PubSub subscription tokens.
   */
  var _disableToken,
      _resetSelectionToken,
      _requestToken,
      _updateToken,
      _focusLostToken,
      _lastPoppedSelection;

  var _helper;

  var _api = {

    /**
     * Initialize the module.
     */
    init: function () {
      if (_disableToken) {
        throw new Error('selectionManager.init() called multiple times.');
      }
      _api.activate();
      _disableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },

    /**
     * De-activate the module and disable all references.
     */
    disable: function () {
      _api.deactivate();

      PubSub.unsubscribe(_disableToken);
      _disableToken = undefined;
      _resetSelectionToken = undefined;
      _requestToken = undefined;
      _updateToken = undefined;
      _focusLostToken = undefined;
      _lastPoppedSelection = undefined;
    },

    /**
     * activates the selection manager
     * starts listening to the edit events
     */
    activate: function() {
      _helper = new Helper();
      _resetSelectionToken = PubSub.subscribe('qowt:resetSelection',
          _resetSelection);
      _requestToken = PubSub.subscribe('qowt:requestFocus', _requestFocus);
      _updateToken = PubSub.subscribe('qowt:updateSelection', _updateSelection);
      _focusLostToken =
        PubSub.subscribe('qowt:requestFocusLost', _requestFocusLost);
    },

    /**
     * de-activates the selection manager
     * stops listening to the edit events
     *
     * added only for unit-tests
     */
    deactivate: function() {
      _resetSelection();
      PubSub.unsubscribe(_resetSelectionToken);
      PubSub.unsubscribe(_requestToken);
      PubSub.unsubscribe(_updateToken);
      PubSub.unsubscribe(_focusLostToken);
      _helper = undefined;
    },

    /**
     * Query the current selection.
     *
     * @return {Object} The current selection context object.
     */
    getSelection: function() {
      return (_selection.length > 0) ?
        _selection[_selection.length-1] :
        undefined;
    },

    /**
     * Query if 2 selection context objects are identical. To be identical both
     * arguments must be of the same content type and match the type of the
     * currently active selection.
     *
     * @param {Object} selection1 A context selection object.
     * @param {Object} selection2 A context selection object.
     * @return {Boolean} True if the arguments are identical and match the
     *                   currently active content type, otherwise False.
     */
    selectionContextsEqual: function(selection1, selection2) {
      var isEqual = false;

      if (selection1.contentType === _api.getSelection().contentType) {
        isEqual = _helper.selectionContextsEqual(selection1, selection2);
      }
      return isEqual;
    },

    snapshot: function() {
      // note: _helper is only undefined if qowt:disable had fired
      // which means a fatal error occurred, but other async code
      // subsequently tried to create a snapshot; so just return
      // undefined in those edge cases
      if (_helper) {
        return _helper.snapshot();
      }
    },

    compareSnapshots: function(snapshotA, snapshotB) {
      if (_helper) {
        return _helper.compareSnapshots(snapshotA, snapshotB);
      }
    },

    /**
     * Restores the specified snapshot.
     *
     * @param {Object} snapshot Snapshot to be restored.
     * @return {Boolean} True if the operation succeeds, false otherwise.
     */
    restoreSnapshot: function(snapshot) {
      // try to restore the selection. If we fail, swallow the error,
      // since this shouldn't be a reason for crashing the app.
      var success = true;  // feeling optimistic
      try {
        if (!NavigationUtils.undoRedoUsingTBButton(document.activeElement)) {
          _helper.restoreSnapshot(snapshot);
        }
      } catch(err) {
        success = false;

        // remove the selection (if we couldn't restore it, then
        // it is very likely in the wrong place now...)
        window.getSelection().removeAllRanges();
      }
      return success;
    },

    nodeIntersects: function(node) {
      return _helper.nodeIntersects(node);
    },

    wasElmTheLastSelection: function(elm) {
      return !!(_lastPoppedSelection &&
          _helper.wasElmSelected(_lastPoppedSelection.contentType, elm));
    }

  };

  // PRIVATE ===================================================================

  var _resetSelection = function() {
    _helper.deactivate();
    PubSub.publish('qowt:tool:requestDeactivate', undefined);
    _selection = [];
  };

  /**
   * @private
   * Removes the current selection if a widget has requested to
   * lose the focus on the given content type. Only removes the selection
   * if the content type matches.
   *
   * @param {String} signal - The publish signal name.
   * @param {Object} signalData - Information about the contentType which lost
   *                             focus.
   */
  var _requestFocusLost = function(signal, signalData) {
    signal = signal || '';
    var oldContext = _api.getSelection();
    // TODO(dskelton) The sheet selection manager does not have the restriction
    // that content types must match. Check if this will inhibit their adoption.
    if (_selection.length > 0 &&
        _selection[_selection.length-1].contentType ===
        signalData.contentType) {

      _helper.saveInfo(signalData);
      _lastPoppedSelection = _selection.pop();
      _broadcastSelectionChange(oldContext);

      // activate the appropriate tool for the object that is
      // now at the top of the selection stack - or no tool if
      // the stack is now empty
      var newContext = _api.getSelection();
      if (newContext) {
        _helper.activate(newContext.contentType);
        PubSub.publish('qowt:tool:requestActivate', newContext);
      } else {
        _helper.deactivate();
        PubSub.publish('qowt:tool:requestDeactivate', undefined);
      }

      if (signalData.contentType) {
        // JELTE TODO: we might need to do this on a timeout, since we could
        // be in the process of handling a setBold button for example, which
        // we might not want to have dim right in the middle of that action?
        PubSub.publish('qowt:focusLost', signalData.contentType);
      }
    }
  };

  /**
     * Update the currently selected context with a new selection.
     *
     * @param {string} signal - The received signal.
     * @param {object} signalData - Information about the new selection context.
     *        Must contain a 'contentType': contentType {string} attribute.
     */
  var _requestFocus = function(signal, signalData) {
    signal = signal || '';
    var oldContext = _api.getSelection();
    if (!oldContext ||
        !_helper.selectionContextsEqual(signalData, oldContext)) {

      // If we're not allowed to stack the new context over the old context,
      // we have to first get rid of the old one.
      if (oldContext && oldContext.preStackAddition) {
        var doNotStack = oldContext.preStackAddition(signalData);
        if (doNotStack) {
          _helper.saveInfo(signalData);
          _lastPoppedSelection = _selection.pop();
        }
      }
      _addSelection(signalData);

      _helper.activate(signalData.contentType);
      PubSub.publish('qowt:tool:requestActivate', signalData);
      _broadcastSelectionChange(oldContext);
    }
  };

  /**
   * @private
   * Updates the current selection context without adding stack frames.
   * Checks the incoming context type matches the active context.
   *
   * @param {string} signal - The received signal.
   * @param {object} signalData - Information about the new selection context.
   *        Must contain a 'contentType': contentType {string} attribute.
   */
  function _updateSelection(signal, signalData) {
    signal = signal || '';
    var oldContext = _api.getSelection();
    if (oldContext && signalData &&
        oldContext.contentType === signalData.contentType &&
        oldContext.scope === signalData.scope) {
      _selection[_selection.length-1] = signalData;
    _broadcastSelectionChange(oldContext);
    }
  }

  /**
   * @private
   * Stores the new selection object and manages the selection stack.
   *
   * @param {Object} selectionObj The new selection context.
   */
  function _addSelection(selectionObj) {
    if (_selection.length >= _KStack_Max_Count) {
      _selection.shift();
    }

    _selection = _selection || [];
    _selection.push(selectionObj);
  }

  /**
   * @private
   * Broadcast to interested parties that the selection has changed.
   *
   * @param {Object} oldSelection The previously active selection context.
   */
  function _broadcastSelectionChange(oldSelection) {
    // publish a 'qowt:selectionChanged' signal
    var newSelection = _api.getSelection();
    PubSub.publish('qowt:selectionChanged', {
      oldSelection: oldSelection,
      newSelection: newSelection
    });
  }

  return _api;
});
