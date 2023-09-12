// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Point overlay node creation and Handling
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

/**
 * Point overlay object
 * @param {Object} config Configuration object, consists of:
 *    config.fromNode {HTML Element} Determine if this widget can be
 *               constructed given this as a base.
 */

define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/utils/domUtils'
], function(DeprecatedUtils, DomUtils) {

  'use strict';


  var _factory = {

    create: function(config) {
      // use module pattern for instance object
      var module = function() {
        var _overlay;

        var _api = {

          /**
           * Get overlay DIV
           * @return {HTML} overlay div
           */
          getWidgetElement: function() {
            return _overlay;
          },

          /**
           * Change visibility of overlay node
           * @param {boolean} visible Visibility state to set
           */
          setVisible: function(visible) {
            if (visible) {
              _overlay.style.display = 'block';
              _overlay.style.zIndex = '1';
            } else {
              _overlay.style.display = 'none';
              _overlay.style.zIndex = '-11';
            }
          },

          /**
           * Returns the visibility of the overlay widget
           */
          isVisible: function() {
            return (_overlay.style.display === 'block');
          },

          /**
           * Move shape ghost node as per mouse move
           * @param  {number} x x-co-ordinate of new location
           * @param {number} y y-co-ordinate of new location
           */
          moveDragImage: function(shapeWidget, x, y) {
            // handle rotation and flips of shape if applied
            var adjustedOffsets = _computeOffsets(shapeWidget, x, y);

            var shapeGhost = _getShapeGhost();
            var shapeNode = shapeWidget.getWidgetElement();
            shapeGhost.style.display = getComputedStyle(shapeNode).display;
            shapeGhost.style.left = (adjustedOffsets.x).toFixed(2);
            shapeGhost.style.top = (adjustedOffsets.y).toFixed(2);
          },

          /**
           * Hides the drag image
           */
          hideDragImage: function() {
            var shapeGhost = _getShapeGhost();
            shapeGhost.style.display = 'none';
          },

          /**
           * Updates the appearance of the overlay to match that of the node.
           * @param {object} shapeWidget Shape widget
           * @private
           */
          update: function(shapeWidget) {
            var node = shapeWidget.getWidgetElement();
            // Remove existing shapeGhost before appending new one.
            var oldShapeGhost = _getShapeGhost();
            if (oldShapeGhost) {
              _overlay.removeChild(oldShapeGhost);
            }

            // Cloned the node (to which overlay
            // appends) which is used to show while overlay is moving.
            var shapeGhost = DomUtils.cloneNode(node, true);
            if (node.setModel && shapeGhost.setModel) {
              shapeGhost.setModel(node.model);
            }
            // TODO (bhushan.shitole): Move logic of 'removal of handlers node
            // from cloned node' to 'cloneMe' function once we move to polymer.

            // remove handlers node from cloned node
            var handlersNode = shapeGhost.querySelector(
                '[qowt-divtype=handlers]');
            if (handlersNode) {
              // Remove all resize pins keeping the selection border intact.
              while (handlersNode.firstChild) {
                handlersNode.removeChild(handlersNode.firstChild);
              }
            }

            // TODO (bhushan.shitole): Move logic of 'changing Ids of
            // cloned node and its children' to 'cloneMe' function once we move
            // to polymer.

            // change Ids of shape ghost node and its children
            DomUtils.prependChildrenID(shapeGhost, 'cloned', '-');
            shapeGhost.classList.add('shapeGhost');
            var canvasNode = node.querySelector('canvas');
            if (canvasNode) {
              var canvasGhost;
              DeprecatedUtils.copyAllContainedCanvases(node, shapeGhost);
              canvasGhost = shapeGhost.querySelector('canvas');
              shapeGhost.insertBefore(canvasGhost, shapeGhost.firstChild);
            }

            // Now we need to remove 'qowt-divtype' attribute from _shapeGhost
            // and from its children if exist. So when shape is selected,
            // mutation summary library would not captured nodes from overlay.
            _removeAttribute(shapeGhost);
            shapeGhost.style.display = 'none';
            shapeGhost.style.opacity = '0.5';
            shapeGhost.style.zIndex = '21';

            // Remove rotation and flip style of shapeGhost if applied as it is
            // already been applied to overlay.
            if (shapeWidget.getRotationAngle() ||
                shapeWidget.isFlippedHorizontal() ||
                shapeWidget.isFlippedVertical()) {
              shapeGhost.style['-webkit-transform'] = 'none';
            }

            _overlay.appendChild(shapeGhost);
          }
        };

        // ----------------------- PRIVATE ----------------------------

        var _getShapeGhost = function() {
          var shapeGhost = _overlay.querySelector('.shapeGhost');
          return shapeGhost;
        };


        /**
         * Compute offsets by considering rotation and flips of shape
         * @param {number} x x-co-ordinate of new location
         * @param {number} y y-co-ordinate of new location
         * @return {object} adjusted offsets
         * @private
         */
        var _computeOffsets = function(shape, x, y) {
          var adjustedX = x,
              adjustedY = y;

          //Considering rotation
          var degrees = shape.getRotationAngle();
          if (degrees) {
            var radians = (degrees * Math.PI) / 180;
            adjustedX = (y * Math.sin(radians)) + (x * Math.cos(radians));
            adjustedY = (y * Math.cos(radians)) - (x * Math.sin(radians));
          }

          //Considering flips
          if (shape.isFlippedHorizontal()) {
            adjustedX = -1 * adjustedX;
          }

          if (shape.isFlippedVertical()) {
            adjustedY = -1 * adjustedY;
          }

          return { x: adjustedX, y: adjustedY };
        };

        /**
         * Removes 'qowt-divtype' attribute from itself and from children
         * @param {DOM} node html element to be process
         * @private
         */
        var _removeAttribute = function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute('qowt-divtype')) {
              node.removeAttribute('qowt-divtype');
            }

            if (node.hasAttribute('qowt-eid')) {
              node.removeAttribute('qowt-eid');
            }
          }


          var childNodes = node.childNodes;
          if (childNodes && childNodes.length) {
            var childrenLength = childNodes.length;
            for (var i = 0; i < childrenLength; i++) {
              var child = childNodes[i];
              _removeAttribute(child);
            }
          }
        };

        var _constructNewOverlay = function() {
          _overlay = document.createElement('DIV');
          _overlay.setAttribute('qowt-divType', 'overlay');
          _overlay.classList.add('qowt-point-overlay');
        };

        var _constructFromElement = function() {
          _overlay = config.fromNode;
        };

        var _init = function() {
          if(config.fromNode) {
            _constructFromElement();
          } else {
            _constructNewOverlay();
          }
        };

        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
