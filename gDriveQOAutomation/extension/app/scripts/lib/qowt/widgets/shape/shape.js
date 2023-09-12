// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Shape Widget encapsulates the part of the HTML DOM
 * representing a shape within a slide. The shape widget manages the following
 * opertaions on a shape - select, deselct, move and resize.
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */
define([
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/widgets/factory',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/widgets/shape/shapeTextBody',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/dcp/decorators/graphicFrameDecorator',
  'qowtRoot/models/point'
], function(
    ArrayUtils,
    NavigationUtils,
    WidgetFactory,
    PubSub,
    QOWTMarkerUtils,
    ShapeTextBodyWidget,
    Utils,
    PlaceHolderManager,
    ShapeDecorator,
    GraphicFrameDecorator,
    PointModel) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Shape Widget Factory',

    supportedActions: ['select', 'deselect', 'modifyTransform', 'deleteShape'],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param {object} config Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {number} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions && !ArrayUtils.subset(config.supportedActions,
          _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      var node;

      // Now check that the config node matches
      if (config && config.fromId) {
        node = document.getElementById(config.fromId);
      }

      if (config && config.fromNode) {
        node = config.fromNode;
      }

      if (node && node.getAttribute &&
          ArrayUtils.subset([node.getAttribute('qowt-divtype')],
          ['shape', 'table', 'grFrm'])) {
        score = 100;
      }
      return score;
    },

    /**
     * @constructor Constructor for the Shape widget.
     * @param {object} config configuration object to create shape widget
     *    config.fromNode {HTML Element} Determine if this widget can be
     *                    constructed given this as a base.
     *    config.fromId   {string} Determine if this widget can be
     *                    constructed from the node referred to by this id
     *    config.withRotationHandler {boolean}
     *    config.dashed {boolean}
     * @return {object} A Shape widget.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {
        var _shapeNode, _shapeDecorator = ShapeDecorator.create(),
            _graphicFrameDecorator = GraphicFrameDecorator.create();

        var _api = {
          /**
           * Select a shape
           */
          select: function() {
            if (_api.isSelected()) {
              return;
            }

            _shapeNode.classList.add('qowt-point-move-cursor');
            _shapeNode.tabIndex = -1;
            if (!NavigationUtils.undoRedoUsingTBButton(
                document.activeElement)) {
              _shapeNode.focus();
            }

            // Update placeholder properties for current shape
            _api.updatePlaceholderProperties();

            // Create
            var handlersDiv = document.createElement('div');
            handlersDiv.classList.add('qowt-point-handlers');
            handlersDiv.setAttribute('qowt-divtype', 'handlers');

            // For now, we are not supporting resize operation on charts and
            // rotated shapes. So if chart or rotated shape is selected, we have
            // to disable resize pointers.
            if ((_shapeNode.getAttribute('qowt-divtype') !== 'grFrm') &&
                !_api.getRotationAngle()) {
              if (config.withRotationHandler) {
                _createRotationHandler(handlersDiv);
              }
              _createSideHandlers(handlersDiv);
              _createCornerHandlers(handlersDiv);
            }

            _handleFlipsForHandlersNode(handlersDiv);

            if (config.dashed) {
              handlersDiv.style.outline = '4px dashed rgba(128, 128, 255,0.7)';
            } else {
              handlersDiv.style.outline = '4px solid rgba(128, 128, 255,0.7)';
            }
            _shapeNode.appendChild(handlersDiv);

            var context = {
              'contentType': 'shape',
              'scope': _shapeNode
            };
            PubSub.publish('qowt:requestFocus', context);
          },

          /**
           * Deselects current shape when clicked on another shape or any other
           * entity than shape
           */
          deselect: function() {
            if (!_api.isSelected()) {
              return;
            }

            _shapeNode.classList.remove('qowt-point-move-cursor');
            _shapeNode.removeChild(_api.getHandlersDiv());
            _shapeNode.blur();
            PubSub.publish('qowt:requestFocusLost', {contentType: 'shape'});
          },

          /**
           * Get the element EID property.
           * @return {String} Returns value of attribute qowt-eid
           */
          getEid: function() {
            return _shapeNode.getAttribute('qowt-eid');
          },

          /**
           * Returns whether shape is selected or not
           * @return {boolean} true/false
           */
          isSelected: function() {
            // Shape is selected if it has an overlay node.
            return _api.getHandlersDiv() ? true : false;
          },

          /**
           * Updates shape transforms and redraw canvas
           * @param {object} xfrm Transform properties of shape
           */
          setTransforms: function(xfrm) {
            var divType = _shapeNode.getAttribute('qowt-divtype');
            if (divType === 'shape') {
              _shapeDecorator.setTransforms(_shapeNode, xfrm);

              // TODO [Rahul Tarafdar] This hack introduced as we do not have
              // transform decorator as of now. Once it is available, remove it.
              // 1. Make sure we have spPr properties available in model
              // 2. update the model with new transform
              // 3. fire 'shape-resized' event. This is then captured by shape
              //    polymer element to render outline WRT new extents, if any.
              _shapeNode.guaranteeProps_('model.spPr');
              _shapeNode.model.spPr.xfrm = _.cloneDeep(xfrm);
              _shapeNode.fire('shape-resized');
            } else if (divType === 'grFrm') {
              _graphicFrameDecorator.setTransforms(_shapeNode, xfrm);
            }
          },

          /**
           * Updates shape transforms and redraw canvas
           */
          getTransforms: function() {
            return {
              off: _api.getOffsets(),
              ext: _api.getExtents(),
              flipH: _api.isFlippedHorizontal(),
              flipV: _api.isFlippedVertical()
            };
          },

          /**
           * Returns current offsets of shape
           * The offsets is an object {x: number , y: number }
           * All values are returned in Emu
           * @return {object} offsets in Emu
           */
          getOffsets: function() {
            var computedStyle = window.getComputedStyle(_shapeNode);
            return {
              x: Utils.convertPixelToEmu(parseFloat(computedStyle.left)),
              y: Utils.convertPixelToEmu(parseFloat(computedStyle.top))
            };
          },

          /**
           * Returns current extents of shape
           * All values are returned in Emu
           * @return {object} extents object
           */
          getExtents: function() {
            var computedStyle = window.getComputedStyle(_shapeNode);
            return {
              cx: Utils.convertPixelToEmu(parseFloat(computedStyle.width)),
              cy: Utils.convertPixelToEmu(parseFloat(computedStyle.height))
            };
          },

          /**
           * Returns rotation angle of shape in degrees
           * @return {Number} rotation angle
           */
          getRotationAngle: function() {
            return _shapeDecorator.getRotationAngle(_shapeNode);
          },

          /**
           * Returns true if horizontal flipped value exist, false otherwise.
           * @return {boolean} flipped value existence
           */
          isFlippedHorizontal: function() {
            return _shapeDecorator.isFlippedHorizontal(_shapeNode);
          },

          /**
           * Returns true if vertical flipped value exist, false otherwise.
           * @return {boolean} flipped value existence
           */
          isFlippedVertical: function() {
            return _shapeDecorator.isFlippedVertical(_shapeNode);
          },

          /**
           * Checks if this shape represents a placeholder shape or not
           * @return {boolean}  true if the shape is a placeholder OR false
           * otherwise
           */
          isPlaceholderShape: function() {
            return QOWTMarkerUtils.fetchQOWTMarker(_shapeNode,
                'ph') !== undefined;
          },

          /**
           * Returns the shape's placeholder type, available in qowt-marker.
           * Placeholder types returned could be one of these -
           *
           * [title, ctrTitle(Center Title), subTitle, dt(Date), ftr(Footer),
           * sldNum(Slide Number), body, chart, clipArt, dgm, media, obj,
           * pic(Picture), tbl(Table), other]
           *
           * @return {string|undefined}  If the shape is a placeholder, returns
           * it's type OR otherwise undefined
           */
          getPlaceholderType: function() {
            var placeholderMarkerValue = QOWTMarkerUtils.fetchQOWTMarker(
                _shapeNode, 'ph');
            if (placeholderMarkerValue) {
              return placeholderMarkerValue.split('_')[0];
            }

            return undefined;
          },

          /**
           * Returns the shape's placeholder index, available in qowt-marker.
           *
           * @return {string|undefined}  If the shape is a placeholder, returns
           * it's index OR otherwise undefined
           */
          getPlaceholderIndex: function() {
            var placeholderMarkerValue = QOWTMarkerUtils.fetchQOWTMarker(
                _shapeNode, 'ph');
            if (placeholderMarkerValue) {
              return placeholderMarkerValue.split('_')[1];
            }

            return undefined;
          },

          /**
           * Returns the widget's node from which it was constructed.
           *
           * @return {HTMLElement|undefined}  shape node if available OR
           * otherwise undefined.
           */
          getWidgetElement: function() {
            return _shapeNode;
          },

          /**
           * Returns the shape text body widget.
           * @return {Object} Shape text body widget object
           */
          getShapeTextBodyWidget: function() {
            var shapeTextBodyNode = _getShapeTextBodyNode();
            var shapeTextBodyWidget;
            if (shapeTextBodyNode) {
              shapeTextBodyWidget = ShapeTextBodyWidget.create({
                fromNode: shapeTextBodyNode
              });
            }
            return shapeTextBodyWidget;
          },

          /**
           * Returns the overlay widget
           */
          getHandlersDiv: function() {
            return _shapeNode.querySelector('[qowt-divtype=handlers]');
          },

          /**
           * Gets shape Json
           * @return {object} Shape Json
           */
          getJson: function() {
            return _shapeNode.shapeJson;
          },

          /**
           * Sets updated shape Json to shape node
           * @param {object} json Shape JSON
           */
          setJson: function(json) {
            _shapeNode.shapeJson = json;
          },

          /**
           * Gets location div from handlers div.
           * Expected locations are w,s,e,n,nw,ws,se,en
           * @param {String} location Location of resize pin
           * @return {HTMLElement || undefined} Returns location div
           */
          getLocationDiv: function(location) {
            var resizePinClass = 'qowt-point-shape-resize-handler-' + location,
                handlersSelector = '[qowt-divtype=handlers] ',
                pinSelector = '[class=' + resizePinClass + ']',
                selector = handlersSelector + pinSelector;
            return _shapeNode.querySelector(selector);
          },

          /**
           * Gets shape fill properties.
           * @return {object} Shape Fill properties Json
           */
          getFill: function() {
            var shapeFill = {};
            if (_shapeNode.shapeJson && _shapeNode.shapeJson.spPr &&
                _shapeNode.shapeJson.spPr.fill) {
              shapeFill = _shapeNode.shapeJson.spPr.fill;
            }
            return shapeFill;
          },

          /**
           * Updates shape fill and redraw canvas
           * @param {object} fill Fill properties of shape
           */
          setFill: function(fill) {
            _shapeDecorator.setFill(_shapeNode, fill);
          },

          /**
           * Updates placeholder properties for current shape.
           */
          updatePlaceholderProperties: function() {
            // If current shape is a placeholder shape then set its placeholder
            // type and placeholder index, else reset them
            if (_api.isPlaceholderShape()) {

              var node = _shapeNode, layoutId;
              // Traverse till the slide node and fetch the layoutID from it
              while (node && node.getAttribute &&
                  node.getAttribute('qowt-divtype') !== 'slide') {
                node = node.parentNode;
              }
              if (node && node.getAttribute) {
                layoutId = node.getAttribute('sldlt');
              }
              if (layoutId) {
                PointModel.SlideLayoutId = layoutId;
              }

              var type = _api.getPlaceholderType();
              var index = _api.getPlaceholderIndex();

              PlaceHolderManager.updateCurrentPlaceHolderForShape(type, index);
            } else {
              PlaceHolderManager.resetCurrentPlaceHolderForShape();
            }
          }
        };

        // ----------------- PRIVATE SHAPE ----------------------

        /**
         * Handler div creator for given location
         * Create div and append to overlay div
         * @param {HTMLElement} handlersDiv Handlers pin container node
         * @param {string} location The location for which handler div to be
         * created viz. w,s,e,n,nw,ws,se,en
         */
        var _handlerDivCreator = function(handlersDiv, location) {
          var locationDiv = document.createElement('DIV');

          /**
           * Note: These CSS classes are defined in app layer.
           * This enables app specific styling for resize handlers
           * e.g. for chrome we can have MS like styling; and for
           * android tablet,
           * we can have styling which suites for touch based interface
           */
          locationDiv.classList.add('qowt-point-shape-resize-handler-' +
              location);
          locationDiv.style.zIndex = '20';
          locationDiv.setAttribute('location', location);
          handlersDiv.appendChild(locationDiv);
        };

        /**
         * Create side resize handlers
         */
        var _createSideHandlers = function(handlersDiv) {
          // west side resize handler
          _handlerDivCreator(handlersDiv, 'w');

          // south side resize handler
          _handlerDivCreator(handlersDiv, 's');

          // east side resize handler
          _handlerDivCreator(handlersDiv, 'e');

          // north side resize handler
          _handlerDivCreator(handlersDiv, 'n');
        };

        /**
         * Create corner resize handlers
         */
        var _createCornerHandlers = function(handlersDiv) {
          // north west corner resize handler
          _handlerDivCreator(handlersDiv, 'nw');

          // west south corner resize handler
          _handlerDivCreator(handlersDiv, 'ws');

          // south east corner resize handler
          _handlerDivCreator(handlersDiv, 'se');

          // east north corner resize handler
          _handlerDivCreator(handlersDiv, 'en');
        };

        /**
         * Create rotation handler
         */
        var _createRotationHandler = function(handlersDiv) {
          var rotationDiv;
          rotationDiv = document.createElement('DIV');
          rotationDiv.style.zIndex = '20';

          var lineDiv = document.createElement('DIV');
          lineDiv.id = 'rotation_handler_line';
          rotationDiv.appendChild(lineDiv);

          var circleDiv = document.createElement('DIV');
          circleDiv.id = 'rotation_handler_circle';
          rotationDiv.appendChild(circleDiv);

          rotationDiv.classList.add('qowt-point-shape-rotation-handler');
          handlersDiv.appendChild(rotationDiv);
        };

        /**
         * Returns the shapeTextBodyNodes widget
         * @private
         */
        var _getShapeTextBodyNode = function() {
          var textBodyNode = _shapeNode.querySelector(
              '[qowt-divtype=textBox]:not(.placeholder-text-body');
          return textBodyNode;
        };

        /**
         * Handler for flips of handlersDiv. It handles flipping of handlersDiv
         * with respect to flipped shape node.
         * @private
         */
        var _handleFlipsForHandlersNode = function(handlersDiv) {
          _shapeDecorator.handleFlipsForHandlersNode(handlersDiv, _shapeNode);
        };

        /**
         * Build a Shape widget with encapsulated HTML.
         * This form uses an element id to grab an existing node in the content
         * tree.
         * No HTML construction occurs.
         * @private
         * @param {string|number} id  element Id
         */
        var _constructFromId = function(id) {
          var nodeFromId = document.getElementById(id);
          if (nodeFromId) {
            _constructFromElement(nodeFromId);
          }
        };

        /**
         * Construct a new shape.
         */
        function _constructNew() {
          _shapeNode = new QowtPointShape();
          _shapeNode.setEid(config.newId);
          _shapeNode.setModel(config.model);

          _shapeNode.setAttribute('qowt-divtype', 'shape');
        }

        /*
         * Build a Shape widget with encapsulated HTML.
         * This form uses an existing node in the content tree so no HTML
         * construction occurs.
         * @private
         * @param {DOM} element HTML node
         */
        var _constructFromElement = function(element) {
          _shapeNode = element;
        };

        function _init() {
          if (config.fromNode) {
            _constructFromElement(config.fromNode);
          } else if (config.fromId) {
            _constructFromId(config.fromId);
          } else if (config.newId) {
            _constructNew();
          }
        }

        _init();

        // only return the module if we were successfully created
        return _shapeNode ? _api : undefined;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});
