// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Behaviour to handle common requested actions.
 * This behaviour can be added to any module that requests it, to extend
 * its own capabilities.
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/pubsub/pubsub'
  ], function(
    TypeUtils,
    PubSub) {

  'use strict';

  var _behaviour = {

    addBehaviour: function(module) {

      var extendModule = function() {

        /**
         * Indicate that our behaviour is supported for this module.
         * Added for consistency of the behaviours pattern - this one
         * is not actually called upon.
         */
        module.supportsHandleCommonAction = true;

        /**
         * Handle 'requestAction' signals.
         *
         * @param {string} eventType The name of the action signal received.
         * @param {object} eventData The data associated with the signal.
         */
        module.handleCommonAction = function(event, eventData) {
          // JELTE TODO - this entire toolbar/menu config setup
          // is a mess. Some configs are factories, some are singletons
          // some have context strings, others have context objects
          // which have contentType strings, yet others have contentType
          // strings directly in their config.... it's a complete mess
          // and quite frankly the way we construct the toolbars was intended
          // to simplify the codebase, but it has resulted in a mess which
          // has a number of potential defects... We need to refactor
          // that entire toolbar/menubar stuff and simplify it.
          // For our imminent 2.8.8 release we need to make word undo/redo
          // work, so adding this workaround in place for now.
          if (eventData) {
            var contentTypeCopy = 'common';
            if (TypeUtils.isString(eventData.context)) {
              contentTypeCopy = eventData.context;
            }
            if (TypeUtils.isString(eventData.contentType)) {
              contentTypeCopy = eventData.contentType;
            }
            if (eventData.context &&
                TypeUtils.isString(eventData.context.contentType)) {
              contentTypeCopy = eventData.context.contentType;
            }

            var context = {'contentType': contentTypeCopy};
            if (TypeUtils.isObject(eventData.context)) {
              eventData.context.contentType = contentTypeCopy;
              context = eventData.context;
            }
            if (event === 'qowt:requestAction') {
              PubSub.publish('qowt:doAction', {
                'action': eventData.action,
                'context': context
              });
            }
          }
        };
      };

      // actually extend the module with our behaviour
      extendModule();
    }
  };

  return _behaviour;
});