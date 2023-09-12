define([
    'qowtRoot/unittests/utils/fakeEvents'
  ], function(
    FakeEvents
  ) {

  'use strict';

  var MockMouse = function() {};

  MockMouse.prototype = {};
  MockMouse.prototype.constructor = MockMouse;

  MockMouse.prototype.click = function(elm, opt_eventOptions) {
    opt_eventOptions = opt_eventOptions || {};
    fireAsyncEventOnElement('mousedown', elm, opt_eventOptions.mousedown || {});
    fireAsyncEventOnElement('mouseup', elm, opt_eventOptions.mouseup || {});
    fireAsyncEventOnElement('click', elm, opt_eventOptions.click || {});
  };

  MockMouse.prototype.mouseOver = function(elm) {
    fireAsyncEventOnElement('mouseenter', elm);
    fireAsyncEventOnElement('mouseover', elm);
  };

  MockMouse.prototype.mouseOut = function(elm) {
    fireAsyncEventOnElement('mouseout', elm);
    fireAsyncEventOnElement('mouseleave', elm);
  };

  MockMouse.prototype.dbClick = function(elm, opt_eventOptions) {
    this.click(elm, opt_eventOptions);
    this.click(elm, opt_eventOptions);
  };

  MockMouse.prototype.mouseDown = function(elm, opt_eventOptions) {
    fireAsyncEventOnElement('mousedown', elm, opt_eventOptions);
  };

  MockMouse.prototype.mouseMove = function(elm, opt_eventOptions) {
    fireAsyncEventOnElement('mousemove', elm, opt_eventOptions);
  };

  MockMouse.prototype.mouseUp = function(elm, opt_eventOptions) {
    fireAsyncEventOnElement('mouseup', elm, opt_eventOptions);
  };

  MockMouse.prototype.contextMenu = function(elm, opt_eventOptions) {
    fireAsyncEventOnElement('contextmenu', elm, opt_eventOptions);
  };

  function fireAsyncEventOnElement(eventName, elm, opt_eventOptions) {
    setTimeout(function() {
      FakeEvents.simulate(elm, eventName, opt_eventOptions);
    }, 0);
  }

  return new MockMouse();
});
