/**
 * Selection Box
 * =============
 *
 * The selection box widget encapsulates the part of the HTML DOM that displays
 * a selection box around a cell, or a range of cells.
 * The selection box widget manages the construction and logic of the selection
 * box.
 *
 */
define([
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/utils/i18n'
  ],
  function(
    SheetConfig,
    I18n) {

  'use strict';

  var _factory = {

    create: function() {

    // use module pattern for instance object
    var module = function() {

      var _kAnchor_Node_Normal_ClassName = "qowt-selection-anchor-node-normal",
      _kRange_Node_ClassName = "qowt-selection-range-node",

      _kAnchor_Node = {
        Tag: 'div',
        Class: _kAnchor_Node_Normal_ClassName,
        Position: 'absolute'
      },

      _kRange_Node = {
        Tag: 'div',
        Class: _kRange_Node_ClassName
      },

      _kOffPane_Top_Pos = -5,
      _kOffPane_Left_Pos = -5,

      _anchorNode,_hyperlinkDialogElement,
      _rangeNode,

      _anchorTopPos, _anchorLeftPos, _anchorHeight, _anchorWidth,
      _rangeTopPos, _rangeLeftPos, _rangeHeight, _rangeWidth;

      var _api = {

        /**
         * Gets the top position of the selection box
         *
         * @return {integer} The top position of the selection box
         * @method getTopPosition()
         */
        getTopPosition: function() {
          return (_rangeNode.style.visibility === "visible") ?
              _rangeTopPos: _anchorTopPos;
        },

        /**
         * Gets the left position of the selection box
         *
         * @return {integer} The left position of the selection box
         * @method getLeftPosition()
         */
        getLeftPosition: function() {
          return (_rangeNode.style.visibility === "visible") ?
              _rangeLeftPos: _anchorLeftPos;
        },

        /**
         * Gets the height of the selection box
         *
         * @return {integer} The height of the selection box
         * @method getHeight()
         */
        getHeight: function() {
          return (_rangeNode.style.visibility === "visible") ?
              _rangeHeight: _anchorHeight;
        },

        /**
         * Gets the width of the selection box
         *
         * @return {integer} The width of the selection box
         * @method getWidth()
         */
        getWidth: function() {
          return (_rangeNode.style.visibility === "visible") ?
              _rangeWidth: _anchorWidth;
        },

        /**
         * Position the anchor node of the selection box according to the given
         * rect
         *
         * @param {object} rect The rect
         * @method positionAnchorNode()
         */
        positionAnchorNode: function(rect) {
          var topPos = rect.topPos;
          _api.setAnchorNodeTopPosition(topPos);

          var leftPos = rect.leftPos;
          _api.setAnchorNodeLeftPosition(leftPos);

          var height = rect.height + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _api.setAnchorNodeHeight(height);

          var width = rect.width + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _api.setAnchorNodeWidth(width);
        },

        /**
         * Position the range node of the selection box according to the
         * given rect
         *
         * @param {object} rect The rect
         * @method positionRangeNode()
         */
        positionRangeNode: function(rect) {
          var topPos = rect.topPos;
          _api.setRangeNodeTopPosition(topPos);

          var leftPos = rect.leftPos;
          _api.setRangeNodeLeftPosition(leftPos);

          var height = rect.height + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _api.setRangeNodeHeight(height);

          var width = rect.width + SheetConfig.kGRID_GRIDLINE_WIDTH;
          _api.setRangeNodeWidth(width);
        },

        /**
         * Set the visibility of the anchor node
         *
         * @param {boolean} visible True if the anchor node is
         *                  to be visible, false otherwise
         * @method setAnchorNodeVisibility()
         */
        setAnchorNodeVisibility: function(visible) {
          if (visible) {
            _anchorNode.style.visibility = "visible";
          }
          else {
            _anchorNode.style.visibility = "hidden";
          }
        },

        /**
         * Set the visibility of the range node
         *
         * @param {boolean} visible True if the range node is
         *                  to be visible, false otherwise
         * @method setRangeNodeVisibility()
         */
        setRangeNodeVisibility: function(visible) {
          if (visible) {
            _rangeNode.style.visibility = "visible";
          }
          else {
            _rangeNode.style.visibility = "hidden";
          }
        },

        /**
         * Sets the anchor node's top position to the specified value
         *
         * @param pos {integer} The top position
         * @method setAnchorNodeTopPosition(pos)
         */
        setAnchorNodeTopPosition: function(pos) {
          if (pos !== undefined) {
            _anchorNode.style.top = pos + "px";
            _anchorTopPos = pos;
          }
        },

        /**
         * Sets the anchor node's left position to the specified value
         *
         * @param pos {integer} The left position
         * @method setAnchorNodeLeftPosition(pos)
         */
        setAnchorNodeLeftPosition: function(pos) {
          if (pos !== undefined) {
            _anchorNode.style.left = pos + "px";
            _anchorLeftPos = pos;
          }
        },

        /**
         * Sets the anchor node's height to the specified value
         *
         * @param height {integer} The height
         * @method setAnchorNodeHeight(height)
         */
        setAnchorNodeHeight: function(height) {
          if (height !== undefined) {
            _anchorNode.style.height = height + "px";
            _anchorHeight = height;
          }
        },

        /**
         * Sets the anchor node's width to the specified value
         *
         * @param width {integer} The width
         * @method setAnchorNodeWidth(width)
         */
        setAnchorNodeWidth: function(width) {
          if (width !== undefined) {
            _anchorNode.style.width = width + "px";
            _anchorWidth = width;
          }
        },

        /**
         * Sets the range node's top position to the specified value
         *
         * @param pos {integer} The top position
         * @method setRangeNodeTopPosition(pos)
         */
        setRangeNodeTopPosition: function(pos) {
          if (pos !== undefined) {
            _rangeNode.style.top = pos + "px";
            _rangeTopPos = pos;
          }
        },

        /**
         * Sets the range node's left position to the specified value
         *
         * @param pos {integer} The left position
         * @method setAnchorNodeLeftPosition(pos)
         */
        setRangeNodeLeftPosition: function(pos) {
          if (pos !== undefined) {
            _rangeNode.style.left = pos + "px";
            _rangeLeftPos = pos;
          }
        },

        /**
         * Sets the range node's height to the specified value
         *
         * @param height {integer} The height
         * @method setRangeNodeHeight(height)
         */
        setRangeNodeHeight: function(height) {
          if (height !== undefined) {
            _rangeNode.style.height = height + "px";
            _rangeHeight = height;
          }
        },

        /**
         * Sets the range node's width to the specified value
         *
         * @param width {integer} The width
         * @method setRangeNodeWidth(width)
         */
        setRangeNodeWidth: function(width) {
          if (width !== undefined) {
            _rangeNode.style.width = width + "px";
            _rangeWidth = width;
          }
        },

        /**
         * Every widget has an appendTo() method.
         * This is used to attach the HTML elements of the widget to a specified
         * node in the HTML DOM.
         * Here the selection box div element is appended as a child to the
         * specified node.
         *
         * @param node {object} The HTML node that this widget is to attach
         *                      itself to
         * @method appendTo(node)
         */
        appendTo: function(node) {
          if (node === undefined) {
            throw ("appendTo - missing node parameter!");
          }

          if (_anchorNode !== undefined) {
            node.appendChild(_anchorNode);
          }

          if (_rangeNode !== undefined) {
            node.appendChild(_rangeNode);
          }
        },

        /**
         * Shows hyperlink dialog.
         * In case of showing the hyperlink dialog, it will set the position of
         * hyperlink dialog as per the selectionBox/anchor height. So, that
         * hyperlink dialog should appear exactly beneath the selection box.
         *
         * @param linkType {string}- type of link that is internal or external
         * @param target {string} - hyperlink address
         */
        showHyperlinkDialog: function(linkType, target) {
          var hyperlinkTop = _anchorHeight - SheetConfig.kGRID_GRIDLINE_WIDTH;
          _hyperlinkDialogElement.setPosition(hyperlinkTop);
          var messageToActivateLink =
              I18n.getMessage('qowt_hyperlink_activate_short_key');
          _hyperlinkDialogElement.show(linkType, target, messageToActivateLink);
        },

        hideHyperlinkDialog: function(){
          _hyperlinkDialogElement.hide();
        },

        /**
         * @returns {boolean} - true if hyperlink dialog is showing,
         *                      false if hyperlink dialog is hidden.
         */
        isShowingHyperlinkDialog: function() {
          return _hyperlinkDialogElement.isShowing();
        },

        /**
         * Resets the selection box
         *
         * @method reset()
         */
        reset: function() {
          _reset();
        }
      };

      var _init = function() {
        _createAnchorNode();
        _createRangeNode();
      };

      var _createAnchorNode = function() {
        _anchorNode = document.createElement(_kAnchor_Node.Tag);
        _anchorNode.id = _kAnchor_Node.Class;
        _anchorNode.classList.add(_kAnchor_Node.Class);
        _anchorNode.style.position = _kAnchor_Node.Position;
        _hyperlinkDialogElement = new QowtHyperlinkDialog();
        _anchorNode.appendChild(_hyperlinkDialogElement);

        // position the node 'off pane' so that it's borders don't show
        _api.setAnchorNodeTopPosition(_kOffPane_Top_Pos);
        _api.setAnchorNodeLeftPosition(_kOffPane_Left_Pos);
        _api.setAnchorNodeHeight(0);
        _api.setAnchorNodeWidth(0);
      };

      var _createRangeNode = function() {
        _rangeNode = document.createElement(_kRange_Node.Tag);
        _rangeNode.id = _kRange_Node.Class;
        _rangeNode.classList.add(_kRange_Node.Class);

        // position the node 'off pane' so that it's borders don't show
        _api.setRangeNodeTopPosition(_kOffPane_Top_Pos);
        _api.setRangeNodeLeftPosition(_kOffPane_Left_Pos);
        _api.setRangeNodeHeight(0);
        _api.setRangeNodeWidth(0);
      };

      var _reset = function() {
        _anchorNode = undefined;
        _rangeNode = undefined;

        _anchorTopPos = undefined;
        _anchorLeftPos = undefined;
        _anchorHeight = undefined;
        _anchorWidth = undefined;
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
