/**
 * Floating Editor
 * ===============
 *
 * The floating editor widget encapsulates the part of the HTML DOM that
 * displays a floating editor box above a cell, in which the user can edit the
 * cell's contents inline.
 *
 * @author          Lorraine Martin (lorrainemartin@google.com)
 * @constructor     Constructor for the Floating Editor widget.
 * @return {object} A Floating Editor widget
 */
define([
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/utils/domListener',
  'qowtRoot/widgets/grid/textEditorBase',
  'qowtRoot/dcp/decorators/textDecorator',
  'qowtRoot/dcp/decorators/cellDecorator',
  'qowtRoot/dcp/decorators/alignmentDecorator'
  ],
  function(
    SheetConfig,
    DomListener,
    TextEditorBase,
    TextDecorator,
    CellDecorator,
    AlignmentDecorator) {

  'use strict';

  var _factory = {

    create: function() {

    // use module pattern for instance object
    var module = function() {

      var _kFloating_Editor_Node = {
        Tag: 'div',
        Class: "qowt-floating-editor",
        Position: 'absolute'
      },

      _floatingNode,
      _alignDecorator,
      _isActive = false,
      _kNoneColor = 'NONE',
      _kWhiteColor = 'white',
      _isNoneApplied = false;


      // Extend text editor base
      var _api = TextEditorBase.create();

        /**
         * Position the floating editor node according to the given rect
         *
         * @param {object} rect The rect
         * @method positionOver()
         */
        _api.positionOver = function(rect) {
          var topPos = rect.topPos - SheetConfig.kGRID_GRIDLINE_WIDTH;
          _setTopPosition(topPos);

          var leftPos = rect.leftPos - SheetConfig.kGRID_GRIDLINE_WIDTH;
          _setLeftPosition(leftPos);

          _setHeight(rect.height, rect.maxHeight);
          _setWidth(rect.width, rect.maxWidth);
        };

        /**
         * Set the visibility of the floating editor node
         *
         * @param {boolean} visible True if the node is
         *                  to be visible, false otherwise
         * @method setVisibility()
         */
        _api.setVisibility = function(visible) {
          if (visible) {
            _floatingNode.style.visibility = "visible";
          }
          else {
            _floatingNode.style.visibility = "hidden";
          }
        };

        /**
         * Checks whether the floating editor node is currently visible
         *
         * @return {boolean} True if the node is visible, false otherwise
         * @method isVisible()
         */
        _api.isVisible = function() {
          return _floatingNode.style.visibility === "visible";
        };

        /**
         * Sets the text formatting of the floating editor.
         * NOTE: This involves first 'undecorating' the current text formatting
         * of the floating editor, so that it will end up with the default text
         * formatting if no new text formatting is specified
         *
         * @param {object} formattingObj The text formatting to be displayed
         * @method resetTextFormatting(formattingObj)
         */
        _api.resetTextFormatting = function(formattingObj) {
          TextDecorator.undecorate(_floatingNode);
          CellDecorator.undecorate(_floatingNode);
          TextDecorator.decorate(_floatingNode, formattingObj);
          CellDecorator.decorate(_floatingNode, formattingObj);
        };

        /**
         * Resets the text alignment of the floating editor.
         * NOTE: This involves first 'undecorating' the current text alignment
         * settings of the floating editor, so that it will end up with the
         * default text alignment  settings if no new text alignment settings
         * are specified
         *
         * @param {string} horizontalAlignment The horizontal text alignment to
         * be displayed
         * @param {string} verticalAlignment The vertical text alignment to be
         * displayed
         * @method resetTextAlignment(horizontalAlignment, verticalAlignment)
         */
        _api.resetTextAlignment = function(horizontalAlignment,
                                            verticalAlignment) {
          _alignDecorator.undecorate();
          _alignDecorator.decorate(horizontalAlignment, verticalAlignment);
        };

        /**
         * Sets the boldness setting of the floating editor
         *
         * @param {boolean} boldness The boldness setting - e.g. true
         */
        _api.setBoldness = function(boldness) {
          TextDecorator.setBold(_floatingNode, boldness);
        };

        /**
         * Sets the italics setting of the floating editor
         *
         * @param {boolean} italics The italics setting - e.g. true
         */
        _api.setItalics = function(italics) {
          TextDecorator.setItalics(_floatingNode, italics);
        };

        /**
         * Sets the underline setting of the floating editor
         *
         * @param {boolean} underline The underline setting - e.g. true
         */
        _api.setUnderline = function(underline) {
          TextDecorator.setUnderline(_floatingNode, underline);
        };

        /**
         * Sets the strikethrough setting of the floating editor
         *
         * @param {Boolean} isStrikethrough - The strikethrough setting.
         */
        _api.setStrikethrough = function(isStrikethrough) {
          TextDecorator.setStrikethrough(_floatingNode, isStrikethrough);
        };

        /**
         * Sets the font face of the floating editor
         *
         * @param {string} fontFace The font face setting - e.g. "Arial"
         */
        _api.setFontFace = function(fontFace) {
          TextDecorator.setFontFace(_floatingNode, fontFace);
        };

        /**
         * Sets the font size of the floating editor
         *
         * @param {string} fontSize The font size - e.g. "24"
         */
        _api.setFontSize = function(fontSize) {
          TextDecorator.setFontSize(_floatingNode, fontSize);
        };

        /**
         * Sets the text color of the floating editor
         *
         * @param {string} textColor The text color - e.g. "blue"
         */
        _api.setTextColor = function(textColor) {
          TextDecorator.setFontColor(_floatingNode, textColor);
        };

        /**
         * Sets the background color of the floating editor
         *
         * @param {string} backgroundColor The background color - e.g. "green"
         */
        _api.setBackgroundColor = function(backgroundColor) {
          _isNoneApplied = false;
          if (backgroundColor === _kNoneColor) {
            backgroundColor = _kWhiteColor;
            _isNoneApplied = true;
          }
          TextDecorator.setFontHighlight(_floatingNode, backgroundColor);
        };

        /**
         * Sets the vertical alignment position of the floating editor
         *
         * @param {string} alignmentPos The vertical alignment position -
         * e.g. "t"
         */
        _api.setVerticalAlignment = function(alignmentPos) {
          _alignDecorator.setVerticalAlignment(alignmentPos);
        };

        /**
         * Sets the horizontal alignment position of the floating editor
         *
         * @param {string} alignmentPos The horizontal alignment position -
         * e.g. "r"
         */
        _api.setHorizontalAlignment = function(alignmentPos) {
          _alignDecorator.setHorizontalAlignment(alignmentPos);
        };

        /**
         * Sets the wrap text setting of the floating editor
         *
         * @param {boolean} wrapText The wrap text setting - e.g. true
         */
        _api.setWrapText = function(wrapText) {
          CellDecorator.setWrapText(_floatingNode, wrapText);
        };

        /**
         * Checks whether the floating editor has bold on
         *
         * @return {boolean} True if the floating editor has bold on,
         *                   otherwise false
         * @method hasBold()
         */
        _api.hasBold = function() {
          return TextDecorator.hasFontWeight(_floatingNode);
        };

        /**
         * Checks whether the floating editor has italics on
         *
         * @return {boolean} True if the floating editor has italics on,
         *                   otherwise false
         * @method hasItalics()
         */
        _api.hasItalic = function() {
          return TextDecorator.hasItalic(_floatingNode);
        };

        /**
         * Checks whether the floating editor has underline on
         *
         * @return {boolean} True if the floating editor has underline on,
         *                   otherwise false
         * @method hasUnderline()
         */
        _api.hasUnderline = function() {
          return TextDecorator.hasUnderline(_floatingNode);
        };

        /**
         * @return {Boolean} True if the floating editor has strikethrough set,
         *                   false otherwise
         */
        _api.hasStrikethrough = function() {
          return TextDecorator.hasStrikethrough(_floatingNode);
        };

        /**
         * Checks whether the floating editor has wrapText on
         *
         * @return {boolean} True if the floating editor has wrapText on,
         *                   otherwise false
         * @method hasWrapText()
         */
        _api.hasWrapText = function() {
          return CellDecorator.hasWrapText(_floatingNode);
        };

      /**
         * Gets the font face of the floating editor
         *
         * @return {string} The font face - e.g. "Arial"
         * @method getFontFace()
         */
        _api.getFontFace = function() {
          return TextDecorator.getFontFace(_floatingNode);
        };

        /**
         * Gets the font size of the floating editor, in points
         *
         * @return {integer} The font size in points - e.g. 24
         * @method getFontSizePoints()
         */
        _api.getFontSizePoints = function() {
          return TextDecorator.getFontSizePoints(_floatingNode);
        };

        /**
         * Gets the text color of the floating editor
         *
         * @return {string} The text color - e.g. "blue"
         * @method getTextColor()
         */
        _api.getTextColor = function() {
          return TextDecorator.getFontColor(_floatingNode);
        };

        /**
         * Gets the background color of the floating editor
         *
         * @return {string} The background color - e.g. "green"
         * @method getBackgroundColor()
         */
        _api.getBackgroundColor = function() {
          var backgroundColor = _isNoneApplied ? _kNoneColor :
              TextDecorator.getFontHighlight(_floatingNode);
          return backgroundColor;
        };

        /**
         * Gets the horizontal alignment position of the floating editor
         *
         * @return {string} The horizontal alignment position - e.g. "r"
         * @method getHorizontalAlignment()
         */
        _api.getHorizontalAlignment = function() {
          return _alignDecorator.getHorizontalAlignment();
        };

        /**
         * Gets the vertical alignment position of the floating editor
         *
         * @return {string} The vertical alignment position - e.g. "t"
         * @method getVerticalAlignment()
         */
        _api.getVerticalAlignment = function() {
          return _alignDecorator.getVerticalAlignment();
        };

        /**
         * Returns whether or not this text widget is inline or not.
         * In the case of the floating editor, returns true.
         * NOTE: This method overrides the implementation in TextEditorBase
         *
         * @return {boolean} True
         * @method isInline()
         */
        _api.isInline = function() {
          return true;
        };

        /**
         * Every widget has an appendTo() method.
         * This is used to attach the HTML elements of the widget to a specified
         * node in the HTML DOM.
         * Here the floating editor div element is appended as a child to the
         * specified node.
         *
         * @param node {object} The HTML node that this widget is to attach
         * itself to
         * @method appendTo(node)
         */
        _api.appendTo = function(node) {
          if (node === undefined) {
            throw ("FloatingEditor:appendTo() - missing node parameter!");
          }
          node.appendChild(_floatingNode);
        };

        /**
         * Gets the top position of the floating editor.
         *
         * @return {integer} The top position of the floating editor.
         */
        _api.getTopPosition = function() {
          return _floatingNode.style.top;
        };

        /**
         * Gets the left position of the floating editor.
         *
         * @return {integer} The left position of the floating editor.
         */
        _api.getLeftPosition = function() {
          return _floatingNode.style.left;
        };

        /**
         * Gets the height of the floating editor.
         *
         * @return {integer} The height of the floating editor.
         */
        _api.getHeight = function() {
          return _floatingNode.style.minHeight;
        };

        /**
         * Gets the width of the floating editor.
         *
         * @return {integer} The width of the floating editor.
         */
        _api.getWidth = function() {
          return _floatingNode.style.minWidth;
        };

        /**
          * Gets the content node of the floating editor.
          *
          * @return {object} The content node of the floating editor.
          */
        _api.getFloatingNode = function() {
          return _floatingNode;
        };

        /**
         * @api private
         */
        var _init = function() {
          _floatingNode = document.createElement(_kFloating_Editor_Node.Tag);
          _floatingNode.id = _kFloating_Editor_Node.Class;
          _floatingNode.classList.add(_kFloating_Editor_Node.Class);
          _floatingNode.style.position = _kFloating_Editor_Node.Position;
          _floatingNode.style.visibility = "hidden";

          _floatingNode.contentEditable = true;
          _floatingNode.spellcheck = false;

          _setTopPosition(0);
          _setLeftPosition(0);
          _setHeight(0);
          _setWidth(0);

          // store the base text editor node
          _api.setNode(_floatingNode);

          _addListeners();

          _alignDecorator = AlignmentDecorator.create(_floatingNode);
        };

        var _addListeners = function() {
          // LM TODO: Listeners are removed on app destruct?
          DomListener.addListener(_floatingNode, 'blur', _onBlur);
          DomListener.addListener(_floatingNode, 'focus', _onFocus);
        };

        var _setTopPosition = function(pos) {
          if (pos !== undefined) {
            _floatingNode.style.top = pos + "px";
          }
        };

        var _setLeftPosition = function(pos) {
          if (pos !== undefined) {
            _floatingNode.style.left = pos + "px";
          }
        };

        var _setHeight = function(height, maxHeight) {
          if (height !== undefined && maxHeight !== undefined) {
            _floatingNode.style.minHeight = Math.min(height, maxHeight) + "px";
          } else if (height !== undefined) {
            _floatingNode.style.minHeight = height + "px";
          }
          if (maxHeight !== undefined) {
            _floatingNode.style.maxHeight = maxHeight + "px";
          }
        };

        var _setWidth = function(width, maxWidth) {
          if (width !== undefined && maxWidth !== undefined) {
            _floatingNode.style.minWidth = Math.min(width, maxWidth) + "px";
          } else if (width !== undefined) {
            _floatingNode.style.minWidth = width + "px";
          }
          if (maxWidth !== undefined) {
            _floatingNode.style.maxWidth = maxWidth + "px";
          }
        };

        var _onBlur = function(event) {
          // only process the blur event if it has occured because something
          // else has gained focus *within* the QO app (in which case the
          // document's activeElement will have changed); ignore it if the
          // focus has gone to something *outwith* the QO app (in which case
          // the document's activeElement will remain the same) - e.g. another
          // browser window
          if (document.activeElement !== _floatingNode) {
            _isActive = false;
            _api.onBlurBase(event);
          }
        };

        var _onFocus = function(event) {
          // only process the focus event if the floating
          // editor node wasn't already the active element
          if (!_isActive) {
            _isActive = true;
            _api.onFocusBase(event);
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
