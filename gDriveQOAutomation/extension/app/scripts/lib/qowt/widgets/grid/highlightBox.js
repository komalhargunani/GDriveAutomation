/**
 * Highlight Box
 * =============
 *
 * The highlight box widget encapsulates the part of the HTML DOM that displays
 * a highlight box around a cell, or a range of cells, when a formula is being
 * edited.
 * The highlight box widget manages the construction and logic of the
 * highlight box.
 *
 * @author          Lorraine Martin (lorrainemartin@google.com)
 *
 * @constructor     Constructor for the Highlight Box widget
 * @param id {integer} The id for the highlight box
 * @param borderColor {string} The border color for the highlight 
 *                             box - e.g. "rgb(16, 150, 24)"
 * @return {object} A Highlight Box widget
 */
define([
  'qowtRoot/variants/configs/sheet'
  ], function(SheetConfig) {

  'use strict';

  var _factory = {

    create: function(id, borderColor) {

    // use module pattern for instance object
    var module = function() {

      var _kHighlight_Node_ClassName = "qowt-highlight-box",

      _kHighlight_Node = {
        Tag: 'div',
        Class: _kHighlight_Node_ClassName,
        Position: 'absolute'
      },

      _node;

      var _api = {

        /**
         * Positions the node of the highlight box according to the given rect
         *
         * @param {object} rect The rect
         * @method positionNode()
         */
        positionNode: function(rect) {
          var topPos = rect.topPos;
          _setTopPosition(topPos);

          var leftPos = rect.leftPos;
          _setLeftPosition(leftPos);

          var height = rect.height + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _setHeight(height);

          var width = rect.width + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _setWidth(width);
        },

        /**
         * Returns the highlight box node
         *
         * @method getNode()
         */
        getNode: function() {
          return _node;
        },

        /**
         * Every widget has an appendTo() method.
         * This is used to attach the HTML elements of the widget to a specified
         * node in the HTML DOM.
         * Here the highlight box div element is appended as a child to the
         * specified node.
         *
         * @param node {object} The HTML node that this widget is to attach
         * itself to
         * @method appendTo(node)
         */
        appendTo: function(node) {
          if(node === undefined) {
            throw ("appendTo - missing node parameter!");
          }

          if(_node !== undefined) {
            node.appendChild(_node);
          }
        },

        /**
         * Removes the highlight box node from the specified parent node.
         *
         * @param node {object} The HTML node that this widget is to remove
         * itself from
         * @method removeFrom(node)
         */
        removeFrom: function(node) {
          if(node === undefined) {
            throw ("removeFrom - missing node parameter!");
          }

          if(_node !== undefined) {
            node.removeChild(_node);
          }
        },

        /**
         * Shows the highlight box.
         */
        show: function() {
          _node.style.display = 'block';
        },

        /**
         * Hides the highlight box.
         */
        hide: function() {
          _node.style.display = 'none';
        },

        /**
         * Query if the highlight box is visible.
         *
         * @returns {Boolean} True if visible, else false.
         */
        isVisible: function() {
          return (_node.style.display !== 'none');
        }
      };

      var _init = function() {
        _createNode();
      };

      var _createNode = function() {
        _node = document.createElement(_kHighlight_Node.Tag);
        _node.id = id + _kHighlight_Node.Class;
        _node.classList.add(_kHighlight_Node.Class);
        _node.style.position = _kHighlight_Node.Position;

        if(borderColor) {
          _node.style.borderColor = borderColor;
        }
      };

      var _setTopPosition = function(pos) {
        if (pos !== undefined) {
          _node.style.top = pos + "px";
        }
      };

      var _setLeftPosition = function(pos) {
        if (pos !== undefined) {
          _node.style.left = pos + "px";
        }
      };

      var _setHeight = function(height) {
        if (height !== undefined) {
          _node.style.height = height + "px";
        }
      };

      var _setWidth = function(width) {
        if (width !== undefined) {
          _node.style.width = width + "px";
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
