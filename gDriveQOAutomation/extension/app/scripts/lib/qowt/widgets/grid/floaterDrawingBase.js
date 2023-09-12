/**
 * SheetFloaterDrawing
 * ===================
 *
 * A sheet floater drawing widget is used as the base of a drawing floater
 * widget - e.g. image or a chart.
 * This module defines the set of common methods that drawing type of floater
 * widget must provide an implementation of.
 *
 *
 * @author yuvraj.patel@synerzip.com (Yuvraj Patel)
 * @constructor Constructor for the Sheet Floater drawing widget
 * @param {string} floaterType - Mandatory parameter indicating the type of the
 * floater being created
 * @return {object} A Sheet Floater Drawing Base widget.
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/models/sheet',
  'qowtRoot/utils/search',
  'qowtRoot/widgets/grid/floaterBase'
], function(
    Utils,
    SheetModel,
    SearchUtils,
    SheetFloaterBase) {

  'use strict';


  var _factory = {

    create: function(floaterType) {

      // use module pattern for instance object
      var module = function() {

        var _x,
            _y,
            _rowSpan,
            _colSpan,
            _top,
            _left,
            _width,
            _height,
            _fromColOffset,
            _fromRowOffset,
            _toColOffset,
            _toRowOffset,
            _anchorType,
            _kRadix = 10;

        if ((floaterType === undefined) ||
            (typeof(floaterType) !== 'string')) {
          throw new Error('SheetFloaterBase - Constructor has missing ' +
              'or invalid parameter [floaterType]');
        }

        /*
         *
         */
        var _api = SheetFloaterBase.create(floaterType);

        /**
         * Gets the Image container's anchorColIndex-index
         *
         * @return {integer} The anchorColIndex-index
         */
        _api.x = function() {
          return _x;
        };

        /**
         * Gets the Image container's anchorRowIndex-index
         *
         * @return {integer} The anchorRowIndex-index
         */
        _api.y = function() {
          return _y;
        };

        /**
         * Sets the widget container's x-index
         * Note: needs layout before this takes effect
         *
         * @param {integer} newIndex The x-index
         */
        _api.setX = function(newIndex) {
          _x = newIndex;
        };

        /**
         * Sets the widget container's y-index
         * Note: needs layout before this takes effect
         *
         * @param {integer} newIndex The y-index
         */
        _api.setY = function(newIndex) {
          _y = newIndex;
        };


        /**
         * Gets the number of rows which the Image spans
         *
         * @return {integer} The row span
         */
        _api.rowSpan = function() {
          return _rowSpan;
        };

        /**
         * Sets the number of rows which the widget spans
         * Note: needs layout before this takes effect
         *
         * @param {integer} newSpan The row span
         */
        _api.setRowSpan = function(newSpan) {
          _rowSpan = newSpan;
        };

        /**
         * Gets the number of colunns which the Image spans
         *
         * @return {integer} The column span
         */
        _api.colSpan = function() {
          return _colSpan;
        };

        /**
         * Sets the number of cols which the widget spans
         * Note: needs layout before this takes effect
         *
         * @param {integer} newSpan The col span
         */
        _api.setColSpan = function(newSpan) {
          _colSpan = newSpan;
        };

        /**
         * Gets the rectangle for this drawing floater
         *
         * @return {object} rectangle for this Image
         */
        _api.getRect = function() {
          return {
            left : _left,
            top : _top,
            width : _width,
            height : _height
          };
        };

        /**
         * Gets the Drawing floater container's width.
         *
         * @return {integer} The width
         */
        _api.width = function() {
          return _width;
        };

        /**
         * Set the Width of Drawing floater containers
         * @param {integer} width
         */
        _api.setWidth = function(width) {
          _width = width;
        };

        /**
         * Gets the Drawing floater container's height.
         *
         * @return {integer} The height
         */
        _api.height = function() {
          return _height;
        };

        /**
         * Set the Height of Drawing floater containers
         * @param {integer} height
         */
        _api.setHeight = function(height) {
          _height = height;
        };

        /**
         * Gets the Drawing floater top position.
         *
         * @return {integer} The top position
         */
        _api.top = function() {
          return _top;
        };

        /**
         * Set the top position of Drawing floater containers
         * @param {integer} top
         */
        _api.setTop = function(top) {
          _top = top;
        };

        /**
         * Gets the Drawing floater left position.
         *
         * @return {integer} The left position
         */
        _api.left = function() {
          return _left;
        };

        /**
         * Set the left postion of Drawing floater containers
         * @param {integer} left
         */
        _api.setLeft = function(left) {
          _left = left;
        };


        /**
         * Gets the Image container's anchor type.
         *
         * @return {String} anchorType
         */
        _api.getAnchorType = function() {
          return _anchorType;
        };

        /**
         * Set the anchorType
         *
         * @param {String} anchorType
         */
        _api.setAnchorType = function(anchorType) {
          _anchorType = anchorType;
        };

        /**
         * Get the fromRowOffset
         *
         * @return {integer} fromRowOffset
         */
        _api.getFromRowOffset = function() {
          return _fromRowOffset;
        };

        /**
         * Set the fromRowOffset
         *
         * @param {integer} fromRowOffset
         */
        _api.setFromRowOffset = function(fromRowOffset) {
          _fromRowOffset = fromRowOffset;
        };

        /**
         * Get the fromColOffset
         *
         * @return {integer} fromColOffset
         */
        _api.getFromColOffset = function() {
          return _fromColOffset;
        };

        /**
         * Set the fromColOffset
         *
         * @param {integer} fromColOffset
         */
        _api.setFromColOffset = function(fromColOffset) {
          _fromColOffset = fromColOffset;
        };

        /**
         * Get the toRowOffset
         *
         * @return {integer} toRowOffset
         */
        _api.getToRowOffset = function() {
          return _toRowOffset;
        };

        /**
         * Set the toRowOffset
         *
         * @param {integer} toRowOffset
         */
        _api.setToRowOffset = function(toRowOffset) {
          _toRowOffset = toRowOffset;
        };

        /**
         * Get the toColOffset
         *
         * @return {integer} toColOffset
         */
        _api.getToColOffset = function() {
          return _toColOffset;
        };

        /**
         * Set the toColOffset
         *
         * @param {integer} toColOffset
         */
        _api.setToColOffset = function(toColOffset) {
          _toColOffset = toColOffset;
        };

        /**
         * Gets the row and column anchorColIndex and anchorRowIndex
         * offsets for this Image
         *
         * @return {object} row and column anchorColIndex and
         * anchorRowIndex offsets for this Image
         */
        _api.getOffsets = function() {
          return {
            topLeftXOffset: _left,
            topLeftYOffset: _top,
            bottomRightXOffset: _width,
            bottomRightYOffset: _height
          };
        };

        /**
         * Sets the drawing objects position(top left Y & X), height and width
         * in pixel.
         *
         * NOTE: This function should be called only by the floater drawing
         * object(s). Any code outside the floater drawing object(s) should call
         * updatePositionAndDimensions().
         */
        _api._setRectPosAndDimensions = function(/*topPos, leftPos, height,
                                                 width*/) {
          throw (new Error('SheetFloaterDrawingBase - undefined ' +
            '_setRectPosAndDimensions() method called!'));
        };

        /**
         * Updates the drawing object's position, height, width and row, column
         * spans.
         *
         * @param {integer} topPos - Top Left Y of the drawing object in pixel.
         * @param {integer} leftPos - Top Left X of the drawing object in pixel.
         * @param {integer} height - Height of the drawing object in pixel.
         * @param {integer} width - Width of the drawing object in pixel.
         * @override
         */
        _api.updatePositionAndDimensions = function(topPos, leftPos, height,
                                                    width) {
          _api._setRectPosAndDimensions(topPos, leftPos, height, width);
          _updateRowColumnSpans();
        };

        _api.populateAnchorData = function(anchor) {
          _anchorType = anchor.type;

          if (anchor) {
            if (anchor.frm && anchor.to) {
              _rowSpan = anchor.to.ri - anchor.frm.ri + 1;
              _colSpan = anchor.to.ci - anchor.frm.ci + 1;
            }
            if (anchor.frm) {
              _x = parseInt(anchor.frm.ci, _kRadix);
              _y = parseInt(anchor.frm.ri, _kRadix);
              _fromColOffset = Utils.convertEmuToPixel(anchor.frm.xo);
              _fromRowOffset = Utils.convertEmuToPixel(anchor.frm.yo);
            }
            if (anchor.to) {
              _toColOffset = Utils.convertEmuToPixel(anchor.to.xo);
              _toRowOffset = Utils.convertEmuToPixel(anchor.to.yo);
            }

            if (anchor.pos) {
              _top = Utils.convertEmuToPixel(anchor.pos.y);
              _left = Utils.convertEmuToPixel(anchor.pos.x);
            }
            if (anchor.ext) {
              _width = Utils.convertEmuToPixel(anchor.ext.cx);
              _height = Utils.convertEmuToPixel(anchor.ext.cy);
            }

          }
        };

        _api.cloneAnchorData = function(cellToClone) {
          _x = cellToClone.x();
          _y = cellToClone.y();
          _toColOffset = cellToClone.getToColOffset();
          _toRowOffset = cellToClone.getToRowOffset();
          _fromColOffset = cellToClone.getFromColOffset();
          _fromRowOffset = cellToClone.getFromRowOffset();
          _rowSpan = cellToClone.rowSpan();
          _colSpan = cellToClone.colSpan();
          _width = cellToClone.width();
          _height = cellToClone.height();
          _top = cellToClone.top();
          _left = cellToClone.left();
          _anchorType = cellToClone.getAnchorType();
        };

        /**
         * Updates the row and column span for the floater drawing object, only
         * if anchor is one cell or absolute. This information is needed during
         * freezing panes for cloning data.
         */
        var _updateRowColumnSpans = function() {
          if (_anchorType === 'one' || _anchorType === 'abs') {
            if (_anchorType === 'abs') {
              //calculate row, col index as they are not explicitly available
              _updateAnchorRowIndex();
              _updateAnchorColIndex();
            }
            _updateRowSpan();
            _updateColSpan();
          }
        };

        /**
         * Updates the rowSpan for the floater drawing object.
         */
        var _updateRowSpan = function() {
          var toRowIdx, bottomLeftY;
          bottomLeftY = _top + _height;
          toRowIdx = SearchUtils.array.binSearch(SheetModel.RowPos,
              bottomLeftY, 'low');
          //_y is the from row index
          _rowSpan = toRowIdx - _y + 1;
        };

        /**
         * Updates the colSpan for the floater drawing object.
         */
        var _updateColSpan = function() {
          var toColIdx, topRightX;
          topRightX = _left + _width;
          toColIdx = SearchUtils.array.binSearch(SheetModel.ColPos,
              topRightX, 'low');
          //_x is the from column index
          _colSpan = toColIdx - _x + 1;
        };

        /**
         * Updates the column index for the floater drawing object. This
         * method will be called only for absolute anchors, since column
         * index is not explicitly available.
         */
        var _updateAnchorColIndex = function() {
          _x = SearchUtils.array.binSearch(SheetModel.ColPos, _left, 'low');
        };

        /**
         * Updates the row index for the floater drawing object. This
         * method will be called only for absolute anchors, since row
         * index is not explicitly available
         */
        var _updateAnchorRowIndex = function() {
          _y = SearchUtils.array.binSearch(SheetModel.RowPos, _top, 'low');
        };

        /**
         * private
         */
        var _init = function() {};

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