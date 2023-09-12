// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Ghost shape widget for shape used as helper in add shape
 * operation and also to locate the exact offsets and extends for the new shape.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define(['qowtRoot/pubsub/pubsub',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/dcp/metaFileHandler',
  'qowtRoot/utils/domUtils'
], function(
    PubSub,
    ShapeHandler,
    UnitConversionUtils,
    ImageHandler,
    MetaFileHandler,
    DomUtils) {

  'use strict';
  var _destroyToken, _containerNode, _shapeTempNode, _ghostShapeNode;

  //These values corresponds to the default values for height and width.
  //By observation, in microsoft default value are 1 inch * 1 inch which
  //in turn corresponds to 96 pixels.
  var _defaultHeight = 96, _defaultWidth = 96;
  var _kGhostShape_Node = {
    Tag: 'div',
    Class: 'qowt-drawing-ghostShape qowt-drawing-ghostShape-border',
    Id: 'qowt-drawing-ghostShape'
  };

  var _api = {

    /**
     * Initialise this ghost shape needed for drawing the shape
     */
    init: function() {
      if (_destroyToken) {
        throw new Error('_ghosteShape.init() called multiple times.');
      }
      _ghostShapeNode = window.document.createElement(_kGhostShape_Node.Tag);
      _ghostShapeNode.id = _kGhostShape_Node.Id;
      _ghostShapeNode.className = _kGhostShape_Node.Class;
      _destroyToken = PubSub.subscribe('qowt:destroy', _destroy);
    },

    /**
     * Displays the ghost shape at the offsets provided.
     * @param {object} styleObject style object consist of:
     *        {Number} context.left Left position to display ghost shape.
     *        {Number} context.top Top position to display ghost shape.
     *        {Number} context.width (optional)  Width to display ghost shape
     *        {Number} context.height (optional)  Height to display ghost shape
     *        {String} context.opacity Opacity value
     */
    display: function(styleObject) {
      _ghostShapeNode.style.display = 'block';
      _containerNode.style.cursor = 'crosshair';

      for (var key in styleObject) {
        _applyStyle(key, styleObject[key]);
      }
    },

    /**
     * @return {Element | undefined}
     * Returning the main HTML element for the Ghost Shape.
     */
    getWidgetElement: function() {
      return _ghostShapeNode;
    },

    /**
     * Resize the ghost shape by calculating the height and width depending on
     * the current and previous offsets also sets the position by given offsets.
     * Also creates the dummy shape inside the ghost shape using its properties.
     * @param {Number} transformObject - Transform values.
     * @param {Number} shapeJson - shape JSON.
     */
    resize: function(transformObject, shapeJson) {
        for (var key in transformObject) {
          _applyStyle(key, transformObject[key]);
        }
        _createDummyShape(shapeJson);
    },

    /**
     * Restores the ghost shape properties also removes the dummy shape drawn.
     * Publishes the addShapeDone event which also can be considered as shape
     * draw complete event.
     */
    restore: function() {
        _ghostShapeNode.style.display = 'none';
        _containerNode.style.cursor = 'default';

        if (_shapeTempNode && _shapeTempNode.parentNode) {
          _shapeTempNode.parentNode.removeChild(_shapeTempNode);
        }
        _ghostShapeNode.style.height = '0px';
        _ghostShapeNode.style.width = '0px';
        PubSub.publish('qowt:addShapeDone', {});
    },

    /**
     * Sets default transforms when user clicks for add shape but does not drag
     * @param  {number} x x-co-ordinate of start location
     * @param {number} y y-co-ordinate of start location
     * @param {object} containerRect Bounding rect properties of container node
     */
    setDefaultTransforms: function(x, y, containerRect) {
        if (_ghostShapeNode.style.height === '0px' &&
            _ghostShapeNode.style.width === '0px') {

          var newTop, newLeft;
          newTop = (parseInt(containerRect.height, 10)) - parseInt(y, 10);
          newLeft = (parseInt(containerRect.width, 10)) - parseInt(x, 10);
          _ghostShapeNode.style.height = _defaultHeight + 'px';
          _ghostShapeNode.style.width = _defaultWidth + 'px';
          if (newTop <= _defaultHeight) {
            _ghostShapeNode.style.top =
                (parseInt(containerRect.height, 10) - _defaultHeight) + 'px';
          }
          if (newLeft <= _defaultWidth) {
            _ghostShapeNode.style.left =
                (parseInt(containerRect.width, 10) - _defaultWidth) + 'px';
          }
        }
    },

    /**
     * Returns the ghost shape's extends and offsets.
     * @return {Object}
     */
    getShapeJson: function() {
      return {
        transforms: {
          ext: {
            cx: _ghostShapeNode.style.width,
            cy: _ghostShapeNode.style.height
          },
          off: {
            x: parseInt(_ghostShapeNode.style.left, 10),
            y: parseInt(_ghostShapeNode.style.top, 10)
          }
        }
      };
    },

    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a specified
     * node in the HTML DOM.
     * Here the cell's format div element, if it exists, is appended as a
     * child to the specified node and the cell's burst area div element
     * or content div element, if either exists, is appended as a child to the
     * specified node
     * @param {Node} containerNode  The HTML node that this widget is to attach
     *     itself to
     */
    appendTo: function(containerNode) {
      if (containerNode === undefined) {
        throw new Error('GhostShape.appendTo() - missing node parameter!');
      }

      _containerNode = containerNode;

      if (_ghostShapeNode) {
        containerNode.appendChild(_ghostShapeNode);
      }
    },

    /**
     * Return container node element
     * @return {HTMLElement} container node
     */
    getContainerNode: function() {
      return _containerNode;
    }
  };

  /**
   * Remove the html elements from their parents and destroy all references.
   * Removes the event listeners attached and unsubscribes the PubSub events.
   * @private
   */
  var _destroy = function() {
    if (_ghostShapeNode && _ghostShapeNode.parentNode) {
      _ghostShapeNode.parentNode.removeChild(_ghostShapeNode);
    }
    PubSub.unsubscribe(_destroyToken);
    _destroyToken = undefined;
    _ghostShapeNode = undefined;
  };

  /**
   * This method creates the dummy shape with reference to the ghost shape
   * nodes offsets and extends. As the mouse operation happens this dummy
   * shape gets created based on the ghost shape nodes offsets and extends
   * with the help of shape handler.
   * @param {object} shapeJson JSON of current shape
   * @private
   */
  var _createDummyShape = function(shapeJson) {
    var convertPixelToEmu = UnitConversionUtils.convertPixelToEmu;
    if (_shapeTempNode && _shapeTempNode.parentNode) {
      _shapeTempNode.parentNode.removeChild(_shapeTempNode);
    }
    shapeJson.el.spPr.xfrm.ext.cx =
        convertPixelToEmu(parseInt(_ghostShapeNode.style.width, 10));
    shapeJson.el.spPr.xfrm.ext.cy =
        convertPixelToEmu(parseInt(_ghostShapeNode.style.height, 10));
    shapeJson.el.spPr.xfrm.off.x = 0;
    shapeJson.el.spPr.xfrm.off.y = 0;
    shapeJson.node = _ghostShapeNode;

    //TODO (Pankaj Avhad) Right now DCP shape handler is visited. but, if we
    //want to add paragraphs and text runs to the added shape from here
    //(this module) then we may need to route shape creation through
    // DCPManager.
    ShapeHandler.visit(shapeJson);
    _shapeTempNode = _ghostShapeNode.children[0];

    if (shapeJson.el.etp === 'pic') {
      var imageJSON = {
        el: shapeJson.el.elm[0],
        node: _shapeTempNode
      };
      // TODO (bhushan.shitole): Refactor below metaFile handler logic as it
      // is duplicated in shape widget. Move this logic to a better place.
      if (imageJSON.el.etp === 'img') {
        // normal image
        ImageHandler.visit(imageJSON);
      } else if (imageJSON.el.etp === 'mf') {
        // meta file image
        var shapeExtents = shapeJson.el.spPr.xfrm;
        var convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;

        var metaFileDiv = MetaFileHandler.visit(imageJSON);
        var metaFileCanvas = metaFileDiv.querySelector('canvas');
        if (metaFileCanvas) {
          // In meta file handler, z-index of canvas node is set to 2, we have
          // to set it to 0 so after resize operation resize handlers node
          // would be on top.
          metaFileCanvas.style['z-index'] = 0;
        }
        var metaFileImageJson = imageJSON.el.elm[0];
        if (metaFileImageJson && shapeExtents && shapeExtents.ext) {
          metaFileImageJson.wdt = convertEmuToPixel(shapeExtents.ext.cx);
          metaFileImageJson.hgt = convertEmuToPixel(shapeExtents.ext.cy);
        }

        var metaFileImageJSON = {
          el: metaFileImageJson,
          node: metaFileDiv
        };
        ImageHandler.visit(metaFileImageJSON);
      }
    }

    // change Ids of shape temp node and its children
    DomUtils.prependChildrenID(_shapeTempNode, 'cloned', '-');

    // Now we need to remove 'qowt-divtype' attribute from _shapeTempNode.
    // Because while inserting textBox / shape, mutation summary library
    // should not captured _shapeTempNode.
    if (_shapeTempNode && _shapeTempNode.hasAttribute('qowt-divtype')) {
      _shapeTempNode.removeAttribute('qowt-divtype');
    }
  };

  /**
   * Apply style to ghost node
   * @param {string} styleName Name of style
   * @param {string} styleValue Value of style
   * @private
   */
  var _applyStyle = function(styleName, styleValue) {
    _ghostShapeNode.style[styleName] = styleValue;
  };

  return _api;
});
