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
 * Column Resize Handle
 * ===========
 *
 * The column resize handle widget encapsulates the part of the HTML DOM
 * representing a workbook that displays a resize handle over the column header
 * of a column that is being resized by the user.
 * The column resize handle widget manages the construction and logic of the
 * column resize handle.
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
 * @constructor      Constructor for the Column Resize Handle widget.
 * @return {object}  The Column resize handle widget.
 */
define([], function() {

  'use strict';


  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * @api private
         */
        var _kColumnResizeHandle_Node = {
          Tag: 'div',
          Class: 'qowt-sheet-col-resize-handle',
          Position: 'absolute'
        };

        /**
         * @api private
         */
        var _columnResizeHandleNode,
          _isVisible;

        /**
         * @api private
         */
        var _api = {

          /**
           * Sets the column resize handle's visibility according to the
           * specified value
           *
           * @param visible {boolean} A flag indicating whether or not the
           * column resize handle is to be visible (true) or not (false)
           *
           * @method setVisible(visible)
           */
          setVisible: function(visible) {
            if (_isVisible !== visible) {
              if (visible === true) {
                _columnResizeHandleNode.style.visibility = "visible";
              } else {
                _columnResizeHandleNode.style.visibility = "hidden";
              }
              _isVisible = visible;
            }
          },

          /**
           * Sets the column resize handle's left position to the
           * specified value
           *
           * @param pos {integer} The left position of the column resize
           * handle
           * @method setLeftPosition(pos)
           */
          setLeftPosition: function(pos) {
            if (pos !== undefined) {
              _columnResizeHandleNode.style.left = pos + "px";
            }
          },

          /**
           * Sets the column resize handle's top position to the
           * specified value
           *
           * @param pos {integer} The top position of the column resize handle
           * @method setTopPosition(pos)
           */
          setTopPosition: function(pos) {
            if (pos !== undefined) {
              // JELTE TODO: not sure we need to take the zoom in to account?
              // if (SheetConfig.CurrentZoomValue) {
              //   pos /= SheetConfig.CurrentZoomValue;
              // }
              _columnResizeHandleNode.style.top = pos + "px";
            }
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the column resize handle div element is appended as a child
           * to the specified node.
           *
           * @param node {object} The HTML node that this widget is to attach
           * itself to
           * @method appendTo(node)
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw ("appendTo - missing node parameter!");
            }

            // append the formatting node
            if (_columnResizeHandleNode !== undefined) {
              node.appendChild(_columnResizeHandleNode);
            }
          },

          /**
           * Return the column resize handle node width
           *
           * @return {Number} The offsetWidth of the _columnResizeHandleNode
           */
          getWidth: function() {
            return _columnResizeHandleNode.offsetWidth;
          },

          /**
           * Remove the html elements from their parents and destroy all
           * references.
           * @public
           */
          destroy: function() {
            if (_columnResizeHandleNode &&
              _columnResizeHandleNode.parentNode) {
              _columnResizeHandleNode.parentNode
                .removeChild(_columnResizeHandleNode);
            }
            _reset();
          }

        };

        /**
         * @api private
         */
        var _init = function() {
          _columnResizeHandleNode =
            document.createElement(_kColumnResizeHandle_Node.Tag);
          _columnResizeHandleNode.id = _kColumnResizeHandle_Node.Class;
          _columnResizeHandleNode.classList.add(
              _kColumnResizeHandle_Node.Class);
          _columnResizeHandleNode.style.position =
            _kColumnResizeHandle_Node.Position;
          _api.setVisible(false);
        };

        /**
         * Resets everything which is initialized in init method.
         * @private
         */
        var _reset = function() {
          _columnResizeHandleNode = undefined;
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
