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
 * Horizontal line
 * ===============
 *
 * The horizontal line widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a horizontal line over a row.
 * This widget is configurable by CSS class name, which allows it to be
 * configured for use when, for example, a row is being resized or when a row is
 * the anchor of frozen panes.
 * The horizontal line widget manages the construction and logic of the line.
 *
 * ###IMPORTANT NOTE!
 *
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching
 * of a sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * method in the widget's public API, so that the workbook layout control can
 * dictate when this method is called, at an appropriate moment to take the
 * 'hit' of render tree relayout costs.
 *
 * @constructor      Constructor for the Horizontal Line widget.
 * @param {string} className The name of the CSS class to apply to the line.
 * @return {object}  The Horizontal Line widget.
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
         * @private
         */
        var _kHorizontalLine_Node = {
          Tag: 'div',
          Class: className,
          Position: 'absolute'
        };

        /**
         * @private
         */
        var _lineNode,
            _isVisible,
            _topPos,
            _height;

        /**
         * @private
         */
        var _api = {

          /**
           * Returns whether or not the line is currently visible
           *
           * @return {boolean} A flag indicating whether or not the line
           *                   is visible (true) or not (false)
           */
          isVisible: function() {
            return _isVisible;
          },

          /**
           * Gets the top position of the line
           *
           * @return {integer} The top position of the line
           */
          getTopPosition: function() {
            return _topPos;
          },

          /**
           * Sets the line's visibility according to the specified value
           *
           * @param {boolean} visible A flag indicating whether or not the
           * line is to be visible (true) or not (false)
           *
           */
          setVisible: function(visible) {
            if (_isVisible !== visible) {
              if (visible === true) {
                _lineNode.style.visibility = 'visible';
              } else {
                _lineNode.style.visibility = 'hidden';
              }
              _isVisible = visible;
            }
          },

          /**
           * Sets the line's top position to the specified value
           *
           * @param {integer} pos The top position of the line
           */
          setTopPosition: function(pos) {
            if (pos !== undefined) {
              _lineNode.style.top = pos + 'px';
            }
            _topPos = pos;
          },

          /**
           * Sets the line's bottom position to the specified value
           *
           * @param {integer} pos The bottom position of the line
           */
          setBottomPosition: function(pos) {
            if (pos !== undefined) {
              _lineNode.style.top = (pos - _height) + 'px';
            }
            _topPos = pos - _height;
          },

          /**
           * Sets the line's left position to the specified value
           *
           * @param {integer} pos The left position of the line
           */
          setLeftPosition: function(pos) {
            if (pos !== undefined) {
              // JELTE TODO: not sure we need to take the zoom in to account?
              // if (SheetConfig.CurrentZoomValue) {
              //   pos /= SheetConfig.CurrentZoomValue;
              // }
              _lineNode.style.left = pos + 'px';
            }
          },

          /**
           * Sets the line's width to the specified value
           *
           * @param {integer} width The width of the line
           */
          setWidth: function(width) {
            if (width !== undefined) {
              _lineNode.style.width = width + 'px';
            }
          },

          /**
           * Resets the line, to be invisible
           *
           */
          reset: function() {
            _api.setVisible(false);
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the down arrow div element is appended as a child to
           * the specified node.
           *
           * @param {object} node The HTML node that this widget is to attach
           * itself to
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw ('appendTo - missing node parameter!');
            }

            // append the formatting node
            if (_lineNode !== undefined) {
              node.appendChild(_lineNode);
            }

            _height = _lineNode.clientHeight;
          },

          /**
           * Remove the html elements from their parents and destroy all
           * references.
           */
          destroy: function() {
            if (_lineNode && _lineNode.parentNode) {
              _lineNode.parentNode.removeChild(_lineNode);
            }

            _lineNode = undefined;
            _isVisible = undefined;
            _height = undefined;
          }
        };

        /**
         * @private
         */
        var _init = function() {
          _lineNode = document.createElement(_kHorizontalLine_Node.Tag);
          _lineNode.id = _kHorizontalLine_Node.Class + _factory.idCounter;
          _lineNode.classList.add(_kHorizontalLine_Node.Class);
          _lineNode.style.position = _kHorizontalLine_Node.Position;
          _api.setVisible(false);
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
