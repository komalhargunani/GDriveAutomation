/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Class for move shape handling.
 * @author elqursh@google.com (Ali Elqursh)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/models/point',
    'qowtRoot/dcp/utils/unitConversionUtils',
    'qowtRoot/widgets/point/overlay',
    'qowtRoot/presentation/placeHolder/placeHolderManager',
    'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
    'qowtRoot/utils/objectUtils'
], function(PubSub, PointModel, Utils, OverlayWidget, PlaceHolderManager,
            PlaceHolderPropertiesManager, ObjectUtils) {

  'use strict';

  /**
   * A drag handler for dragging the currently selected shape(s) or group(s).
   * @constructor
   */
  var MoveShapeDragHandler = function(shape, slideNode) {
    /**
     * Context object for all callbacks.
     * @type {Object}
     * @private
     */
    this.shape_ = shape;

    /**
     * The slide within which that shape is contained
     * @private
     */
    this.slideNode_ = slideNode;

    /**
     * Start location for dragging.
     * @private
     */
    this.x_ = null;
    this.y_ = null;

    this.overlay_ = OverlayWidget.create(overlayConfiguration_);
  };

  MoveShapeDragHandler.prototype.constructor = MoveShapeDragHandler;

  MoveShapeDragHandler.prototype.onMouseDown = function() {
  };

  MoveShapeDragHandler.prototype.onDragStart = function(event) {
    var shapeNode = this.shape_.getWidgetElement();
    this.overlay_.update(this.shape_);
    this.overlay_.setVisible(true);
    shapeNode.appendChild(this.overlay_.getWidgetElement());

    this.x_ = event.clientX / PointModel.currentZoomScale;
    this.y_ = event.clientY / PointModel.currentZoomScale;

    this.shapeJson_ = {
      el: this.shape_.getJson()
    };

    if (this.shape_.isPlaceholderShape()) {
      PlaceHolderManager.updateCurrentPlaceHolderForShape(
          this.shapeJson_.el.nvSpPr.phTyp, this.shapeJson_.el.nvSpPr.phIdx);

      var resolvedSpPr =
          PlaceHolderPropertiesManager.getResolvedShapeProperties();

      if (resolvedSpPr) {
        var objectUtils = new ObjectUtils();
        var xfrm = {};
        // get local copy of resolvedSpPr object
        var resolvedSpPrJSON = objectUtils.clone(resolvedSpPr.xfrm);

        // get resolved shape properties into xfrm
        objectUtils.appendJSONAttributes(xfrm, resolvedSpPrJSON);
        // overwrite explicit shape properties into xfrm
        objectUtils.appendJSONAttributes(xfrm, this.shapeJson_.el.spPr.xfrm);
        this.shapeJson_.el.spPr.xfrm = xfrm;
      }
    }
  };

  MoveShapeDragHandler.prototype.onDrag = function(event) {
    var x = event.clientX / PointModel.currentZoomScale,
        y = event.clientY / PointModel.currentZoomScale;
    this.overlay_.moveDragImage(this.shape_, x - this.x_, y - this.y_);
  };

  MoveShapeDragHandler.prototype.onDragEnd = function(event) {
    var shapeNode = this.shape_.getWidgetElement();

    this.overlay_.hideDragImage();
    shapeNode.removeChild(this.overlay_.getWidgetElement());

    var offsets = handleMouseMoved_.call(this, event);

    var _convertPixelToEmu = Utils.convertPixelToEmu;
    var shapeMovedEventData = {
      action: 'modifyTransform',
      context: {
        command: {
          name: 'modTrfm',
          eid: shapeNode.id,
          xfrm: {
            off: {
              x: _convertPixelToEmu(offsets.left),
              y: _convertPixelToEmu(offsets.top)
            },
            ext: this.shape_.getExtents(),
            flipH: this.shape_.isFlippedHorizontal(),
            flipV: this.shape_.isFlippedVertical()
          },
          sn: getSlideIndexFromNode_(this.slideNode_) + 1
        }
      }
    };
    PubSub.publish('qowt:requestAction', shapeMovedEventData);
  };

  MoveShapeDragHandler.prototype.onMouseUp = function() {
  };

  // -------------------- PRIVATE ----------------

  var overlayConfiguration_ = {
    withCornerHandlers: true,
    withSideHandlers: false,
    withRotationHandler: false,
    isDashed: false
  };

  /**
   * Extract slide index from the node
   *
   * @param {HTMLElement} slideNode slide node element
   * @return {Number} slide index
   * @private
   */
  var getSlideIndexFromNode_ = function(slideNode) {
    var slideId = slideNode.id;
    var slideIndex = slideId.substring(slideId.lastIndexOf('-') + 1);
    return parseInt(slideIndex, 10);
  };

  /**
   * Handles shape move with mouse
   * @param {object} event event data
   */
  var handleMouseMoved_ = function(event) {
    var x2 = event.clientX / PointModel.currentZoomScale,
        y2 = event.clientY / PointModel.currentZoomScale,
        deltaX = this.x_ - x2,
        deltaY = this.y_ - y2,
        topStyle, leftStyle;
    var shapeNode = this.shape_.getWidgetElement();
    topStyle = parseFloat(window.getComputedStyle(shapeNode).top);
    leftStyle = parseFloat(window.getComputedStyle(shapeNode).left);

    return {
      left: leftStyle - deltaX,
      top: topStyle - deltaY
    };
  };

  return MoveShapeDragHandler;
});
