// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview  A tool for performing actions on shape.
 * This tool listens requestActions and calls respective action
 * handlers registered with it.
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */


define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/shape/actionHandlers/shapeSelect',
  'qowtRoot/tools/shape/actionHandlers/formatObject',
  'qowtRoot/tools/shape/actionHandlers/modifyTransform',
  'qowtRoot/tools/shape/actionHandlers/shapeDelete',
  'qowtRoot/tools/shape/actionHandlers/modifyShapeFillColor',
  'qowtRoot/behaviours/action/commonActionHandler'
], function(
    PubSub,
    ShapeSelectActionHandler,
    FormatObjectActionHandler,
    ModifyTransformActionHandler,
    ShapeDeleteActionHandler,
    ModifyShapeFillActionHandler,
    CommonActionHandler) {

  'use strict';

  var _actionToken,
      _active = false,
      _actionHandlers = {},
      _selToken,
      _disableToken;

  var _api = {

    /**
     * Must specify a name to identify this tool for adding to Tool Manager.
     */
    name: 'shape',

    /**
     * Initializes text tool.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('shapeTool.init() called multiple times.');
      }

      var allHandlers = [ShapeSelectActionHandler, FormatObjectActionHandler,
        ModifyTransformActionHandler, ShapeDeleteActionHandler,
        ModifyShapeFillActionHandler];

      _registerActionHandlers(allHandlers);

      _disableToken = PubSub.subscribe('qowt:disable', _disable);

      // Extend our capabilities with common action handler behaviour
      CommonActionHandler.addBehaviour(_api);
    },

    /**
     * Activates the shape tool
     * @param {object} context information about requested event
     * @public
     */
    'activate': function(/* context */) {
      if (!_active) {
        _active = true;
        _startObserving();
      }
    },

    /**
     * Deactivates the shape tool
     * @public
     */
    'deactivate': function() {

      if (_active) {
        _active = false;
        _stopObserving();
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

  /**
   * Resets the defaults and destroy all references.
   */
  var _disable = function() {
    PubSub.unsubscribe(_disableToken);
    _disableToken = undefined;
  };

  /**
   * Registers all action handlers associated with tool along with
   * callback action.
   * @param {array} allHandlers Action Handlers associated with this tool.
   * @private
   */
  var _registerActionHandlers = function(allHandlers) {
    allHandlers.forEach(function(actionHandler) {
      actionHandler.supportedActions.forEach(function(action) {
        _actionHandlers[action] = _actionHandlers[action] || [];
        _actionHandlers[action].push(actionHandler.callback);
      });
    });
  };

  /**
   * Publish event as per action
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the event.
   * @private
   */
  var _handleAction = function(eventType, eventData) {
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
  };

  /**
   * Handles shape selection as per selectionChange event
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  function _handleSelectionChange(/* eventType, eventData */) {
    // Deselect the previous selection if any
    /*var oldSelection = eventData && eventData.oldSelection;
    var context;
    if (oldSelection && oldSelection.contentType === 'shape') {
      context = {
        action: 'deselect',
        contentType: 'shape',
        node: oldSelection.scope,
        textBodyNode: oldSelection.textBodyNode
      };
      _handleAction('qowt:requestAction', context);
    }

    // Update selection with new context from eventData
    var selection = eventData && eventData.newSelection;
    if (selection && selection.contentType === 'shape') {
      context = {
        action: 'select',
        contentType: 'shape',
        node: selection.scope,
        textBodyNode: selection.textBodyNode
      };
      _handleAction('qowt:requestAction', context);
    }*/
  }

  /**
   * Start observing qowt signals by subscribing.
   * @private
   */
  var _startObserving = function() {
    _actionToken = PubSub.subscribe('qowt:requestAction', _handleAction);
    _selToken = PubSub.subscribe('qowt:selectionChanged',
        _handleSelectionChange);
  };

  /**
   * Stop observing qowt signals by unsubscribing.
   * @private
   */
  var _stopObserving = function() {
    PubSub.unsubscribe(_actionToken);
    PubSub.unsubscribe(_selToken);
  };

  return _api;
});
