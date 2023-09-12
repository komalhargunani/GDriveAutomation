// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt tool for performing thumbnailStrip related actions.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 * @author amol.kulkarni@synerzip.com (Amol Kulkarni)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/slideSelect',
  'qowtRoot/tools/point/actionHandlers/slideHideUnhide',
  'qowtRoot/tools/point/actionHandlers/slideInsert',
  'qowtRoot/tools/point/actionHandlers/slideDelete',
  'qowtRoot/tools/point/actionHandlers/slideMove',
  'qowtRoot/tools/point/actionHandlers/duplicateSlide',
  'qowtRoot/tools/point/actionHandlers/resetSlideSelection',
  'qowtRoot/behaviours/action/commonActionHandler'
], function(
    PubSub,
    SlideSelectActionHandler,
    SlideHideUnhideActionHandler,
    SlideInsertActionHandler,
    SlideDeleteActionHandler,
    SlideMoveActionHandler,
    SlideDuplicateActionHandler,
    ResetSlideSelectionActionHandler,
    CommonActionHandler) {

  'use strict';

  var _api = {
    // Name of the tool.
    // The content type of the entity requesting focus must match with this.
    name: 'slideManagement',

    /**
     * Initializes ThumbnailStrip tool.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('thumbnailStripTool.init() called multiple times.');
      }
      var thumbnailStripActionHandlers = [
        SlideSelectActionHandler,
        SlideHideUnhideActionHandler,
        SlideInsertActionHandler,
        SlideDeleteActionHandler,
        SlideMoveActionHandler,
        SlideDuplicateActionHandler,
        ResetSlideSelectionActionHandler];
      //register relevant action handlers
      _registerActions(thumbnailStripActionHandlers);

      _disableToken = PubSub.subscribe('qowt:disable', _disable);

      // Extend our capabilities with common action handler behaviour
      CommonActionHandler.addBehaviour(_api);
    },

    /**
     * Activate the ThumbnailStrip tool.
     *
     * @param {object} context contextual object for this tool.
     */
    activate: function() {
      if (!_active) {
        _active = true;

        //start listening for actions
        _actionToken = PubSub.subscribe('qowt:requestAction', _performAction);
        _selToken = PubSub.subscribe('qowt:selectionChanged',
            _handleSelectionChange);
      }
    },

    /**
     * De-activate the tool
     */
    deactivate: function() {
      if (_active) {
        _active = false;

        //stop listening for actions
        PubSub.unsubscribe(_actionToken);
        PubSub.unsubscribe(_selToken);

        _clearThumbnailSelection();
      }
    },

    /**
     * Query if the tool is active.
     *
     * @return {Boolean} True if active, else false.
     */
    isActive: function() {
      return _active;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  var _disableToken,
      _active = false,
      _actionHandlers = {},
      _actionToken,
      _selToken;

  /**
   * Resets the defaults and destroy all references.
   * @private
   */
  function _disable() {
    _api.deactivate();

    PubSub.unsubscribe(_disableToken);
    _disableToken = undefined;
  }

  /**
   * Handle all 'requestAction' signals.
   * @param {String} eventType The type associated with the signal.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  function _performAction(eventType, eventData) {
    if (eventData && eventData.action) {
      var actionHandlers = _actionHandlers[eventData.action];
      if (actionHandlers) {
        actionHandlers.forEach(function(handler) {
          handler.call(this, eventData);
        });
      } else {
        // We haven't consumed the action directly,
        // so check if it's a common action.
        _api.handleCommonAction(eventType, eventData);
      }
    }
  }

  /**
   * Handles shape selection as per selectionChange event
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  function _handleSelectionChange(eventType, eventData) {
    // Update selection with new context from eventData
    var contextData = {};
    var selection = eventData && eventData.newSelection;
    // Set the action to slideSelect only if the context used to activate
    // thumbnailStripTool contains an index
    if (selection && selection.contentType === 'slideManagement' &&
        selection.index !== undefined) {
      contextData.action = 'slideSelect';
      contextData.context = selection;
      _performAction(eventType, contextData);
    }
  }

  /**
   * Register all known actions for this tool.
   * @param {Array} ActionHandlers - action handlers for actions supported by
   * this tool
   * @private
   */
  function _registerActions(ActionHandlers) {
    ActionHandlers.forEach(function(actionHandler) {
      actionHandler.supportedActions.forEach(function(action) {
        _actionHandlers[action] = _actionHandlers[action] || [];
        _actionHandlers[action].push(actionHandler.callback);
      });
    });
  }

  /**
   * Clear thumbnail selection.
   * @private
   */
  function _clearThumbnailSelection() {
    _performAction('resetSlideSelection', {
      action: 'resetSlideSelection',
      context: {
        contentType: 'slideManagement'
      }
    });
  }

  return _api;
});
