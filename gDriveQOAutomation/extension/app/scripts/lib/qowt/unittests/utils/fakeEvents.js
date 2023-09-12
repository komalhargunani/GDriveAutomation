/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple module to fake events
 *
 * Use:
 * FakeEvents.simulate(document.getElementById("btn"), "click");
 *
 * You can also override the default options:
 * FakeEvents.simulate(document.getElementById("btn"), "click", {
 *   pointerX: 123, pointerY: 321
 * });
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {

    simulate: function(element, eventName) {
      var options = _extend({}, _defaultOptions);
      options = _extend(options, arguments[2] || {});
      var oEvent, eventType = null;

      for (var name in _eventMatchers) {
        if (_eventMatchers[name].test(eventName)) {
          eventType = name;
          break;
        }
      }

      if (!eventType) {
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces ' +
            'are supported');
      }

      if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType === 'HTMLEvents') {
          oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
          oEvent.initMouseEvent(
              eventName, options.bubbles, options.cancelable,
              document.defaultView, options.button, options.pointerX,
              options.pointerY, options.pointerX, options.pointerY,
              options.ctrlKey, options.altKey, options.shiftKey,
              options.metaKey, options.button, null);
        }
        element.dispatchEvent(oEvent);
      } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = _extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
      }
      return element;
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  function _extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }


  var _eventMatchers = {
    'HTMLEvents': new RegExp('^(?:load|unload|abort|error|select|change|' +
        'submit|reset|focus|blur|resize|scroll)$'),
    'MouseEvents': new RegExp('^(?:contextmenu|click|dblclick|tap|' +
        'mouse(?:down|up|over|move|out|enter|leave))$')
  };
  var _defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  };

  return _api;
});
