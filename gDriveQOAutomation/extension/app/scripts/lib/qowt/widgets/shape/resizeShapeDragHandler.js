/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Class for resize shape handling.
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/point',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/utils/domUtils',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/utils/objectUtils'
], function(PubSub, PointModel, Utils, GhostShape, DomUtils, PlaceHolderManager,
            PlaceHolderPropertiesManager, ObjectUtils) {

  'use strict';

  /**
   * A drag handler for dragging the currently selected shape(s) or group(s).
   * @constructor
   */
  var ResizeShapeDragHandler = function(shape, slideNode) {
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
  };

  ResizeShapeDragHandler.prototype.constructor = ResizeShapeDragHandler;

  ResizeShapeDragHandler.prototype.onMouseDown = function(event) {
    // shape resize operation
    this.locationNode_ = event.target.getAttribute('location');

    _prepareForResize.call(this);
  };

  ResizeShapeDragHandler.prototype.onDragStart = function() {

  };

  ResizeShapeDragHandler.prototype.onDrag = function(event) {
    if (this.locationNode_) {
      var positionLeft = event.clientX;
      var positionTop = event.clientY;

      this.x2_ = (positionLeft - this.containerRect_.left);
      this.y2_ = (positionTop - this.containerRect_.top);
      this.doc_ = document.documentElement;

      _handleShapeResize.call(this, positionLeft, positionTop);
    }
  };

  ResizeShapeDragHandler.prototype.onDragEnd = function() {

  };

  ResizeShapeDragHandler.prototype.onMouseUp = function() {

    var convertPixelToEmu = Utils.convertPixelToEmu;
    var ghostNode = GhostShape.getWidgetElement();
    var shapeNode = ghostNode.firstChild;
    if (shapeNode) {

      var horizontalFlip = false, verticalFlip = false;
      var transformValue = DomUtils.getTransformValue(shapeNode, 'scale');
      if (transformValue) {
        horizontalFlip = transformValue.flipH === '-1' ? true : false;
        verticalFlip = transformValue.flipV === '-1' ? true : false;
      }

      var off = [], ext = [],
          offsets = [[ghostNode.style.left, this.slideNode_.offsetLeft],
              [ghostNode.style.top, this.slideNode_.offsetTop]];

      offsets.forEach(function(config, idx) {
        off[idx] = convertPixelToEmu((parseFloat(config[0]) -
            config[1]) / PointModel.currentZoomScale);
      });

      [ghostNode.style.width, ghostNode.style.height].
          forEach(function(val, idx) {
            ext[idx] = convertPixelToEmu(parseFloat(val) /
                PointModel.currentZoomScale);
          });

      var shapeResizedEventData = {
        action: 'modifyTransform',
        context: {
          command: {
            name: 'modTrfm',
            eid: this.shape_.getWidgetElement().id,
            xfrm: {
              off: {
                x: off[0],
                y: off[1]
              },
              ext: {
                cx: ext[0],
                cy: ext[1]
              },
              flipH: horizontalFlip,
              flipV: verticalFlip
            },
            sn: getSlideIndexFromNode_(this.slideNode_) + 1
          }
        }
      };
      PubSub.publish('qowt:requestAction', shapeResizedEventData);
    }
    GhostShape.restore();

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
   * Prepare ghost shape for resize operation
   * @private
   */
  var _prepareForResize = function() {
    var shapeNode = this.shape_.getWidgetElement();
    var containerNode = GhostShape.getContainerNode();
    var ghostShapeNode = GhostShape.getWidgetElement();
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

    this.shapeRect_ = shapeNode.getBoundingClientRect();
    this.containerRect_ = containerNode.getBoundingClientRect();
    this.isFlipHOriginally_ = this.shapeJson_.el.spPr.xfrm.flipH;
    this.isFlipVOriginally_ = this.shapeJson_.el.spPr.xfrm.flipV;
    this.x1_ = (this.shapeRect_.left - this.containerRect_.left);
    this.y1_ = (this.shapeRect_.top - this.containerRect_.top);
    this.transformObject_ = {
      left: this.x1_ + 'px',
      top: this.y1_ + 'px',
      width: this.shapeRect_.width + 'px',
      height: this.shapeRect_.height + 'px'
    };

    var styleObject = {
      left: this.x1_ + 'px',
      top: this.y1_ + 'px',
      width: this.shapeRect_.width + 'px',
      height: this.shapeRect_.height + 'px',
      opacity: '0.5'
    };
    GhostShape.display(styleObject);

    // Remove border except for text Box and placeholder shapes
    // If it is a text Box having border then do not add class
    if ((this.shapeJson_.el.nvSpPr.phTyp ||
        this.shapeJson_.el.nvSpPr.isTxtBox) && !this.shapeJson_.el.spPr.ln) {
      ghostShapeNode.classList.add('qowt-drawing-ghostShape-border');
    } else {
      ghostShapeNode.classList.remove('qowt-drawing-ghostShape-border');
    }
  };


  /**
   * Handler for shape resize
   * @param {Number} positionLeft - left position.
   * @param {Number} positionTop - top position.
   * @private
   */
  var _handleShapeResize = function(positionLeft, positionTop) {
    switch (this.locationNode_) {
      case 'w':
        _resizeFromWest.call(this, positionLeft);
        break;
      case 's':
        _resizeFromSouth.call(this, positionTop);
        break;
      case 'e':
        _resizeFromEast.call(this, positionLeft);
        break;
      case 'n':
        _resizeFromNorth.call(this, positionTop);
        break;
      case 'nw':
        _resizeFromNorthWest.call(this, positionLeft,
            positionTop);
        break;
      case 'ws':
        _resizeFromWestSouth.call(this, positionLeft,
            positionTop);
        break;
      case 'se':
        _resizeFromSouthEast.call(this, positionLeft,
            positionTop);
        break;
      case 'en':
        _resizeFromEastNorth.call(this, positionLeft,
            positionTop);
        break;
      default:
    }
    GhostShape.resize(this.transformObject_, this.shapeJson_);
  };

  /**
   * Handler for vertical flip
   * @param {boolean} flip Status of vertical flip
   * @private
   */
  var _handleVerticalFlip = function(flip) {
    if ((this.isFlipVOriginally_ && flip) ||
        (!this.isFlipVOriginally_ && !flip)) {
      this.shapeJson_.el.spPr.xfrm.flipV = false;
    } else {
      this.shapeJson_.el.spPr.xfrm.flipV = true;
    }
  };

  /**
   * Handler for horizontal flip
   * @param {boolean} flip Status of horizontal flip
   * @private
   */
  var _handleHorizontalFlip = function(flip) {
    if ((this.isFlipHOriginally_ && flip) ||
        (!this.isFlipHOriginally_ && !flip)) {
      this.shapeJson_.el.spPr.xfrm.flipH = false;
    } else {
      this.shapeJson_.el.spPr.xfrm.flipH = true;
    }
  };

  /**
   * Apply style to ghost node
   * @param {string} styleName Name of style
   * @param {string} styleValue Value of style
   * @private
   */
  var _applyStyle = function(styleName, styleValue) {
    this.transformObject_[styleName] = styleValue;
  };

  /**
   * Handler for West direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @private
   */
  var _resizeFromWest = function(positionLeft) {
    var condition = positionLeft > this.shapeRect_.right;
    var left = (Math.min((this.shapeRect_.right - this.containerRect_.left),
        this.x2_) + this.doc_.scrollLeft) + 'px';
    _handleFlips.call(this, _handleHorizontalFlip, condition);
    this.transformObject_.left = left;
    this.transformObject_.width = Math.abs(this.x2_ - (this.shapeRect_.right -
        this.containerRect_.left)) + 'px';
  };

  /**
   * Handler for South direction
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromSouth = function(positionTop) {
    var condition = positionTop < this.shapeRect_.top;
    _handleFlips.call(this, _handleVerticalFlip, condition);
    var top = (Math.min(this.y1_, this.y2_) + this.doc_.scrollTop) + 'px';
    this.transformObject_.top = top;
    this.transformObject_.height = Math.abs(this.y2_ - this.y1_) + 'px';
  };

  /**
   * Handler for East direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @private
   */
  var _resizeFromEast = function(positionLeft) {
    var condition = positionLeft < this.shapeRect_.left;
    _handleFlips.call(this, _handleHorizontalFlip, condition);
    this.transformObject_.left = (Math.min(this.x1_, this.x2_) +
        this.doc_.scrollLeft) + 'px';
    this.transformObject_.width = Math.abs(this.x2_ - this.x1_) + 'px';
  };

  /**
   * Handler for North direction
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromNorth = function(positionTop) {
    var condition = positionTop > this.shapeRect_.bottom;
    _handleFlips.call(this, _handleVerticalFlip, condition);
    var top = (Math.min((this.shapeRect_.bottom - this.containerRect_.top),
        this.y2_) + this.doc_.scrollTop) + 'px';
    var height = Math.abs(this.y2_ - (this.shapeRect_.bottom -
        this.containerRect_.top)) + 'px';
    this.transformObject_.top = top;
    this.transformObject_.height = height;
  };

  /**
   * Handler for North - West direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromNorthWest = function(positionLeft, positionTop) {
    var condition = positionTop > this.shapeRect_.bottom;
    var topWhenTrue = ((this.shapeRect_.bottom -
        this.containerRect_.top) + this.doc_.scrollTop) + 'px';
    var topWhenFalse = (this.y2_ + this.doc_.scrollTop) + 'px';
    _handleFlips.call(this, _handleVerticalFlip, condition, 'top',
        topWhenTrue, topWhenFalse);

    condition = positionLeft > this.shapeRect_.right;
    _handleFlips.call(this, _handleHorizontalFlip, condition);

    var left = (Math.min(this.x2_, (this.shapeRect_.right -
        this.containerRect_.left)) + this.doc_.scrollLeft) + 'px';

    this.transformObject_.left = left;
    this.transformObject_.width = Math.abs(this.x2_ - (this.shapeRect_.right -
        this.containerRect_.left)) + 'px';
    this.transformObject_.height = Math.abs(this.y2_ - (this.y1_ +
        this.shapeRect_.height)) + 'px';
  };

  /**
   * Handler for West - South direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromWestSouth = function(positionLeft, positionTop) {
    var condition = positionTop < this.shapeRect_.top;
    var topWhenTrue = (this.y2_ + this.doc_.scrollTop) + 'px';
    var topWhenFalse = ((this.shapeRect_.top -
        this.containerRect_.top) + this.doc_.scrollTop) + 'px';
    var left = (Math.min((this.shapeRect_.right -
        this.containerRect_.left), this.x2_) + this.doc_.scrollLeft) + 'px';

    _handleFlips.call(this, _handleVerticalFlip, condition, 'top', topWhenTrue,
        topWhenFalse);

    condition = positionLeft > this.shapeRect_.right;
    _handleFlips.call(this, _handleHorizontalFlip, condition);
    this.transformObject_.left = left;
    this.transformObject_.width = Math.abs(this.x2_ - (this.shapeRect_.right -
        this.containerRect_.left)) + 'px';
    this.transformObject_.height = Math.abs(this.y2_ - this.y1_) + 'px';
  };

  /**
   * Handler for South - East direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromSouthEast = function(positionLeft, positionTop) {
    var condition = positionTop < this.shapeRect_.top;
    var topWhenTrue = (this.y2_ + this.doc_.scrollTop) + 'px';
    var topWhenFalse = ((this.shapeRect_.top -
        this.containerRect_.top) + this.doc_.scrollTop) + 'px';
    _handleFlips.call(this, _handleVerticalFlip, condition, 'top', topWhenTrue,
        topWhenFalse);

    condition = positionLeft < this.shapeRect_.left;
    _handleFlips.call(this, _handleHorizontalFlip, condition);
    this.transformObject_.left = (Math.min(this.x1_, this.x2_) +
        this.doc_.scrollLeft) + 'px';
    this.transformObject_.width = Math.abs(this.x2_ - this.x1_) + 'px';
    this.transformObject_.height = Math.abs(this.y2_ - this.y1_) + 'px';
  };

  /**
   * Handler for East-North direction
   * @param {number} positionLeft X-coordinate of mouse pointer
   * @param {number} positionTop Y-coordinate of mouse pointer
   * @private
   */
  var _resizeFromEastNorth = function(positionLeft, positionTop) {
    var condition = positionTop > this.shapeRect_.bottom;
    var topWhenTrue = ((this.shapeRect_.bottom -
        this.containerRect_.top) + this.doc_.scrollTop) + 'px';
    var topWhenFalse = (this.y2_ + this.doc_.scrollTop) + 'px';
    _handleFlips.call(this, _handleVerticalFlip, condition, 'top',
        topWhenTrue, topWhenFalse);

    condition = positionLeft < this.shapeRect_.left;
    _handleFlips.call(this, _handleHorizontalFlip, condition);
    this.transformObject_.left = (Math.min(this.x1_, this.x2_) +
        this.doc_.scrollLeft) + 'px';
    this.transformObject_.width = Math.abs(this.x2_ - this.x1_) + 'px';
    this.transformObject_.height = Math.abs(this.y2_ - (this.y1_ +
        this.shapeRect_.height)) + 'px';
  };

  /**
   * Handler for flips
   * @param {function} callback Callback function
   * @param {boolean} condition Flip condition
   * @param {string} style Name of style to be apply
   * @param {string} styleValueForTrue Value of provided style, applied if
   *     condition is true
   * @param {string} styleValueForFalse Value of provided style, applied if
   *     condition is false
   * @private
   */
  var _handleFlips = function(callback, condition, style, styleValueForTrue,
                              styleValueForFalse) {
    if (condition) {
      if (style && styleValueForTrue) {
        _applyStyle.call(this, style, styleValueForTrue);
      }
      callback.call(this, true);
    } else {
      callback.call(this, false);
      if (style && styleValueForFalse) {
        _applyStyle.call(this, style, styleValueForFalse);
      }
    }
  };

  return ResizeShapeDragHandler;
});
