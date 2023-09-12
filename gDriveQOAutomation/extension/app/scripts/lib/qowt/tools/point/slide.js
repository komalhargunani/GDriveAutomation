// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview  A tool for performing actions on slide.
 * This tool listens requestActions and calls respective action
 * handlers registered with it.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/addBehaviour',
  'qowtRoot/tools/point/actionHandlers/addShape',
  'qowtRoot/tools/point/actionHandlers/insertSlideNote',
  'qowtRoot/behaviours/action/commonActionHandler'
], function(
    PubSub,
    AddBehaviourActionHandler,
    AddShapeActionHandler,
    InsertSlideNoteActionHandler,
    CommonActionHandler) {

  'use strict';

  var _actionToken, _active = false, _actionHandlers = {},
      _disableToken, _selToken;

  var _api = {

    /**
     * Must specify a name to identify this tool for adding to Tool Manager.
     */
    name: 'slide',

    /**
     * Initializes slide tool.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('slideTool.init() called multiple times.');
      }
      var allHandlers = [
        AddBehaviourActionHandler,
        AddShapeActionHandler,
        InsertSlideNoteActionHandler
      ];
      _registerActionHandlers(allHandlers);
      _disableToken = PubSub.subscribe('qowt:disable', _disable);
      // Extend our capabilities with common action handler behaviour
      CommonActionHandler.addBehaviour(_api);
    },

    /**
     * Activates the slide tool
     */
    'activate': function() {
      if (!_active) {
        _active = true;
        _startObserving();
      }
    },

    /**
     * Deactivates the slide tool
     */
    'deactivate': function() {

      if (_active) {
        _active = false;
        _stopObserving();
      }
    }
  };

  /**
   * Resets the defaults and destroy all references.
   * @private
   */
  var _disable = function() {
    PubSub.unsubscribe(_disableToken);
    _disableToken = undefined;
  };


  /**
   * Handle all 'requestAction' signals.
   * @param {string} event The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  var _handleAction = function(event, eventData) {
    if (eventData && eventData.action) {
      var actionHandlers = _actionHandlers[eventData.action];
      if (actionHandlers) {
        actionHandlers.forEach(function(handler) {
          handler.call(this, eventData);
        });
      } else {
        // We haven't consumed the action directly,
        // so check if it's a common action.
        _api.handleCommonAction(event, eventData);
      }
    }
  };

  /**
   * Handles selection  change as per selectionChange event
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   * @private
   */
  function _handleSelectionChange(/* eventType, eventData */) {
    // Update selection with new context from eventData
    //TODO (Pankaj Avhad) Right now we do not need selection change mechanism,
    //but in near future we may need so keeping this method here
  }

  /**
   * Registers all action handlers associated with tool along with
   * callback action.
   * @param {Object} allHandlers Action Handlers associated with the slide tool.
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
   * Starts observing by subscribing request action.
   * @private
   */
  var _startObserving = function() {
    _actionToken = PubSub.subscribe('qowt:requestAction', _handleAction);
    _selToken = PubSub.subscribe('qowt:selectionChanged',
        _handleSelectionChange);
  };

  /**
   * Stops observing by unsubscribing request action.
   * @private
   */
  var _stopObserving = function() {
    PubSub.unsubscribe(_actionToken);
    PubSub.unsubscribe(_selToken);
  };

  return _api;
});
