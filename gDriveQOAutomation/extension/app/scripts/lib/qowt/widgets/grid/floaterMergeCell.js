/**
 * SheetFloaterMergeCell
 * =====================
 *
 * A SheetFloaterMergeCell widget encapsulates the part of the HTML DOM
 * representing a workbook that displays a merged cell in the grid's 'content'
 * node.
 *
 * A merge cell is a single cell which spans over a number of normal cells and
 * displays the text and formatting of its anchor which is underneath it.  It
 * DOES NOT burst however, (unlike regular cells), and although its text may
 * wrap it is always clipped to the bounding rectangle of the merged cell.
 *
 * The SheetFloaterMergeCell widget manages the construction and logic of the
 * merged cell.
 * The merge cell widget is designed to sit within the existing div structure of
 * underlying rows, columns and cells of the grid.  It generally sits visibly
 * atop of the normal cells which it is merged over.
 *
 * A SheetFloaterMergeCell can have background formatting and text.
 * These are represented by two divs which are always present for a merged cell.
 *
 * - A 'background' div is used to display the background formatting properties
 * of the cell (eg. blue)
 *   If the merge cell has no background formatting, then this div is still
 *   created as it serves to blank
 *   out the inner gridlines of the merged cells.
 *
 * - A 'cell content' div which is used to display the text content of the cell.
 *   for example the text "£14.28".
 *   If the cell doesn't have any content then this div will not be created.
 *
 * Thus between 1 and 2 div elements are used to construct a merge cell,
 * depending on what the cell contains.
 *
 * ###IMPORTANT NOTE
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayoutsfrom occuring during the opening of a workbook or switching of
 * a sheet.
 * If a widget requires to perform operations that will result in a relayout of
 * the render tree then these operations should be captured in a 'layoutBlah()'
 * public API, so that the workbook layout control can dictate when this method
 * is called, method in the widget's at an appropriate moment to take the 'hit'
 *  of render tree relayout costs.
 *
 * @constructor
 * @param x {integer} Mandatory parameter indicating the x-index of the cell
 * @param y {integer} Mandatory parameter indicating the y-index of the cell
 * @param config {object} Mandatory parameter that contains the layout info of
 * the cell
 *
 * The config object has the following properties:
 *
 * - cellTopPos {integer}             The top position of the cell
 * - cellHeight {integer}             The height of the cell
 * - cellLeftPos {integer}            The left position of the cell
 * - cellWidth {integer}              The width of the cell
 * - cellText {string}                The text in the cell, if it has any
 * - editableText {string}            The editable text in the cell,
 *  if it has any
 * - backgroundColor {string}        The cell background color, as a value
 *  between '#000000'-'#FFFFFF'
 * - horizontalAlign {string}         The horizontal alignment of the cell
 * - verticalAlign {string}           The vertical alignment of the cell
 * - formatting {object}              The formatting information for the cell.
 *  Note that the service currently returns merged formatting data for cells
 *  with content. So formatting may come from the cell, row, column or default
 *  information. Hence there is no need to do anything additional here.
 *
 * - rowSpan {integer}                The number of rows which this merge cell
 *  spans over
 * - colSpan {integer}                The number of columns which this merge
 *  cell spans over
 *
 * @param cellToClone {object}        Optional parameter which is an existing
 * merge cell widget that the new merge cell widget is to be cloned from
 * @return {object}                   A Merge Cell widget.
 */
define([
    'qowtRoot/dcp/decorators/backgroundDecorator',
    'qowtRoot/dcp/decorators/textDecorator',
    'qowtRoot/dcp/decorators/cellDecorator',
    'qowtRoot/dcp/decorators/alignmentDecorator',
    'qowtRoot/dcp/decorators/textRotationDecorator',
    'qowtRoot/variants/configs/sheet',
    'qowtRoot/widgets/grid/floaterBase',
    'qowtRoot/models/sheet'
  ], function(
    BackgroundDecorator,
    TextDecorator,
    CellDecorator,
    AlignmentDecorator,
    TextRotationDecorator,
    SheetConfig,
    SheetFloaterBase,
    SheetModel) {

  'use strict';



  var _factory = {

    create: function(x, y, config, cellToClone) {

      // use module pattern for instance object
      var module = function() {

          /*!
           *Private constants
           */

          var kFloater_Type = "sheetFloaterMergeCell";

          var kFloaterBackground_Node = {
            Tag: 'div',
            Class: 'qowt-sheet-merge-cell-floater-background',
            Position: 'absolute'
          };
          var kFloaterText_Node = {
            Tag: 'div',
            Class: 'qowt-sheet-merge-cell-floater-text',
            Position: 'absolute'
          };

          /*!
           * Private data
           */
          var _cellFloaterBackgroundNode,
            _cellFloaterTextNode,
            _x = x,
            _y = y,
            _hAlignment,
            _vAlignment,
            _backgroundColor,
            _rect,
            _cellText,
            _editableText,
            _rowSpan = config.rowSpan,
            _colSpan = config.colSpan,
            _transparentAdornment = 0,
            _rotationAngle;

          /*!
           *
           */
          // extend base floater module
          var _api = SheetFloaterBase.create(kFloater_Type);

          /**
           * Gets the merge cell's x-index
           *
           *
           * @return {integer} The x-index
           * @method x()
           */
          _api.x = function() {
            return _x;
          };

          /**
           * Gets the merge cell's y-index
           *
           * @return {integer} The y-index
           * @method y()
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
           * Gets the merge cell background node
           *
           * @return {object} The merge cell background node
           * @method getBackgroundNode()
           */
          _api.getBackgroundNode = function() {
            return _cellFloaterBackgroundNode;
          };

          /**
           * Gets the merge cell text node
           *
           * @return {object} The merge cell text node
           * @method getTextNode()
           */
          _api.getTextNode = function() {
            return _cellFloaterTextNode;
          };

          /**
           * Gets the inner span of the merge cell text node.
           * @returns {object} The merge cell inner text node.
           */
          _api.getInnerTextNode = function() {
            if (_cellFloaterTextNode) {
              return _cellFloaterTextNode.childNodes[0];
            }
          };
          /**
           * Gets the number of rows which the merge cell spans
           *
           * @return {integer} The row span
           * @method rowSpan()
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
           * Gets the number of colunns which the merge cell spans
           *
           * @return {integer} The column span
           * @method colSpan()
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
           * Gets the horizontal alignment for this merge cell
           *
           * @return {string} horizontal alignment
           * @method getHorizontalAlignment()
           */
          _api.getHorizontalAlignment = function() {
            return _hAlignment;
          };

          /**
           * Gets the vertical alignment for this merge cell
           *
           * @return {string} vertical alignment
           * @method getVerticalAlignment()
           */
          _api.getVerticalAlignment = function() {
            return _vAlignment;
          };

          /**
           * Gets the background color for this merge cell
           *
           * @return {string} background color
           * @method getBackgroundColor()
           */
          _api.getBackgroundColor = function() {
            return _backgroundColor;
          };

          /**
           * Gets the rectangle for this merge cell
           *
           * @return {object} rectangle for this merge cell
           * @method getRect()
           */
          _api.getRect = function() {
            return _rect;
          };

          /**
           * Gets the transparent adornment for this merge cell
           *
           * @return {object} transparent adornment for this merge cell
           * @method getTransparentAdornment()
           */
          _api.getTransparentAdornment = function() {
            return _transparentAdornment;
          };

          _api.getRotationAngle = function() {
            return _rotationAngle;
          };

          /**
           * Returns whether another floater widget matches this one
           *
           * @param floater {object} Another floater widget
           * @return {integer} True if the floaters are the same, false
           * otherwise
           * @method isMatchingFloater()
           */
          _api.isMatchingFloater = function(floater) {
            var retVal = false;
            if (floater) {
              if ((floater.x() === _api.x()) && (floater.y() === _api.y()) &&
                  (floater.rowSpan() === _api.rowSpan()) &&
                  (floater.colSpan() === _api.colSpan())) {
                retVal = true;
              }
            }
            return retVal;
          };

          /**
           * Gets the merge cell's width.
           * WARNING: Calling this method causes a relayout of the
           * HTML DOM render tree!
           *
           * @return {integer} The width
           * @method width()
           */
          _api.width = function() {
            return _rect.width;
          };

          /**
           * Updates the merge cell's position and height and width dimensions
           *
           * @param topPos {integer} The top position of the merge cell
           * @param leftPos {integer} The left position of the merge cell
           * @param height {integer} The height of the merge cell
           * @param width {integer} The width of the merge cell
           * @method updatePositionAndDimensions(topPos, leftPos, height, width)
           */
          _api.updatePositionAndDimensions = function(topPos, leftPos,
                                                        height, width) {
            _setRectPosAndDimensions(topPos, leftPos, height, width);
          };

          /**
           * Returns whether or not the supplied target is within the range of
           * this floater widget.
           *
           * @param rowIndex {integer} The row index of the cell to check
           * @param colIndex {integer} The column index of the cell to check
           * @param posX {integer} Optional parameter containing a X coordinate
           * @param posY {integer} Optional parameter containing a Y coordinate
           * @return {boolean} Returns true if the supplied target is within the
           * range of this floater
           * @method isContained()
           */
          _api.isContained = function(rowIndex, colIndex /* posX, posY */) {
            var retVal = false;

            var xIndexMin = _api.x();
            var yIndexMin = _api.y();
            var xIndexMax = xIndexMin + _api.colSpan() - 1;
            var yIndexMax = yIndexMin + _api.rowSpan() - 1;

            if ((rowIndex >= yIndexMin) && (rowIndex <= yIndexMax) &&
                (colIndex >= xIndexMin) && (colIndex <= xIndexMax)) {
              retVal = true;
            }

            return retVal;
          };

        /**
         * Returns true if the floater widget lies completely within the given
         * range.
         *
         * @param {number} fromRowIndex - Row index from where the selection
         *    starts.
         * @param {number} fromColIndex - Column index from where the selection
         *    starts.
         * @param {number} toRowIndex - Row index to where the selection ends.
         * @param {number} toColIndex - Column index to where the selection ends
         * @returns {boolean}
         */
        _api.isCompletelyInSelection = function(fromRowIndex, fromColIndex,
                                             toRowIndex, toColIndex) {
          var retVal = false;
          var xIndexMin = _api.x();
          var yIndexMin = _api.y();
          var xIndexMax = xIndexMin + _api.colSpan() - 1;
          var yIndexMax = yIndexMin + _api.rowSpan() - 1;
          if (xIndexMin >= fromColIndex && xIndexMax <= toColIndex &&
              yIndexMin >= fromRowIndex && yIndexMax <= toRowIndex) {
            retVal = true;
          }

          return retVal;
        };

        /**
         * Returns true if the floater widget lies completely or partially
         * within the given range.
         *
         * @param {number} fromRowIndex - Row index from where the selection
         *    starts.
         * @param {number} fromColIndex - Column index from where the selection
         *    starts.
         * @param {number} toRowIndex - Row index to where the selection ends.
         * @param {number} toColIndex - Column index to where the selection ends
         * @returns {boolean}
         */
        _api.isInRange = function(fromRowIndex, fromColIndex, toRowIndex,
                                  toColIndex) {
          var retVal = false;
          var xIndexMin = _api.x();
          var yIndexMin = _api.y();
          var xIndexMax = xIndexMin + _api.colSpan() - 1;
          var yIndexMax = yIndexMin + _api.rowSpan() - 1;
          if (toColIndex >= xIndexMin && fromColIndex <= xIndexMax &&
              toRowIndex >= yIndexMin && fromRowIndex <= yIndexMax) {
            retVal = true;
          }
          return retVal;
        };

        /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the cell's background div element, if it exists, is appended
           * as a child to the specified node and the cell's text div element,
           * if either exists, is appended as a child to the specified node
           *
           * @param node {object} The HTML node that this widget is to attach
           * itself to
           * @method appendTo(node)
           */
          _api.appendTo = function(node) {
            if (node === undefined) {
              throw ("appendTo - missing node parameter!");
            }

            // append the background node
            if (_cellFloaterBackgroundNode !== undefined) {
              node.appendChild(_cellFloaterBackgroundNode);
            }

            // append the text node
            if (_cellFloaterTextNode !== undefined) {
              node.appendChild(_cellFloaterTextNode);
            }
          };

          /**
           * Editable widgets should have a removeFromParent() method.
           * This is used to remove the HTML elements of the widget from their
           * parent node in the HTML DOM.
           *
           * @param {node} contentNode doc fragment where deleted nodes should
           *     be appended to
           */
          _api.removeFromParent = function(contentNode) {

            if (_cellFloaterBackgroundNode !== undefined) {
              _cellFloaterBackgroundNode.removeElm();
              if(contentNode) {
                contentNode.appendChild(_cellFloaterBackgroundNode);
              }
            }

            if (_cellFloaterTextNode !== undefined) {
              _cellFloaterTextNode.removeElm();
              if(contentNode) {
                contentNode.appendChild(_cellFloaterTextNode);
              }
            }
          };

          /**
           * Clones this merge cell widget and appends the cloned HTML elements
           * to the specified node.
           * The cloned background div element, if it exists, is appended as a
           * child to the specified node and the cloned text div element,
           * if it exists, is appended as a child to the specified node
           *
           * @param node {object}  The HTML node that the cloned merge cell
           * widget is to append itself to
           * @method cloneTo(node)
           * @return {object}      The cloned widget
           */
          _api.cloneTo = function(node) {
            if (node === undefined) {
              throw ("cloneTo - missing node parameter!");
            }

            var clone = _factory.create(x, y, config, this);

            if (clone.getBackgroundNode() !== undefined) {
              node.appendChild(clone.getBackgroundNode());
            }

            if (clone.getTextNode() !== undefined) {
              node.appendChild(clone.getTextNode());
            }

            return clone;
          };

          /**
           * Sets the merge cell's display property
           *
           * @param display {string} The CSS display property value
           * @method setDisplay(display)
           */
          _api.setDisplay = function(display) {
            if (_cellFloaterBackgroundNode !== undefined) {
              _cellFloaterBackgroundNode.style.display = display;
            }
            if (_cellFloaterTextNode !== undefined) {
              _cellFloaterTextNode.style.display = display;
            }
          };

          /**
           * Returns the merge cell text
           *
           * @return {string} The merge cell's text
           * @method getCellText()
           */
          _api.getCellText = function() {
            return _cellText;
          };

          /**
           * Returns the merge cell's editable text
           *
           * @return {string} The merge cell's editable text
           * @method getEditableText()
           */
          _api.getEditableText = function() {
            return _editableText;
          };

          /**
           * Returns whether or not this floater widget can be selected.
           * A merge cell can always be selected so this method returns true.
           *
           * @return {boolean} Returns true
           * @method isSelectable()
           */
          _api.isSelectable = function() {
            return true;
          };

          /**
           * Returns the config of this cell
           *
           * @return {object} The config of this cell
           * @method getConfig()
           */
          _api.getConfig = function() {
              return config;
          };

          /**
           * @api private
           */
          var _init = function() {
              if (cellToClone === undefined) {
                _createDefaultMergeCell();
              } else {
                _createClonedMergeCell();
              }
            };

          var _createClonedMergeCell = function() {

              var cloneBackgroundNode = cellToClone.getBackgroundNode();
              if (cloneBackgroundNode !== undefined) {
                //LM TODO: Do we need to use a new id?
                _cellFloaterBackgroundNode =
                    cloneBackgroundNode.cloneNode(true);
              }

              var cloneTextNode = cellToClone.getTextNode();
              if (cloneTextNode !== undefined) {
                //LM TODO: Do we need to use a new id?
                _cellFloaterTextNode = cloneTextNode.cloneNode(true);
              }

              _x = cellToClone.x();
              _y = cellToClone.y();
              _hAlignment = cellToClone.getHorizontalAlignment();
              _vAlignment = cellToClone.getVerticalAlignment();
              _backgroundColor = cellToClone.getBackgroundColor();
              _rect = cellToClone.getRect();
              _cellText = cellToClone.getCellText();
              _editableText = cellToClone.getEditableText();
              _rowSpan = cellToClone.rowSpan();
              _colSpan = cellToClone.colSpan();
              _transparentAdornment = cellToClone.getTransparentAdornment();
              _rotationAngle = cellToClone.getRotationAngle();
            };

          var _createDefaultMergeCell = function() {
              if ((x === undefined) || (y === undefined) ||
                  (config === undefined)) {
                throw ("SheetCell.create - missing constructor parameters!");
              }

              _hAlignment = config.horizontalAlign;
              _vAlignment = config.verticalAlign;
              _rotationAngle = config.rotationAngle;

              if (config.backgroundColor) {
                _backgroundColor = config.backgroundColor;
              } else {
                // ensure underlying inner gridlines are blanked out
                // (but not outer ones)
                _backgroundColor = "#FFFFFF";
              }

              _transparentAdornment = SheetConfig.kGRID_GRIDLINE_WIDTH;

              _cellText = config.cellText || "";
              _editableText = config.editableText;

              _createCellFloaterDivs();
            };

          /**
           * Creates a cell floater div to display the background color &
           * text contents of the cell
           *
           * @api private
           */
          var _createCellFloaterDivs = function() {

              // (1) BACKGROUND DIV
              _cellFloaterBackgroundNode =
                  document.createElement(kFloaterBackground_Node.Tag);
              _cellFloaterBackgroundNode.id = "mcb_" + _x + "-" + _y;
              _cellFloaterBackgroundNode.classList.add(
                  kFloaterBackground_Node.Class);

              var bkgDecorator =
                  BackgroundDecorator.create(_cellFloaterBackgroundNode);
              bkgDecorator.decorate(_backgroundColor);

              _cellFloaterBackgroundNode.style.position =
                  kFloaterBackground_Node.Position;

              // (2) TEXT DIV (note: only create if there is text)
              // AC_invalid test due to current DCP merge cell having to always
              // be created to blank out borders of cells under merge cell.
              // ... real fix is to get service NOT to send DCP borders for
              // underlying cells.
              //        if(_cellText) {
              _cellFloaterTextNode =
                  document.createElement(kFloaterText_Node.Tag);
              _cellFloaterTextNode.id = "mct_" + _x + "-" + _y;
              _cellFloaterTextNode.classList.add(kFloaterText_Node.Class);

              if(_backgroundColor === "#FFFFFF") {
                // if the merged cell has the default background color of white
                // then drop the z-index of the text node to 21 so that if the
                // merged cell is selected as part of a range of cells then it
                // takes on the blue color of the range box

                _cellFloaterTextNode.style.zIndex = 21;
              }

              _cellFloaterTextNode.style.position = kFloaterText_Node.Position;
              // use an inner span so we can control horizontal alignments
              // using scrollLeft
              var innerSpanNode = document.createElement('span');
              innerSpanNode.textContent = _cellText;
              _cellFloaterTextNode.appendChild(innerSpanNode);
              _setAlignment();
              _setRectPosAndDimensions(config.cellTopPos, config.cellLeftPos,
                  config.cellHeight, config.cellWidth);

              bkgDecorator = BackgroundDecorator.create(_cellFloaterTextNode);
              bkgDecorator.decorate(_backgroundColor);

              var gridFonts = SheetModel.fontNames;
              if(config && config.formatting && gridFonts &&
                  !config.formatting.font) {
                var fontIndex = config.formatting.fi;
                if (fontIndex < gridFonts.length) {
                    config.formatting.font = gridFonts[fontIndex].toLowerCase();
                }
              }

              TextDecorator.decorate(_cellFloaterTextNode, config.formatting);
              CellDecorator.decorate(_cellFloaterTextNode, config.formatting);
            };

          var _setRectPosAndDimensions = function(topPos, leftPos,
                                                    height, width) {

              topPos = Math.max(0, topPos);
              leftPos = Math.max(0, leftPos);
              height = Math.max(0, height);
              width = Math.max(0, width);

              _rect = {
                top: topPos,
                left: leftPos,
                height: height,
                width: width
              };

              var nodeRect = {
                top: Math.max(0, topPos + _transparentAdornment),
                left: Math.max(0, leftPos + _transparentAdornment),
                height: Math.max(0, height - (2 * _transparentAdornment)),
                width: Math.max(0, width - (2 * _transparentAdornment))
              };

              if (_cellFloaterBackgroundNode) {
                _cellFloaterBackgroundNode.style.top = nodeRect.top + "px";
                _cellFloaterBackgroundNode.style.left = nodeRect.left + "px";
                _cellFloaterBackgroundNode.style.height =
                    nodeRect.height + "px";
                _cellFloaterBackgroundNode.style.width = nodeRect.width + "px";
              }

              if (_cellFloaterTextNode) {
                _cellFloaterTextNode.style.top = nodeRect.top + "px";
                _cellFloaterTextNode.style.left = nodeRect.left +
                    SheetConfig.kDEFAULT_CELL_PADDING + "px";
                _cellFloaterTextNode.style.height = nodeRect.height + "px";
                _cellFloaterTextNode.style.width = nodeRect.width -
                    (SheetConfig.kDEFAULT_CELL_PADDING * 2) + "px";

                var textWidth;
                var innerRectWidth = nodeRect.width;
                if (_hAlignment === 'right') {
                  textWidth = _cellFloaterTextNode.childNodes[0].offsetWidth;
                  _cellFloaterTextNode.scrollLeft =
                      (textWidth - innerRectWidth);
                } else if (_hAlignment === 'centre') {
                  textWidth = _cellFloaterTextNode.childNodes[0].offsetWidth;
                  var halfRectWidth = innerRectWidth / 2;
                  var halfTextWidth = textWidth / 2;
                  _cellFloaterTextNode.scrollLeft =
                      halfTextWidth - halfRectWidth;
                }

                if(_rotationAngle) {
                  var innerSpanNode = _cellFloaterTextNode.childNodes[0];
                  var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
                  innerSpanNode.style.position = 'relative';
                  TextRotationDecorator.decorate(innerSpanNode, _hAlignment,
                      _vAlignment, _rotationAngle, scale);
                }
              }
            };

          /**
           * Sets the horizontal and/or vertical alignment of the cells contents
           * Note that this only has visible effect on cells which have
           * text content
           * @api private
           */
          var _setAlignment = function() {
              if (_cellFloaterTextNode !== undefined) {
                var alignmentDecorator =
                    AlignmentDecorator.create(_cellFloaterTextNode);
                alignmentDecorator.decorate(_hAlignment, _vAlignment);
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
