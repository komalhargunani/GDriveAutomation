/**
 * Column
 * ========
 *
 * A column widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a column in the grid's 'base' node.
 * The column widget manages the construction and logic of the column,
 * including the column's header.
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
 * @constructor               Constructor for the Column widget.
 * @param index {integer} Mandatory parameter indicating the index of the column
 * @param position {integer} Mandatory parameter indicating the absolute
 * position of the left of the columm
 * @param colWidth {integer} Optional parameter indicating the width of the
 * column; defaults to SheetConfig.kGRID_DEFAULT_COL_WIDTH
 * @param columnToClone {object} Optional parameter which is an existing column
 * widget that the new column widget is to be cloned from
 * @return {object}           A Column widget.
 */

define([
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/dcp/decorators/borderDecorator',
  'qowtRoot/dcp/decorators/backgroundDecorator',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/models/sheet'
], function(ColHeaderContainer, BorderDecorator,
    BackgroundDecorator, SheetConfig, SheetModel) {

  'use strict';

  var _factory = {

    create: function(index, position, colWidth, columnToClone) {

      if (arguments.length < 3) {
        throw ("Column: Constructor missing parameter list [index," +
            " position, colWidth]");
      }

      // use module pattern for instance object
      var module = function() {

          /**
           *  @api private
           */
          var _kCol_Node = {
            Tag: "div",
            Class: "qowt-sheet-col",
            Position: 'absolute'
          },
            _kCol_Node_Header = {
              Tag: "div",
              Class: "qowt-sheet-col-header",
              Position: 'absolute'
            },
            _kColumn_Node_Header_Highlight_Class =
                "qowt-sheet-column-header-highlight",
            _kFormatted_Column_Class = "qowt-sheet-formatted-col",
            _kHide_Left_Border_Class = "qowt-hide-left-border",
            _kFont_Color_Blue_Class = "qowt-font-color-blue",
            _kWide_Left_Border_Class = "qowt-wide-left-border";

          /**
           *  @api private
           */
          var _colNode,
            _colNodeHeader,
            _frozenColHeaderNode,
            _index = index,
            _cells = [],

            _actualWidth,
            _actualPos,
            _actualHeight,
            _isHeaderStyledLeftOfHidden,
            _isHeaderStyledRightOfHidden,

            _preppedWidth,
            _preppedPos,
            _preppedHeaderValue,
            _preppedHeaderStyleLeftOfHidden = false,
            _preppedHeaderStyleRightOfHidden = false,
            _hidden = false,

            _preHiddenWidth,

            _isHeaderHighlighted,

            _backgroundDecorator,

            _headerFrozen = false;

          /**
           *  @api private
           */
          var _api = {

            /**
             * Gets the width of the column
             *
             * @return {integer} The width of the column
             * @method getWidth()
             */
            getWidth: function() {
              return _actualWidth;
            },

            /**
             * Gets the height of the column
             *
             * @return {integer} The height of the column
             * @method getHeight()
             */
            getHeight: function() {
              return _actualHeight;
            },

            /**
             * Gets the width of the column before it was hidden
             *
             * @return {integer} The width of the column before it was hidden
             * @method getPreHiddenWidth()
             */
            getPreHiddenWidth: function() {
              return _preHiddenWidth;
            },

            /**
             * Gets the position of the column
             *
             * @return {integer} The position of the column
             * @method getPosition()
             */
            getPosition: function() {
              return _actualPos;
            },

            /**
             * Gets the index of the column
             *
             * @return {integer} The index of the column
             * @method getIndex()
             */
            getIndex: function() {
              return _index;
            },

            /**
             * Returns whether or not the column's header is highlighted
             *
             * @return {boolean} A boolean value indicating whether the column's
             *                   header is highlighted (true) or not (false)
             * @method isHeaderHighlighted()
             */
            isHeaderHighlighted: function() {
              return _isHeaderHighlighted;
            },

            /**
             * Returns whether or not the column's header is styled as left of a
             * hidden column
             *
             * @return {boolean} A boolean value indicating whether the column's
             *                   header is styled as left of a hidden column
             * @method isHeaderStyledLeftOfHidden()
             */
            isHeaderStyledLeftOfHidden: function() {
              return _isHeaderStyledLeftOfHidden;
            },

            /**
             * Returns whether or not the column's header is styled as right of
             * a hidden column
             *
             * @return {boolean} A boolean value indicating whether the column's
             *                   header is styled as right of a hidden column
             * @method isHeaderStyledRightOfHidden()
             */
            isHeaderStyledRightOfHidden: function() {
              return _isHeaderStyledRightOfHidden;
            },

            /**
             * Gets the number of cells in the column
             *
             * @return {integer} The number of cells
             * @method getNumOfCells()
             */
            getNumOfCells: function() {
              return _cells.length;
            },

            /**
             * Gets the array of cells in the column
             *
             * @return {object} The array of cells
             * @method getCells()
             */
            getCells: function() {
              return _cells;
            },

            /**
             * Gets the column header node
             *
             * @return {object} The column header node
             * @method getHeaderNode()
             */
            getHeaderNode: function() {
              return _colNodeHeader;
            },

            /**
             * Gets the column node
             *
             * @return {object} The column node
             * @method getColumnNode()
             */
            getColumnNode: function() {
              return _colNode;
            },

            /**
             * Gets the prepared width of the column.
             * This is the width of the column after
             * the column has been prepared for layout.
             *
             * @return {integer} The prepared width of the column
             * @method getPreppedWidth()
             */
            getPreppedWidth: function() {
              var width = (_preppedWidth !== -1) ? _preppedWidth : _actualWidth;
              return width;
            },

            /**
             * Gets the prepared position of the column.
             * This is the position of the column after
             * the column has been prepared for layout.
             *
             * @return {integer} The prepared position of the column
             * @method getPreppedPosition()
             */
            getPreppedPosition: function() {
              var position = (_preppedPos !== -1) ? _preppedPos : _actualPos;
              return position;
            },

            /**
             * Gets the prepared header value flag of the column.
             * This is a flag indicating whether or not the header
             * value needs to be updated after the column has been prepared for
             * layout.
             *
             * @return {integer} The prepared header value flag of the column
             * @method getPreppedHeaderValue()
             */
            getPreppedHeaderValue: function() {
              return _preppedHeaderValue;
            },

            /**
             * Gets the prepared header style left of hidden flag of the column.
             * This is a flag indicating whether or not the header
             * needs to be styled as being left of a hidden column
             * after the column has been prepared for layout.
             *
             * @return {integer} The prepared header style left of hidden flag
             * of the column
             * @method getPreppedHeaderStyleLeftOfHidden()
             */
            getPreppedHeaderStyleLeftOfHidden: function() {
              return _preppedHeaderStyleLeftOfHidden;
            },

            /**
             * Gets the prepared header style right of hidden flag of the column
             * This is a flag indicating whether or not the header
             * needs to be styled as being right of a hidden column
             * after the column has been prepared for layout.
             *
             * @return {integer} The prepared header style right of hidden flag
             * of the column
             * @method getPreppedHeaderStyleRightOfHidden()
             */
            getPreppedHeaderStyleRightOfHidden: function() {
              return _preppedHeaderStyleRightOfHidden;
            },

            /**
             * Gets the prepared right position of the column.
             * This is the right position of the column after
             * the column has been prepared for layout.
             *
             * @return {integer} The prepared right position of the column
             * @method getPreppedRightPos()
             */
            getPreppedRightPos: function() {
              var rightPos = (_preppedPos !== -1) ? _preppedPos : _actualPos;
              rightPos += (_preppedWidth !== -1) ? _preppedWidth : _actualWidth;
              return rightPos;
            },

            /**
             * Prepares the column for width layout.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the width layout,
             * but it does not actually update the width or do any
             * HTML DOM 'sets'.
             *
             * @param width {integer} The desired width of the column
             * @return {boolean}      A flag indicating whether this column is
             * dirty - i.e. whether it requires a width layout or not
             * @method prepLayoutWidth(width)
             */
            prepLayoutWidth: function(width) {
              if (width !== _actualWidth) {
                _preppedWidth = width;
              }

              return _preppedWidth !== -1;
            },

            /**
             * Prepares the column for position layout.
             * This method may do HTML DOM 'gets' to gather the necessarydata to
             * perform the position layout, but it does not actually update the
             * position or do any HTML DOM 'sets'.
             *
             * @param pos {integer} The desired position of the column
             * @return {boolean}    A flag indicating whether this column is
             * dirty - i.e. whether it requires a position layout or not
             * @method prepLayoutPos(pos)
             */
            prepLayoutPos: function(pos) {
              if (pos !== _actualPos) {
                _preppedPos = pos;
              }

              return _preppedPos !== -1;
            },

            /**
             * Prepares the column for header layout.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the header layout,but it does not actually update the
             * header or do any HTML DOM 'sets'.
             *
             * @param doUpdateValue {boolean} A flag indicating whether the
             * header's value needs to be updated (e.g. from 'B' to 'C')
             * @param doStyleAsLeftOfHiddenCol {boolean} A flag indicating
             * whether the header needs to be styled as being to the left of a
             * hidden column
             * @param doStyleAsRightOfHiddenCol {boolean} A flag indicating
             *  whether the header needs to be styled as being to the right of
             *  a hidden column
             * @return {boolean} A flag indicating whether this column is dirty
             * - i.e. whether it requires a header layout or not
             * @method prepLayoutHeader()
             */
          prepLayoutHeader: function(doUpdateValue, doStyleAsLeftOfHiddenCol,
              doStyleAsRightOfHiddenCol) {
              var dirty = false;

              if (doUpdateValue === true) {
                _preppedHeaderValue = true;
                dirty = true;
              }

              if (doStyleAsLeftOfHiddenCol !== _isHeaderStyledLeftOfHidden) {
                _preppedHeaderStyleLeftOfHidden = doStyleAsLeftOfHiddenCol;
                dirty = true;
              }

              if (doStyleAsRightOfHiddenCol !== _isHeaderStyledRightOfHidden) {
                _preppedHeaderStyleRightOfHidden = doStyleAsRightOfHiddenCol;
                dirty = true;
              }

              return dirty;
            },

            /**
             * Performs a layout of the column.
             * This can involve updating the width, position and header of the
             * row.
             *
             * This method uses pre-prepared data to perform the column layout -
             * it does not do any HTML DOM 'gets' to gather this data.
             * It does do HTML DOM 'sets' to update the necessary aspects of the
             * column.
             *
             * @param idx {integer}    The index of the column. NOTE: the index
             * of a column widget can change as columns are inserted and deleted
             * from the grid. The index of this column may be updated internally
             * here
             * @method layout(idx)
             */
            layout: function(idx) {
              if (_preppedWidth !== -1) {
                _setWidth(idx, _preppedWidth);
              }

              if (_preppedPos !== -1) {
                _setPosition(idx, _preppedPos);
              }

              if (_preppedHeaderValue !== false) {
                _setHeader(idx);
              }

              var headerCommonStyling;

              if (_preppedHeaderStyleLeftOfHidden !==
                  _isHeaderStyledLeftOfHidden) {
                headerCommonStyling |= _setHeaderLeftStyling(idx);
              }

              if (_preppedHeaderStyleRightOfHidden !==
                  _isHeaderStyledRightOfHidden) {
                headerCommonStyling |= _setHeaderRightStyling(idx);
              }

              if (headerCommonStyling !== undefined) {
                _setHeaderCommonStyling(headerCommonStyling);
              }

              // update all cells in this column too
              var cellsLength = _cells.length;
              for (var i = 0; i < cellsLength; i++) {
                var cell = _cells[i];
                if (cell !== undefined) {
                  // LM TODO: do we need to pass the x,y values of this cell
                  // here, incase they have changed due to a row/col insert or
                  // delete?
                  // (like we do above when we pass the colIndex in _setWidth()
                  // etc)
                  cell.leftPosition = _actualPos;
                  cell.width = _actualWidth;
                }
              }

              // reset the prepped values
              _resetPrepped();
            },

            /**
             * Sets the column's height to the specified value
             *
             * @method setHeight(height)
             */
            setHeight: function(height) {
              if (height !== _actualHeight) {
                _colNode.style.height = height + "px";
                _actualHeight = height;
              }
            },

            /**
             * Stores the pre-hidden width of the column
             *
             * @param width {integer} The pre-hidden width of the column
             * @method setPreHiddenWidth(width)
             */
            setPreHiddenWidth: function(width) {
              _preHiddenWidth = width;
            },

            /**
             * Removes this column's cell references
             *
             * @method removeCells()
             */
            removeCells: function() {
              _cells = [];
            },

            /**
             * Highlights the column's header depending on the specified boolean
             * value.
             * This is used to distinguish this column's header from the other
             * column headers
             * when a cell is selected in this column
             *
             * @param doHighlight {boolean} A flag indicating whether to
             * highlight the column's header (true) or not (false)
             *
             * @method highlightHeader(doHighlight)
             */
            highlightHeader: function(doHighlight) {
              if (_isHeaderHighlighted !== doHighlight) {
                if (doHighlight) {
                  _colNodeHeader.classList.add(
                      _kColumn_Node_Header_Highlight_Class);
                  if (_headerFrozen && _frozenColHeaderNode) {
                    _frozenColHeaderNode.classList.add(
                        _kColumn_Node_Header_Highlight_Class);
                  }
                } else {
                  _colNodeHeader.classList.remove(
                      _kColumn_Node_Header_Highlight_Class);
                  if (_headerFrozen && _frozenColHeaderNode) {
                    _frozenColHeaderNode.classList.remove(
                        _kColumn_Node_Header_Highlight_Class);
                  }
                }
                _isHeaderHighlighted = doHighlight;
              }
            },

            /**
             * Every widget has an appendTo() method.
             * This is used to append the HTML elements of the widget to a
             * specified node in the HTML DOM.
             * Here the column div element is appended as a child to the
             * specified node and the column's header div element is appended as
             * a child of the column header container
             *
             * @param node {object} The HTML node that this widget is to append
             *                      itself to
             * @param appendHeaderNode {boolean} true if header node is to be
             *                                   appended to column header
             *                                   container.
             * @method appendTo(node)
             */
            appendTo: function(node, appendHeaderNode) {
              if (node === undefined) {
                throw ("appendTo - missing node parameter!");
              }

              if (_colNode) {
                node.appendChild(_colNode);
              }

              // insert-col operation adds new column to all the panes if panes
              // are frozen. Column is added to base node of every pane. However
              // header node is added to colheaderContainer every time.
              // Please refer crbug-346594 for more details.
              // To fix this issue, instead of adding header by default, it is
              // added only when appendHeaderNode is true. This avoids duplicate
              // entries of header node in colHeaderContainer.
              if (_colNodeHeader && appendHeaderNode) {
                ColHeaderContainer.container().appendChild(_colNodeHeader);
              }
            },

            /**
             * Clones this column widget and appends the cloned HTML elements to
             * the specified node.
             * The column div element is appended as a child to the specified
             * node.
             *
             * @param node {object} The HTML node that the cloned widget is to
             * append itself to
             * @method cloneTo(node)
             * @return {object}
             * The cloned widget
             */
          cloneTo: function(node) {
              if (node === undefined) {
                throw ("cloneTo - missing node parameter!");
              }

              var clone = _factory.create(_index, _actualPos,
                  _actualWidth, this);

              if (clone.getColumnNode()) {
                node.appendChild(clone.getColumnNode());
              }

            return clone;
          },

          /**
           * Appends the column's header div element as a child of the frozen
           * column header container.
           */
          addFrozenColumnHeader: function(clonedColumn) {
            // A cloned column's header is never added to the normal
              // column header container (which already contains all column
              // headers from the main pane's columns)
              // LM TODO: So a cloned column might have a header div that is
              // never actually used - perhaps something to revisit but leave
              // this for now as it keeps the column widget code uncluttered
              // without 'if(_colNodeHeader !== undefined)' everywhere.

            // Makes sure the frozen column headers are added only once
            if (clonedColumn.getHeaderNode() &&
                clonedColumn.getHeaderNode().textContent !==
                    ColHeaderContainer.frozenContainer().lastChild.textContent
                ) {
              _frozenColHeaderNode = clonedColumn.getHeaderNode();
                _headerFrozen = true;
                ColHeaderContainer.frozenContainer().appendChild(
                    _frozenColHeaderNode);
              }
          },

          /**
           * Resets the _headerFrozen flag and _frozenColHeaderNode.
           * Called when unfreezing the panes.
           */
          resetFrozenColHeader: function() {
            _frozenColHeaderNode = undefined;
            _headerFrozen = false;
            },

            /**
             * Attach the specified widget to this widget.
             * Here the specified cell widget is attached to this column widget
             *
             * @param widget {object} A cell widget
             * @method attachWidget(widget)
             */
            attachWidget: function(widget) {
              if (widget === undefined) {
                throw ("attachWidget - missing widget parameter!");
              }
              _cells[widget.y] = widget;
            },

            /**
             * Detach the specified widget from this widget.
             * Here the specified cell widget is detached from this column
             * widget
             *
             * @param widget {object} A cell widget
             * @method detachWidget(widget)
             */
            detachWidget: function(widget) {
              if (widget === undefined) {
                throw ("detachWidget - missing widget parameter!");
              }
              _cells[widget.y] = undefined;
            },

            /**
             * Applies background and border formatting that has been received
             * for a column. The column background color is set on the column
             *  div and borders set around the column div.
             * Note: handling of borders for each cell in the column is not done
             * here.
             *
             * @param backgroundColor {string} The background color
             * @param borders {object} The border information
             * @see dcplegacyservice-cpp-main/schemas/objects
             * /SheetFormatting-object-schema.json
             * @method applyBackgroundAndBorders(backgroundColor, borders)
             */
            applyBackgroundAndBorders: function(backgroundColor, borders) {
              if (backgroundColor) {
                _backgroundDecorator = BackgroundDecorator.create(_colNode);
                _backgroundDecorator.decorate(backgroundColor);
              }

              if (borders) {
                _colNode.classList.remove(_kCol_Node.Class);
                BorderDecorator.decorate(_colNode, borders);
              }

              if (backgroundColor || borders) {
                _colNode.classList.add(_kFormatted_Column_Class);
              }
            },

            /**
             * Sets the formatting information for this column
             *
             * @param formatting {object} The column formatting data, as
             * represented in the schema
             * @see dcplegacyservice-cpp-main/schemas/objects
             * /SheetFormatting-object-schema.json
             * @method setFormatting(formatting)
             */
            setFormatting: function(formatting) {
              SheetModel.ColFormatting[_index] = formatting;
            },

            /**
             * Returns the formatting information for this column
             *
             * @return {object} The formatting for the column
             * @see dcplegacyservice-cpp-main/schemas/objects
             * /SheetFormatting-object-schema.json
             * @method getFormatting()
             */
            getFormatting: function() {
              return SheetModel.ColFormatting[_index];
            },

            /**
             * Returns the cell from a given index
             *
             * @param y {Number} An index
             * @method getCell(y)
             */
            getCell: function(y) {
              return _cells[y];
            },

            /**
             * Resets the formatting on the column node.
             * NOTE: This method will not affect the layout
             * information (including header).
             *
             * @method resetFormatting()
             */
            resetFormatting: function() {
              _colNode.className = _kCol_Node.Class;
              SheetModel.ColFormatting[_index] = undefined;
              if (_backgroundDecorator) {
                _backgroundDecorator.undecorate();
                _backgroundDecorator = undefined;
              }
              BorderDecorator.undecorate(_colNode);
            },

            /**
             * Makes space in the column's internal cells array for newly
             * inserted rows
             *
             * @param {integer} rowIndexToInsertAt Where the rows were inserted
             * @param {integer} numOfRows How many rows have been inserted
             */
            insertCells: function(rowIndexToInsertAt, numOfRows) {
              for(var i = 0; i < numOfRows; i++) {
                _cells.splice(rowIndexToInsertAt, 0, undefined);
              }
            },

            /**
             * Deletes cells in the column's internal cells array
             *
             * @param {integer} rowIndexToDeleteAt Where the rows were deleted
             * @param {integer} numOfRows How many rows have been deleted
             */
            deleteCells: function(rowIndexToDeleteAt, numOfRows) {
              _cells.splice(rowIndexToDeleteAt, numOfRows);
            },

            /**
             * Updates the new column index in the header node and also in the
             * cells inside the column. Does not keep track of it anymore
             * internally.
             *
             * @param {integer} idx new index of the column
             */
            updateIndex: function(idx) {
              _index = idx;
              _setHeader(_index);
              var cell, len = _cells.length;
              for (var i = 0; i < len; i++) {
                cell = _cells[i];
                if (cell !== undefined) {
                  cell.updateColumnIndex(_index);
                }
              }
            },

            /**
             * Removes every node related to this column from the node.
             * This includes then col header and the cells in the column.
             *
             * @param {node} baseNode doc fragment where deleted col nodes
             *    should be appended to
             * @param {node} contentNode doc fragment where deleted content
             *    nodes should be appended to
             */
            removeFromParent: function(baseNode, contentNode) {
              var cell, len = _cells.length;
              for (var i = 0; i < len; i++) {
                cell = _cells[i];
                if (cell !== undefined) {
                  cell.removeFromParent(contentNode);
                }
              }
              if (_colNode) {
                _colNode.removeElm();
                baseNode.appendChild(_colNode);
              }

              if (_colNodeHeader) {
                _colNodeHeader.removeElm();
              }
            },

            /**
             * Reappends the header node.
             */
            reappendHeader: function() {
              if (_colNodeHeader) {
                ColHeaderContainer.container().appendChild(_colNodeHeader);
              }
            },

            /**
             * Returns true when column is hidden, false otherwise.
             *
             * @return {boolean} true/false
             */
            isHidden: function() {
              return  _hidden;
            },

            /**
             * Sets hidden property of a column. A column is hidden if width of
             * column becomes 0 or while rendering it has 'hd' as a
             * column property.
             *
             * @param {Boolean} value The value to be set.
             */
            setHidden: function(value) {
              _hidden = value;
            }
          };

          /**
           * Initialisation method that is called on construction of the widget.
           * This method should cause no HTML render tree relayouts to occur.
           * @api private
           */
          var _init = function() {
              if (columnToClone === undefined) {
                _createDefaultColumn();
              } else {
                _createClonedColumn();
              }
            };

          var _createDefaultColumn = function() {

              var colWidthInPx =(colWidth !== undefined) ?
                  colWidth : SheetConfig.kGRID_DEFAULT_COL_WIDTH;

              _colNodeHeader = document.createElement(_kCol_Node_Header.Tag);
              _colNodeHeader.style.position = _kCol_Node_Header.Position;
              _colNodeHeader.style.top = 0;
              _colNodeHeader.className = _kCol_Node_Header.Class;
              _setHeader(_index);

              _colNode = document.createElement(_kCol_Node.Tag);
              _colNode.style.position = _kCol_Node.Position;
              _colNode.style.top = 0;
              _colNode.style.height = (SheetConfig.kGRID_DEFAULT_ROWS *
                  SheetConfig.kGRID_DEFAULT_ROW_HEIGHT) + "px";
              _colNode.className = _kCol_Node.Class;

              _actualWidth = -1;
              _actualPos = 0;
              _actualHeight = 0;

              _isHeaderStyledLeftOfHidden = false;
              _isHeaderStyledRightOfHidden = false;

              _preppedWidth = -1;
              _preppedPos = -1;
              _preppedHeaderValue = false;
              _preppedHeaderStyleLeftOfHidden = false;
              _preppedHeaderStyleRightOfHidden = false;

              _preHiddenWidth = -1;

              _isHeaderHighlighted = false;

              _setWidth(_index, colWidthInPx);
              _setPosition(_index, position);

              // _listenForMouseDownEvents();
            };

          var _createClonedColumn = function() {

              //LM TODO: Do we need to use a new id?
              _colNodeHeader = columnToClone.getHeaderNode().cloneNode(true);
              _setHeader(_index);

              // LM TODO: Do we need to use a new id?
              _colNode = columnToClone.getColumnNode().cloneNode(true);
              _actualWidth = columnToClone.getWidth();
              _actualPos = columnToClone.getPosition();
              _actualHeight = columnToClone.getHeight();

              _isHeaderStyledLeftOfHidden =
                  columnToClone.isHeaderStyledLeftOfHidden();
              _isHeaderStyledRightOfHidden =
                  columnToClone.isHeaderStyledRightOfHidden();

              _preppedWidth = columnToClone.getPreppedWidth();
              _preppedPos = columnToClone.getPreppedPosition();
              _preppedHeaderValue = columnToClone.getPreppedHeaderValue();
              _preppedHeaderStyleLeftOfHidden =
                  columnToClone.getPreppedHeaderStyleLeftOfHidden();
              _preppedHeaderStyleRightOfHidden =
                  columnToClone.getPreppedHeaderStyleRightOfHidden();

              _preHiddenWidth = columnToClone.getPreHiddenWidth();

              _isHeaderHighlighted = columnToClone.isHeaderHighlighted();

              // _listenForMouseDownEvents();
            };

          var _setWidth = function(idx, width) {
              if ((idx === undefined) || (width === undefined)) {
                throw ("_setWidth - missing parameters!");
              }

              _index = idx;

              _colNode.style.width = width + "px";
              _colNodeHeader.style.width = width + "px";

              if (_hidden) {
                // this column is being hidden so effectively collapse its left
                // and right borders
                _colNode.classList.add(_kHide_Left_Border_Class);
              } else  {
                // this column is being unhidden so restore its borders
                _colNode.classList.remove(_kHide_Left_Border_Class);
              }

              // incase this column is being hidden, cache the current
              // width for use if/when the column is unhidden again
              _preHiddenWidth = (_actualWidth === -1) ? width : _actualWidth;

              _actualWidth = width;

              // store the col width in the model so that other modules
              // can easily access it without causing circular dependencies
              SheetModel.ColWidths = SheetModel.ColWidths || [];
              SheetModel.ColWidths[_index] = _actualWidth;
            };

          var _setPosition = function(idx, pos) {
              if ((idx === undefined) || (pos === undefined)) {
                throw ("_setPosition - missing parameters!");
              }

              _index = idx;

              _colNode.style.left = pos + "px";
              _colNodeHeader.style.left = pos + "px";
              _actualPos = pos;

              // store the col pos in the model so that other modules
              // can easily access it without causing circular dependencies
              SheetModel.ColPos = SheetModel.ColPos || [];
              SheetModel.ColPos[_index] = _actualPos;
            };

          var _setHeader = function(idx) {
              _index = idx;

              // set the header based on the current index value
              _colNodeHeader.textContent = _convertColumnIndexToText(_index);
            };

          var _setHeaderLeftStyling = function(idx) {
              _index = idx;

              // no specific styling for left
              _isHeaderStyledLeftOfHidden = _preppedHeaderStyleLeftOfHidden;

              return _isHeaderStyledLeftOfHidden;
            };

          var _setHeaderRightStyling = function(idx) {
              _index = idx;

              if (_preppedHeaderStyleRightOfHidden === true) {
                // set the header to have 'wide left border' styling
                _colNodeHeader.classList.add(_kWide_Left_Border_Class);
              } else {
                _colNodeHeader.classList.remove(_kWide_Left_Border_Class);
              }

              _isHeaderStyledRightOfHidden = _preppedHeaderStyleRightOfHidden;

              return _isHeaderStyledRightOfHidden;
            };

          var _setHeaderCommonStyling = function(headerCommonStyling) {
              // blue font color
              if (headerCommonStyling === 1) {
                _colNodeHeader.classList.add(_kFont_Color_Blue_Class);
              } else { // headerCommonStyling === 0
                _colNodeHeader.classList.remove(_kFont_Color_Blue_Class);
              }
            };

          var _resetPrepped = function() {
              _preppedWidth = -1;
              _preppedPos = -1;
              _preppedHeaderValue = false;
            };

          var _convertColumnIndexToText = function(idx) {
              var text = '';
              var maxNumberOfCols = 16383;
              var numLettersInAlphabet = 26;
              var asciiAlphaStartValue = 65;
              if (idx >= 0 && idx <= maxNumberOfCols) {
                var colName = new Array("A", "A", "A");

                var offset = 2;

                // extract rightmost character, this must always be there,
                // column must be at least 'A'
                colName[2] = String.fromCharCode(asciiAlphaStartValue +
                    (idx % numLettersInAlphabet));

                // shift all chars down so that 'AA' is now 0 *
                // numLettersInAlphabet and 'AAA' is now
                // numLettersInAlphabet * numLettersInAlphabet
                // this makes the following calculations easier
                idx -= numLettersInAlphabet;

                if (idx >= 0) {
                  offset = 1;
                  colName[offset] = String.fromCharCode(asciiAlphaStartValue +
                      ((idx / numLettersInAlphabet) % numLettersInAlphabet));
                }

                if (idx >= numLettersInAlphabet * numLettersInAlphabet) {
                  offset = 0;
                  colName[offset] =
                      String.fromCharCode((asciiAlphaStartValue - 1) +
                          idx / (numLettersInAlphabet * numLettersInAlphabet));
                }

                text = colName.join("").substr(offset, colName.length - offset);
              }
              return text;
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
