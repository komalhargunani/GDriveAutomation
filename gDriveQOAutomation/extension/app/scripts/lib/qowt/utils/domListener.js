/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * W3C Dom Event listener routines
 *
 * NOTE: only use this if you need events to be tied to the
 * actual DOM structure, otherwise use PubSub!
 * JELTE TODO: need to clean out the use of this as the note said as
 * well as remove the use of deprecated functions.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/models/env'
  ], function(EnvModel) {

  'use strict';

  var _api = {

    /**
     * Add listener for an event and keep track of it by ID
     *
     * By tracking the Id, we can later clear ALL listeners
     * against that ID. This simplifies client code, which
     * can simply call removeGroup on its ID in one go
     *
     * @param id {string} the unique identifier for this client. Be
     *                    BE CAREFUL TO ENSURE IT REALLY IS UNIQUE!
     *                    else you might remove someone else's listener later
     * @param element {DOM Element} the target element
     * @param eventName {String} the event name to listen for
     * @param handlerFunction {Function} Can be a reference to
     *        a function or an anonymous function object
     * @param useCapture {boolean} optional argument to indicate the event
     *        should be caught during the capture (rather than during bubble)
     *        defaults to false
     */
    add: function(id, element, eventName, handlerFunction, useCapture) {
      _addListener(id, element, eventName, handlerFunction, useCapture);
    },

    /**
     * remove a group of listeners associated with a given ID
     *
     * @param id {srting} the id for which to remove all listeners
     */
    removeGroup: function(id) {
      _removeGroup(id);
    },

    /**
     * reset - remove ALL listeners
     * used in error handling when qowt fell over
     */
    reset: function() {
      _reset();
    },



    /**
     * DEPRECATED OLD ADD LISTENERS.... please use 'add' function
     * above, so that we can ensure we clean out in cases of errors
     */
    addListener: function(element, eventName, handlerFunction, useCapture) {
      _addListener(_uniqId(), element, eventName, handlerFunction, useCapture);
    },

    /**
     * DEPRECATED OLD FUNCTION - use removeGroup
     */
    removeListener: function(element, eventName, handlerFunction, useCapture) {
      _removeListener(element, eventName, handlerFunction, useCapture);
    },

    /**
     * DEPRECATED OLD FUNCTION - use PubSub
     */
    dispatchEvent: function(element, eventName, eventDetail) {
      // If the element supplied is not valid lets try to use something else
      if (!element) {
        console.warn('invalid element supplied for dispatchEvent');
        element = EnvModel.rootNode ? EnvModel.rootNode : window.document;
      }
      var evt = document.createEvent("Event");
      evt.initEvent(eventName, true, false);
      evt.detail = eventDetail;
      evt.eventName = eventName;
      element.dispatchEvent(evt);
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvv

  var _listeners = {},
      _id = 0;

  var _uniqId = function() {
    return '__DOMLISTENER' + _id++;
  };

  var _cacheListener = function(id, element, eventName, handlerFunction,
                                useCapture) {
    _listeners[id] = _listeners[id] || [];
    _listeners[id].push({
      element: element,
      eventName: eventName,
      handlerFunction: handlerFunction,
      useCapture: useCapture
    });
  };

  var _addListener = function(id, element, eventName, handlerFunction,
                              useCapture) {
    useCapture = useCapture || false;

    // If the element supplied is not valid lets try to use something else
    if (!element) {
      console.warn('invalid element supplied for addListener');
      element = EnvModel.rootNode ? EnvModel.rootNode : window.document;
    }
    element.addEventListener(eventName, handlerFunction, useCapture);

    // track this listener
    if (id) {
      _cacheListener(id, element, eventName, handlerFunction, useCapture);
    }
  };

  var _removeListener = function(element, eventName, handlerFunction,
                                 useCapture) {
    useCapture = useCapture || false;
    // If the element supplied is not valid lets try to use something else
    if (!element) {
      console.warn('invalid element supplied for removeListener');
      element = EnvModel.rootNode ? EnvModel.rootNode : window.document;
    }
    element.removeEventListener(eventName, handlerFunction, useCapture);
  };

  var _removeGroup = function(id) {
    var idListeners = _listeners[id];
    if (idListeners) {
      while (idListeners.length > 0) {
        var listener = idListeners.pop();
        _removeListener(
            listener.element,
            listener.eventName,
            listener.handlerFunction,
            listener.useCapture);
      }
    }
  };

  var _reset = function() {
    for(var groupId in _listeners) {
      _removeGroup(groupId);
    }
  };

  return _api;
});
