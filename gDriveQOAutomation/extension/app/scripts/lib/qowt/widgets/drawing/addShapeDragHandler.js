/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Class for add shape handling.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/drawing/geometry/objectDefaults'
], function(PubSub, GhostShape, TypeUtils, ObjectDefaults) {

  'use strict';

  /**
   * A drag handler for dragging required to add shape(s).
   * @constructor
   */
  var AddShapeDragHandler = function(containerNode, context,
      addShapeCompleteCallback) {
    containerNode = containerNode || {};
    /**
     * The slide within which that shape is contained
     * @private
     */
    this.shapePrstId_ = context.prstId;
    this.shapeIsTextBox_ = context.isTxtBox;
    this.drawingCompleteCallback_ = addShapeCompleteCallback;
  };

  AddShapeDragHandler.prototype.constructor = AddShapeDragHandler;

  AddShapeDragHandler.prototype.onMouseDown = function(e) {
    _prepareForAddShape.call(this, e);
    e.preventDefault();
  };

  AddShapeDragHandler.prototype.onDrag = function(evt) {
    var positionLeft = evt.clientX;
    var positionTop = evt.clientY;

    this.x2_ = (positionLeft - this.containerRect_.left);
    this.y2_ = (positionTop - this.containerRect_.top);
    this.doc_ = document.documentElement;

    var transformObject = {
      left: (Math.min(this.x1_, this.x2_) + this.doc_.scrollLeft) + 'px',
      top: (Math.min(this.y1_, this.y2_) + this.doc_.scrollTop) + 'px',
      width: Math.abs(this.x2_ - this.x1_) + 'px',
      height: Math.abs(this.y2_ - this.y1_) + 'px'
    };
    GhostShape.resize(transformObject, this.shapeJson_);
    evt.preventDefault(evt);
  };
  AddShapeDragHandler.prototype.onDragStart = function() {
  };
  AddShapeDragHandler.prototype.onDragEnd = function() {
  };
  AddShapeDragHandler.prototype.onMouseUp = function() {
    var shapeJson;

    if (this.drawingCompleteCallback_ &&
        TypeUtils.isFunction(this.drawingCompleteCallback_)) {
      this.drawingCompleteCallback_();
    }
    GhostShape.setDefaultTransforms(this.x1_, this.y1_, this.containerRect_);

    shapeJson = GhostShape.getShapeJson();
    shapeJson.prstId = this.shapeJson_.el.spPr.geom.prst;
    shapeJson.isTxtBox = this.shapeJson_.el.nvSpPr.isTxtBox;

    var addShapeAction = {
      action: 'addShape',
      context: {
        'command': {
          sp: shapeJson
        }
      }
    };
    PubSub.publish('qowt:requestAction', addShapeAction);
    GhostShape.restore();
  };


  /**
   * Prepare ghost shape for add shape operation
   * @param {object} e DOM Event
   * @private
   */
  var _prepareForAddShape = function(e) {
    var positionLeft = e.clientX;
    var positionTop = e.clientY;
    var containerNode = GhostShape.getContainerNode();
    var ghostShapeNode = GhostShape.getWidgetElement();
    this.containerRect_ = containerNode.getBoundingClientRect();
    this.shapeJson_ = {};

    if (this.shapeIsTextBox_) {
      this.shapeJson_.el = ObjectDefaults.getTextBoxDefaults();
    } else {
      this.shapeJson_.el = ObjectDefaults.getShapeDefaults(this.shapePrstId_);
    }

    this.x1_ = (positionLeft - this.containerRect_.left);
    this.y1_ = (positionTop - this.containerRect_.top);

    var styleObject = {
      left: this.x1_ + 'px',
      top: this.y1_ + 'px',
      height: '0px',
      width: '0px',
      opacity: '1'
    };

    GhostShape.display(styleObject);

    ghostShapeNode.classList.add('qowt-drawing-ghostShape-border');
  };

  return AddShapeDragHandler;
});
