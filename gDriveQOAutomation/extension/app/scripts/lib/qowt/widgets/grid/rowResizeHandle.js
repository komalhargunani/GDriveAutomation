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
 * Row Resize Handle
 * ========
 *
 * The row resize handle widget encapsulates the part of the HTML DOM
 * representing a workbook that displays an row resize handle over the row
 * header of a row that is being resized by the user.
 * The row resize handle widget manages the construction and logic of the row
 * resize handle.
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
 * @constructor      Constructor for the row resize handle widget.
 * @return {object}  The row resize handle widget.
 */
define([], function() {

  'use strict';


  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * @private
         */
        var _kRowResizeHandle_Node = {
          Tag: 'div',
          Class: 'qowt-sheet-row-resize-handle',
          Position: 'absolute'
        };

        /**
         * @private
         */
        var _rowResizeHandleNode, _isVisible, _height;

        /**
         * @private
         */
        var _api = {

          /**
           * Sets the row resize handle's visibility according to the
           * specified value
           *
           * @param {boolean} visible A flag indicating whether or not the row
           *                          resize handle is to be visible (true) or
           *                          not (false)
           */
          setVisible: function(visible) {
            if (_isVisible !== visible) {
              if (visible === true) {
                _rowResizeHandleNode.style.visibility = 'visible';
              } else {
                _rowResizeHandleNode.style.visibility = 'hidden';
              }
              _isVisible = visible;
            }
          },

          /**
           * Sets the row resize handle's bottom position to the
           * specified value
           *
           * @param {integer} pos The bottom position of the row resize handle
           */
          setBottomPosition: function(pos) {
            if (!_height) {
              _height = _rowResizeHandleNode.clientHeight - 1;
            }
            if (pos !== undefined) {
              _rowResizeHandleNode.style.top = (pos - _height) + 'px';
            }
          },

          /**
           * Sets the row resize handle's left position to the specified value
           *
           * @param {integer} pos The left position of the row resize handle
           */
          setLeftPosition: function(pos) {
            if (pos !== undefined) {
              // JELTE TODO: not sure we need to take the zoom in to account?
              // if (SheetConfig.CurrentZoomValue) {
              //   pos /= SheetConfig.CurrentZoomValue;
              // }
              _rowResizeHandleNode.style.left = pos + 'px';
            }
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the row resize handle div element is appended as a
           * child to the specified node.
           *
           * @param {object} node The HTML node that this widget is to attach
           *                      itself to
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw ('appendTo - missing node parameter!');
            }

            // append the formatting node
            if (_rowResizeHandleNode !== undefined) {
              node.appendChild(_rowResizeHandleNode);
            }

          },

          /**
           * Return the handle node's height
           *
           * @return {Number} The offsetWidth of the row resize handle
           */
          getHeight: function() {
            return _rowResizeHandleNode.offsetHeight;
          },

          /**
           * Remove the html elements from their parents and destroy all
           * references.
           */
          destroy: function() {
            if (_rowResizeHandleNode &&
                _rowResizeHandleNode.parentNode) {
              _rowResizeHandleNode.parentNode.
                  removeChild(_rowResizeHandleNode);
            }
            _rowResizeHandleNode = undefined;
          }
        };

        /**
         * @private
         */
        var _init = function() {
          _rowResizeHandleNode =
              document.createElement(_kRowResizeHandle_Node.Tag);
          _rowResizeHandleNode.id = _kRowResizeHandle_Node.Class;
          _rowResizeHandleNode.classList.add(_kRowResizeHandle_Node.Class);
          _rowResizeHandleNode.style.position =
              _kRowResizeHandle_Node.Position;
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
