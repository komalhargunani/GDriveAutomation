/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Class for building drag handlers.
 * @author elqursh@google.com (Ali Elqursh)
 */

define([], function() {

  'use strict';

  /**
   * Creates a drag/drop event handler builder. The builder takes five optional
   * callback functions: mouseDown, dragStart, drag, dragEnd, and mouseUp, which
   * are called in that order, subject to these constraints:
   *
   * <ul>
   * <li>mouseDown is called if the left mouse button is pressed (except on a
   *     Mac when the Command key is down).
   * <li>dragStart is called when a drag has begun, which is immediately after
   *     mouseDown unless a time or pixel threshold has been specified.
   * <li>drag is called for each mouse move event after dragStart. It is
   *     guaranteed to be called at least once, if dragStart has been called.
   * <li>dragEnd is called when dragging has finished.
   * <li>mouseUp is called after dragEnd, or after mouseDown if the thresholds
   *     prevented a drag from ever starting.
   * </ul>
   *
   * This can also be described by the expression:
   * (mouseDown (dragStart, drag+, dragEnd)? mouseUp)?
   *
   * The first argument to all functions is the associated event. An empty data
   * object is created for each drag and is passed as the second argument to the
   * functions. It can be used to hold application drag-specific state.
   *
   * Not all functions are typically needed by any given drag handler.
   *
   * @param {Object} handler Specifies the object to which {@code this}
   *     should point when the functions are called.
   * @constructor
   */
  var DragBuilder = function(element, handler, opt_pixelsSq) {
    /**
     * Context object for all callbacks.
     * @type {Object}
     * @private
     */
    this.handler_ = handler;

    /**
     * The element to which to attach event listeners.
     * @type {Node}
     * @private
     */
    this.element_ = element;

    /**
     * Amount of pixels to consider it a dragging event
     */
    this.pixelsSq_ = opt_pixelsSq ? opt_pixelsSq : 0;
  };

  DragBuilder.prototype.constructor = DragBuilder;

  /**
   * Creates a drag/drop event handler using the current builder settings.
   * The handler should be attached to an element's mousedown event.
   *
   * A builder should not be re-used to build multiple handlers.
   * @return {function(!Event)} Event handler.
   */
  DragBuilder.prototype.build = function() {
    var handler = this.handler_;
    var element = this.element_;
    var self = this;
    var MOUSE_BUTTON_LEFT = 0;
    return function(downEvent) {
      // Enable drag only on left mouse button
      if (downEvent.button !== MOUSE_BUTTON_LEFT) {
        return;
      }

      downEvent.preventDefault();
      downEvent.stopPropagation();

      var oldpr = [downEvent.clientX, downEvent.clientY];
      var dragging = false;

      function startDrag() {
        dragging = true;
        handler.onDragStart(downEvent);
        handler.onDrag(downEvent);
        downEvent = null;
      }

      function stopDrag(e) {
        element.removeEventListener('mousemove',mouseMove);
        element.removeEventListener('mouseup', mouseUp);
        if (dragging) {
          handler.onDragEnd(e);
        }
      }

      function mouseMove(e) {
        e.stopPropagation();
        e.preventDefault();
        if (dragging) {
          handler.onDrag(e);
        } else {
          var tx = e.clientX - oldpr[0];
          var ty = e.clientY - oldpr[1];
          if (tx * tx + ty * ty > self.pixelsSq_) {
            startDrag();
            handler.onDrag(e);
          }
        }
      }

      function mouseUp(e) {
        e.stopPropagation();
        e.preventDefault();
        stopDrag(e);
        handler.onMouseUp(e);
      }

      element.addEventListener('mousemove', mouseMove, false);
      element.addEventListener('mouseup', mouseUp, false);

      handler.onMouseDown(downEvent);
      if (!self.pixelsSq_) {
        startDrag();
      }
    };
  };

  return DragBuilder;
});
