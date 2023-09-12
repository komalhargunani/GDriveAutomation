/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */



/**
 * Vertical line
 * =============
 *
 * The vertical line widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a vertical line over a column.
 * This widget is configurable by CSS class name, which allows it to be
 * configured for use when, for example, a column is being resized or when a
 * column is the anchor of frozen panes.
 * The vertical line widget manages the construction and logic of the line.
 *
 * ###IMPORTANT NOTE!
 *
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching of a
 * sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * method in the widget's public API, so that the workbook layout control can
 * dictate when this method is called, at an appropriate moment to take
 * the 'hit' of render tree relayout costs.
 *
 * @constructor      Constructor for the Vertical Line widget.
 * @param className {string}   The name of the CSS class to apply to the line.
 * @return {object}  The Vertical Line widget.
 */
define([], function() {

  'use strict';


  var _factory = {

    idCounter: 0,

    create: function(className) {

      _factory.idCounter++;

      // use module pattern for instance object
      var module = function() {

          /**
           * @api private
           */
          var _kVerticalLine_Node = {
            Tag: 'div',
            Class: className,
            Position: 'absolute'
          };

          /**
           * @api private
           */
          var _lineNode, _isVisible, _leftPos, _width;

          /**
           * @api private
           */
          var _api = {

            /**
             * Returns whether or not the line is currently visible
             *
             * @return {boolean} A flag indicating whether or not the line
             *                   is visible (true) or not (false)
             * @method isVisible()
             */
            isVisible: function() {
              return _isVisible;
            },

            /**
             * Gets the left position of the line
             *
             * @return {integer} The left position of the line
             * @method getLeftPosition()
             */
            getLeftPosition: function() {
              return _leftPos;
            },

            /**
             * Sets the line's visibility according to the specified value
             *
             * @param visible {boolean} A flag indicating whether or not the
             *                          line is to be visible (true) or not
             *                          (false)
             * @method setVisible(visible)
             */
            setVisible: function(visible) {
              if (_isVisible !== visible) {
                if (visible === true) {
                  _lineNode.style.visibility = "visible";
                } else {
                  _lineNode.style.visibility = "hidden";
                }
                _isVisible = visible;
              }
            },

            /**
             * Sets the line's left position to the specified value
             *
             * @param pos {integer} The left position of the line
             * @method setLeftPosition(pos)
             */
            setLeftPosition: function(pos) {
              if (pos !== undefined) {
                _lineNode.style.left = pos + "px";
              }
              _leftPos = pos;
            },

            /**
             * Sets the line's right position to the specified value
             *
             * @param pos {integer} The right position of the line
             * @method setRightPosition(pos)
             */
            setRightPosition: function(pos) {
              if (pos !== undefined) {
                _lineNode.style.left = (pos - _width) + "px";
              }
              _leftPos = pos - _width;
            },

            /**
             * Sets the line's top position to the specified value
             *
             * @param pos {integer} The top position of the line
             * @method setTopPosition(pos)
             */
            setTopPosition: function(pos) {
              if (pos !== undefined) {
                // JELTE TODO: not sure we need to take the zoom in to account?
                // if (SheetConfig.CurrentZoomValue) {
                //   pos /= SheetConfig.CurrentZoomValue;
                // }
                _lineNode.style.top = pos + "px";
              }
            },

            /**
             * Sets the line's height to the specified value
             *
             * @param height {integer} The height of the line
             * @method setHeight(height)
             */
            setHeight: function(height) {
              if (height !== undefined) {
                _lineNode.style.height = height + "px";
              }
            },

            /**
             * Resets the line, to be invisible
             *
             * @method reset()
             */
            reset: function() {
              _api.setVisible(false);
            },

            /**
             * Every widget has an appendTo() method.
             * This is used to attach the HTML elements of the widget to a
             * specified node in the HTML DOM. Here the down arrow div element
             * is appended as a child to the specified node.
             *
             * @param node {object} The HTML node that this widget is to attach
             *                      itself to
             * @method appendTo(node)
             */
            appendTo: function(node) {
              if (node === undefined) {
                throw ("appendTo - missing node parameter!");
              }

              // append the formatting node
              if (_lineNode !== undefined) {
                node.appendChild(_lineNode);
              }

              _width = _lineNode.clientWidth;
            },

            /**
             * Remove the html elements from their parents and destroy all
             * references.
             */
            destroy: function() {
              _destroy();
            }
          };

          /**
           * @api private
           */
          var _init = function() {
              _lineNode = document.createElement(_kVerticalLine_Node.Tag);
              _lineNode.id = _kVerticalLine_Node.Class + _factory.idCounter;
              _lineNode.classList.add(_kVerticalLine_Node.Class);
              _lineNode.style.position = _kVerticalLine_Node.Position;
              _api.setVisible(false);
            };

          /**
           * Resets everything which is initialized in init method.
           * @private
           */
          var _destroy = function() {
            if (_lineNode && _lineNode.parentNode) {
              _lineNode.parentNode.removeChild(_lineNode);
            }

            _lineNode = undefined;
            _isVisible = undefined;
            _width = undefined;
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
