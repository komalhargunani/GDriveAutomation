/**
 * Row
 * =====
 *
 * A row widget encapsulates the part of the HTML DOM representing
 * a workbook that displays a row in the grid's 'base' node.
 * The row widget manages the construction and logic of the row,
 * including the row's header.
 *
 * ###IMPORTANT NOTE!
 *
 * Widgets should cause no HTML render tree relayouts
 * to occur in their constructor. This is to prevent many expensive render tree
 * relayouts from occuring during the opening of a workbook or switching of
 * a sheet.
 * If a widget requires to perform operations that will result in a
 * relayout of the render tree then these operations should be captured in a
 * 'layoutBlah()' method in the widget's public API, so that the workbook layout
 * control can dictate when this method is called, at an appropriate moment to
 * take the 'hit' of render tree relayout costs.
 *
 * @constructor               Constructor for the Row widget.
 * @param index {integer}     Mandatory parameter indicating the index of the
 *                            row
 * @param position {integer}  Mandatory parameter indicating the absolute
 *                            position of the top of the row
 * @param rowHeight {integer} Optional parameter indicating the height of the
 *                            row; defaults to
 *                            SheetConfig.kGRID_DEFAULT_ROW_HEIGHT
 * @param rowToClone {object} Optional parameter which is an existing row widget
 *                            that the new row widget is to be cloned from
 * @return {object}           A Row widget.
 */
define([
  'qowtRoot/dcp/decorators/backgroundDecorator',
  'qowtRoot/dcp/decorators/borderDecorator',
  'qowtRoot/widgets/grid/rowHeaderContainer',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/models/sheet'
], function(BackgroundDecorator, BorderDecorator, RowHeaderContainer,
    SheetConfig, SheetModel) {

  'use strict';

  var _factory = {

    create: function(index, position, rowHeight, rowToClone) {

      if (arguments.length < 3) {
        throw ("Row widget: Constructor missing parameter " +
            "list [index, position, rowHeight]");
      }

      // use module pattern for instance object
      var module = function() {

          /**
           * @api private
           */
          var _kRow_Node = {
            Tag: 'div',
            Class: 'qowt-sheet-row',
            Position: 'absolute'
          },
            _kRow_Node_Header = {
              Tag: 'div',
              Class: 'qowt-sheet-row-header',
              Position: 'absolute'
            },
            _kRow_Node_Header_Highlight_Class =
                "qowt-sheet-row-header-highlight",
            _kFormatted_Row_Class = "qowt-sheet-formatted-row",
            _kVertical_Align_Center_Class = "qowt-vertical-align-center",
            _kHorizontal_Align_Center_Class = "qowt-horizontal-align-center",
            _kHide_Top_Border_Class = "qowt-hide-top-border",
            _kFont_Color_Blue_Class = "qowt-font-color-blue",
            _kWide_Top_Border_Class = "qowt-wide-top-border";

          /**
           * @api private
           */
        var _rowNode, _rowNodeHeader,
            _frozenRowHeaderNode,
            _index = index,
            _cells = [],

            _actualHeight, _actualPos, _actualWidth,
              _isHeaderStyledAboveHidden, _isHeaderStyledBelowHidden,

            _preppedHeight, _preppedPos, _preppedHeaderValue,
            _preppedHeaderStyleAboveHidden = false,
            _preppedHeaderStyleBelowHidden = false,

            _preHiddenHeight,

            _isHeaderHighlighted,

            _backgroundDecorator,

            _isHeightUserDefined = false,
            _headerFrozen = false;

          /**
           * @api private
           */
          var _api = {

            /**
             * Gets the height of the row
             *
             * @return {integer} The height of the row
             * @method getHeight()
             */
            getHeight: function() {
              return _actualHeight;
            },

            /**
             * Gets the height of the row before it was hidden
             *
             * @return {integer} The height of the row before it was hidden
             * @method getPreHiddenHeight()
             */
            getPreHiddenHeight: function() {
              return _preHiddenHeight;
            },

            /**
             * Gets the position of the row
             *
             * @return {integer} The position of the row
             * @method getPosition()
             */
            getPosition: function() {
              return _actualPos;
            },

            /**
             * Gets the index of the row
             *
             * @return {integer} The index of the row
             * @method getIndex
             */
            getIndex: function() {
              return _index;
            },

            /**
             * Gets the width of the row
             *
             * @return {integer} The width of the row
             * @method getWidth()
             */
            getWidth: function() {
              return _actualWidth;
            },

            /**
             * Returns whether or not the row's header is highlighted
             *
             * @return {boolean} A boolean value indicating whether the row's
             *                   header is highlighted (true) or not (false)
             * @method isHeaderHighlighted()
             */
            isHeaderHighlighted: function() {
              return _isHeaderHighlighted;
            },

            isHeightUserDefined: function() {
              return _isHeightUserDefined;
            },

            /**
             * Returns whether or not the rows's header is styled as above a
             * hidden row
             *
             * @return {boolean} A boolean value indicating whether the row's
             *                   header is styled as above a hidden row
             * @method isHeaderStyledAboveHidden()
             */
            isHeaderStyledAboveHidden: function() {
              return _isHeaderStyledAboveHidden;
            },

            /**
             * Returns whether or not the row's header is styled as below a
             * hidden row
             *
             * @return {boolean} A boolean value indicating whether the row's
             *                   header is styled as below a hidden row
             * @method isHeaderStyledBelowHidden()
             */
            isHeaderStyledBelowHidden: function() {
              return _isHeaderStyledBelowHidden;
            },

            /**
             * Gets the number of cells in the row
             *
             * @return {integer} The number of cells
             * @method getNumOfCells()
             */
            getNumOfCells: function() {
              return _cells.length;
            },

            /**
             * Gets the array of cells in the row
             *
             * @return {object} The array of cells
             * @method getCells()
             */
            getCells: function() {
              return _cells;
            },

            /**
             * Gets the row header node
             *
             * @return {object} The row header node
             * @method getHeaderNode()
             */
            getHeaderNode: function() {
              return _rowNodeHeader;
            },

            /**
             * Gets the row node
             *
             * @return {object} The row node
             * @method getColumnNode()
             */
            getRowNode: function() {
              return _rowNode;
            },

            /**
             * Gets the prepared bottom position of the row.
             * This is the bottom position of the row after
             * the row has been prepared for layout.
             *
             * @return {integer} The prepared bottom position of the row
             * @method getPreppedBottomPos()
             */
            getPreppedBottomPos: function() {
              var bottomPos = (_preppedPos !== -1) ? _preppedPos : _actualPos;
              bottomPos += (_preppedHeight !== -1) ?
                  _preppedHeight : _actualHeight;
              return bottomPos;
            },

            /**
             * Gets the prepared height of the row.
             * This is the height of the row after
             * the row has been prepared for layout.
             *
             * @return {integer} The prepared height of the row
             * @method getPreppedHeight()
             */
            getPreppedHeight: function() {
              var height = (_preppedHeight !== -1) ?
                  _preppedHeight : _actualHeight;
              return height;
            },

            /**
             * Gets the prepared position of the row.
             * This is the position of the row after
             * the row has been prepared for layout.
             *
             * @return {integer} The prepared position of the row
             * @method getPreppedPosition()
             */
            getPreppedPosition: function() {
              var position = (_preppedPos !== -1) ? _preppedPos : _actualPos;
              return position;
            },

            /**
             * Gets the prepared header value flag of the row.
             * This is a flag indicating whether or not the header
             * value needs to be updated after the row has been prepared for
             * layout.
             *
             * @return {integer} The prepared header value flag of the row
             * @method getPreppedHeaderValue()
             */
            getPreppedHeaderValue: function() {
              return _preppedHeaderValue;
            },

            /**
             * Gets the prepared header style above hidden flag of the row.
             * This is a flag indicating whether or not the header
             * needs to be styled as being above a hidden row
             * after the row has been prepared for layout.
             *
             * @return {integer} The prepared header style above hidden flag of
             * the row
             * @method getPreppedHeaderStyleAboveHidden()
             */
            getPreppedHeaderStyleAboveHidden: function() {
              return _preppedHeaderStyleAboveHidden;
            },

            /**
             * Gets the prepared header style below hidden flag of the row.
             * This is a flag indicating whether or not the header
             * needs to be styled as being below a hidden row
             * after the row has been prepared for layout.
             *
             * @return {integer} The prepared header style below hidden flag of
             * the row
             * @method getPreppedHeaderStyleBelowHidden()
             */
            getPreppedHeaderStyleBelowHidden: function() {
              return _preppedHeaderStyleBelowHidden;
            },

            /**
             * Prepares the row for cell layout info.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the cell layouting, but it does not actually update
             * the layout or do any HTML DOM 'sets'.
             *
             * WARNING: Calling this method may cause a relayout of the HTML DOM
             * render tree!
             *
             * @return {boolean} A flag indicating whether this row is dirty -
             * i.e. whether it requires a bursting layout or not
             * @method prepLayoutInfo()
             */
            prepLayoutInfo: function() {
              // JELTE TODO: prepare bursting information here...
              // by looping through the cell content and calling prepLayout on
              // each. this is actually awkward because bursting is not just
              // setting the cell's position but also turning neighbouring cell
              // borders on and off.... should that be prepared first and then
              // actually *set* in the cell.layout() ?
              var cellsLength = _cells.length;
              if (cellsLength > 0) {
                for (var i = 0; i < cellsLength; i++) {
                  var cell = _cells[i];
                  if (cell !== undefined) {
                    if (!cell.contentWidth && cell.hasHAlignCenter()) {
                      cell.cacheCellContentWidth();
                    }
                    cell.prepBorders();
                  }
                }
              }
              return false;
            },

            /**
             * Prepares the row for height layout.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the height layout, but it does not actually update the
             * height or do any HTML DOM 'sets'.
             *
             * WARNING: Calling this method may cause a relayout of the HTML DOM
             * render tree!
             *
             * @param height {integer or undefined} The desired height of the
             *                                      row; if this is undefined
             *                                      then the height is
             *                                      automatically calculated as
             *                                      the maximum height of the
             *                                      cells in the row or the
             *                                      default row height of the
             *                                      sheet - whichever is largest
             * @param {integer} resizedColIndex - The index of the column which
             *    has been re-sized.
             * @return {boolean}                    A flag indicating whether
             *                                      this row is dirty - i.e.
             *                                      whether it requiresa height
             *                                      layout or not
             * @method prepLayoutHeight(height)
             */
            prepLayoutHeight: function(height, resizedColIndex) {
              // use the specified height if one is given
              if (height !== undefined) {
                _isHeightUserDefined = true;
                _preppedHeight = height;
              }
              // otherwise, if 'height' is undefined, use the max cell height
              // (or the default row height if this is larger than the max cell
              // height)
              else {
                _isHeightUserDefined = false;
                var maxHeight = SheetModel._defaultRowHeightInPx;
                _preppedHeight = maxHeight;
                var cellsLength = _cells.length;
                if (cellsLength > 0) {
                  for (var i = 0; i < cellsLength; i++) {
                    var cell = _cells[i];
                    if (cell !== undefined) {
                      if (!cell.contentHeight || cell.x === resizedColIndex) {
                        cell.cacheCellContentHeight();
                      }
                      var cellHeight = cell.contentHeight || 0;
                      maxHeight = Math.max(cellHeight, maxHeight);
                    }
                  }
                  _preppedHeight = maxHeight;
                }
                // if row is empty and has no user defined height, then check
                // for 'rowsHiddenByDefault' value and set height to zero.
                else if (SheetModel.rowsHiddenByDefault &&
                    SheetModel.NonEmptyRowIndexArray.indexOf(_index) === -1) {
                  _preppedHeight = 0;
                }
              }
              return _preppedHeight !== -1;
            },

            /**
             * Prepares the row for position layout.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the position layout, but it does not actually update
             * the position or do any HTML DOM 'sets'.
             *
             * @param pos {integer} The desired position of the row
             * @return {boolean}    A flag indicating whether this row is dirty
             *                      - i.e. whether it requires a position layout
             *                      or not
             * @method prepLayoutPos(pos)
             */
            prepLayoutPos: function(pos) {
              if (pos !== _actualPos) {
                _preppedPos = pos;
              }

              return _preppedPos !== -1;
            },

            /**
             * Prepares the row for header layout.
             * This method may do HTML DOM 'gets' to gather the necessary data
             * to perform the header layout, but it does not actually update the
             * header or do any HTML DOM 'sets'.
             *
             * @param doUpdateValue {boolean}           A flag indicating
             *                                          whether the header's
             *                                          value needs to be
             *                                          updated (e.g. from '4'
             *                                          to '5')
             * @param doStyleAsAboveHiddenRow {boolean} A flag indicating
             *                                          whether the header needs
             *                                          to be styled as being
             *                                          above a hidden row
             * @param doStyleAsBelowHiddenRow {boolean} A flag indicating
             *                                          whether the header needs
             *                                          to be styled as being
             *                                          below a hidden row
             * @return {boolean}              A flag indicating whether this row
             *                                is dirty - i.e. whether it
             *                                requires a header layout or not
             * @method prepLayoutHeader()
             */
          prepLayoutHeader: function(doUpdateValue, doStyleAsAboveHiddenRow,
              doStyleAsBelowHiddenRow) {
              var dirty = false;

              if (doUpdateValue === true) {
                _preppedHeaderValue = true;
                dirty = true;
              }

              if (doStyleAsAboveHiddenRow !== _isHeaderStyledAboveHidden) {
                _preppedHeaderStyleAboveHidden = doStyleAsAboveHiddenRow;
                dirty = true;
              }

              if (doStyleAsBelowHiddenRow !== _isHeaderStyledBelowHidden) {
                _preppedHeaderStyleBelowHidden = doStyleAsBelowHiddenRow;
                dirty = true;
              }

              return dirty;
            },

            /**
             * Performs a layout of the row.
             * This can involve updating the bursting, height, position and
             * header of the row.
             *
             * This method uses pre-prepared data to perform the row layout -
             * it does not do any HTML DOM 'gets' to gather this data.
             * It does do HTML DOM 'sets' to update the necessary aspects of
             * the row.
             *
             * @param idx {integer}    The index of the row. NOTE: the index of
             *                          a row widget can change as rows are
             *                          inserted and deleted from the grid.
             *                          The index of this row may be updated
             *                          internally here
             * @method layout(idx)
             */
            layout: function(idx) {
              // LM TODO: Implement 'if' branch for bursting
              if (_preppedHeight !== -1) {
                _setHeight(idx, _preppedHeight);
              }

              if (_preppedPos !== -1) {
                _setPosition(idx, _preppedPos);
              }

              if (_preppedHeaderValue !== false) {
                _setHeader(idx);
              }

              var headerCommonStyling;

              if (_preppedHeaderStyleAboveHidden !==
                  _isHeaderStyledAboveHidden) {
                headerCommonStyling |= _setHeaderAboveStyling(idx);
              }

              if (_preppedHeaderStyleBelowHidden !==
                  _isHeaderStyledBelowHidden) {
                headerCommonStyling |= _setHeaderBelowStyling(idx);
              }

              if (headerCommonStyling !== undefined) {
                _setHeaderCommonStyling(headerCommonStyling);
              }

              // update all cells in this row too
              var cellsLength = _cells.length;
              for (var i = 0; i < cellsLength; i++) {
                var cell = _cells[i];
                if (cell !== undefined) {
                  // LM TODO: do we need to pass the x,y values of this cell
                  // here, incase they have changed due to a row/col insert or
                  // delete? (like we do above when we pass the rowIndex
                  // in _setHeight() etc)
                  cell.setRowHeightUserDefined(_isHeightUserDefined);
                  cell.topPosition = _actualPos;
                  cell.height = _actualHeight;
                }
              }

              // reset the prepped values
              _resetPrepped();
            },

            /**
             * Sets the row's width to the specified value
             *
             * @param width {integer} The width
             * @method setWidth(width)
             */
            setWidth: function(width) {
              if (width !== _actualWidth) {
                _rowNode.style.width = width + "px";
                _actualWidth = width;
              }
            },

            /**
             * Stores the pre-hidden height of the row
             *
             * @param height {integer} The pre-hidden height of the row
             * @method setPreHiddenHeight(height)
             */
            setPreHiddenHeight: function(height) {
              _preHiddenHeight = height;
            },

            /**
             * Removes this row's cell references
             *
             * @method removeCells()
             */
            removeCells: function() {
              _cells = [];
            },

            /**
             * Highlights the row's header depending on the specified boolean
             * value.
             * This is used to distinguish this row's header from the other
             * row headers when a cell is selected in this row
             *
             * @param doHighlight {boolean} A flag indicating whether to
             *                              highlight the row's header (true) or
             *                              not (false)
             * @method highlightHeader(doHighlight)
             */
            highlightHeader: function(doHighlight) {
              if (_isHeaderHighlighted !== doHighlight) {
                if (doHighlight) {
                  _rowNodeHeader.classList.add(
                      _kRow_Node_Header_Highlight_Class);
                  if (_headerFrozen && _frozenRowHeaderNode) {
                    _frozenRowHeaderNode.classList.add(
                        _kRow_Node_Header_Highlight_Class);
                  }
                } else {
                  _rowNodeHeader.classList.remove(
                      _kRow_Node_Header_Highlight_Class);
                  if (_headerFrozen && _frozenRowHeaderNode) {
                    _frozenRowHeaderNode.classList.remove(
                        _kRow_Node_Header_Highlight_Class);
                  }
                }
                _isHeaderHighlighted = doHighlight;
              }
            },

            /**
             * Every widget has an appendTo() method.
             * This is used to append the HTML elements of the widget to a
             * specified node in the HTML DOM.
             * Here the row div element is appended as a child to the specified
             * node and the row's header div element is appended as a child of
             * the row header container
             *
             * @param node {object} The HTML node that this widget is to append
             *                      itself to
             * @param appendHeaderNode {boolean} true if header node is to be
             *                                   appended to row header
             *                                   container.
             *
             * @method appendTo(node)
             */
            appendTo: function(node, appendHeaderNode) {
              if (node === undefined) {
                throw ("appendTo - missing node parameter!");
              }

              if (_rowNode) {
                node.appendChild(_rowNode);
              }

              // insert-row operation adds new row to all the panes if panes are
              // frozen. Row is added to base node of every pane. However
              // header node is added to rowheaderContainer every time.
              // Please refer crbug-346594 for more details.
              // To fix this issue, instead of adding header by default, it is
              // added only when appendHeaderNode is true. This avoids duplicate
              // entries of header node in rowHeaderContainer.
              if (_rowNodeHeader && appendHeaderNode) {
                RowHeaderContainer.container().appendChild(_rowNodeHeader);
              }
            },

            /**
             * Clones this row widget and appends the cloned HTML elements to
             * the specified node.
             * The row div element is appended as a child to the specified node.
             *
             * @param node {object}                    The HTML node that the
             *                                         cloned widget is to
             *                                         append itself to
             * @method cloneTo(node)
             * @return {object}                        The cloned widget
             */
          cloneTo: function(node) {
              if (node === undefined) {
                throw ("cloneTo - missing node parameter!");
              }

              var clone = _factory.create(_index, _actualPos,
                  _actualHeight, this);

              if (clone.getRowNode()) {
                node.appendChild(clone.getRowNode());
              }

            return clone;
          },

          /**
           * Appends the row's header div element as a child of the frozen row
           * header container.
           */
          addFrozenRowHeader: function(clonedRow) {
            // A cloned row's header is never added to the normal
              // row header container (which already contains all row headers
              // from the main pane's rows)
              // LM TODO: So a cloned row might have a header div that is never
              // actually used - perhaps something to revisit but leave this for
              // now as it keeps the row widget code uncluttered without
              // 'if(_rowNodeHeader !== undefined)' everywhere.

            // Makes sure the frozen row headers are added only once
            if (clonedRow.getHeaderNode() &&
                clonedRow.getHeaderNode().textContent !==
                    RowHeaderContainer.frozenContainer().
                        lastChild.textContent) {
              _frozenRowHeaderNode = clonedRow.getHeaderNode();
                _headerFrozen = true;
                RowHeaderContainer.frozenContainer().appendChild(
                    _frozenRowHeaderNode);
              }
          },

          /**
           * Resets the _headerFrozen flag and _frozenRowHeaderNode.
           * Called when unfreezing the panes.
           */
          resetFrozenRowHeader: function() {
            _frozenRowHeaderNode = undefined;
            _headerFrozen = false;
            },

            /**
             * Attach the specified widget to this widget.
             * Here the specified cell widget is attached to this row widget
             *
             * @param widget {object} A cell widget
             * @method attachWidget(widget)
             */
            attachWidget: function(widget) {
              if (widget === undefined) {
                throw ("attachWidget - missing widget parameter!");
              }
              _cells[widget.x] = widget;
            },

            /**
             * Detach the specified widget from this widget.
             * Here the specified cell widget is detached from this row widget
             *
             * @param widget {object} A cell widget
             * @method detachWidget(widget)
             */
            detachWidget: function(widget) {
              if (widget === undefined) {
                throw ("detachWidget - missing widget parameter!");
              }
              _cells[widget.x] = undefined;
            },

            /**
             * Applies background formatting that has been received
             * for a row. The row background color is set on the row div.
             *
             * @param {string} backgroundColor - The background color
             * @see dcplegacyservice-cpp-main/schemas/objects/
             *  SheetFormatting-object-schema.json
             * @method applyBackgroundAndBorders(backgroundColor)
             */
            applyBackgroundAndBorders: function(backgroundColor) {
              if (backgroundColor) {
                _backgroundDecorator = BackgroundDecorator.create(_rowNode);
                _backgroundDecorator.decorate(backgroundColor);
                _rowNode.classList.add(_kFormatted_Row_Class);
              }
            },

            /**
             * Sets the formatting information for this row
             *
             * @param formatting {object} The row formatting data, as
             *                            represented in the schema
             * @see dcplegacyservice-cpp-main/schemas/objects/
             *  SheetFormatting-object-schema.json
             * @method setFormatting(formatting)
             */
            setFormatting: function(formatting) {
              SheetModel.RowFormatting[_index] = formatting;
            },

            /**
             * Returns the formatting information for this row
             *
             * @return {object} The formatting for the row
             * @see dcplegacyservice-cpp-main/schemas/objects/
             *  SheetFormatting-object-schema.json
             * @method getFormatting()
             */
            getFormatting: function() {
              return SheetModel.RowFormatting[_index];
            },

            /**
             * Returns the cell from a given index
             *
             * @param x {Number} An index
             * @method getCell(x)
             */
            getCell: function(x) {
              return _cells[x];
            },

            /**
             * Resets the formatting on the row node.
             * NOTE: This method will not affect the layout information
             * (including header).
             *
             * @method resetFormatting()
             */
            resetFormatting: function() {
              _rowNode.className = _kRow_Node.Class;
              SheetModel.RowFormatting[_index] = undefined;
              if (_backgroundDecorator) {
                _backgroundDecorator.undecorate();
                _backgroundDecorator = undefined;
              }

              BorderDecorator.undecorate(_rowNode);
            },


            /**
             * Makes space in the row's internal cells array for newly inserted
             * cols
             *
             * @param {integer} colIndexToInsertAt Where the cols were inserted
             * @param {integer} numOfCols How many cols have been inserted
             */
            insertCells: function(colIndexToInsertAt, numOfCols) {
              for(var i = 0; i < numOfCols; i++) {
                _cells.splice(colIndexToInsertAt, 0, undefined);
              }
            },

            /**
             * Deletes cells in the row's internal cells array
             *
             * @param {integer} colIndexToDeleteAt Where the cols were deleted
             * @param {integer} numOfCols How many cols have been deleted
             */
            deleteCells: function(colIndexToDeleteAt, numOfCols) {
              _cells.splice(colIndexToDeleteAt, numOfCols);
            },

            /**
             * Updates the new row index in the header node and also in the
             * cells inside the row. Does not keep track of it anymore
             * internally.
             *
             * @param {integer} idx new index of the row
             */
           updateIndex: function(idx) {
             _index = idx;
             _setHeader(_index);
             var cell, len = _cells.length;
             for (var i = 0; i < len; i++) {
               cell = _cells[i];
               if (cell !== undefined) {
                 cell.updateRowIndex(_index);
               }
             }
           },

            /**
             * Removes every node related to this row from the node.
             * This includes then row header and the cells in the row.
             *
             * @param {node} baseNode doc fragment where deleted row nodes
             *               should be appended to
             * @param {node} contentNode doc fragment where deleted content
             *               nodes should be appended to
             */
           removeFromParent: function(baseNode, contentNode) {
             var cell, len = _cells.length;
             for (var i = 0; i < len; i++) {
               cell = _cells[i];
               if (cell !== undefined) {
                 cell.removeFromParent(contentNode);
               }
             }
             if (_rowNode) {
               _rowNode.removeElm();
               baseNode.appendChild(_rowNode);
             }

             if (_rowNodeHeader) {
               _rowNodeHeader.removeElm();
             }
           },

           /**
            * Reappends the header node.
            */
           reappendHeader: function() {
             if (_rowNodeHeader) {
               RowHeaderContainer.container().appendChild(_rowNodeHeader);
             }
           },

           /**
            * Returns true when row is hidden, false otherwise
            *
            * @return {boolean} true/false
            */
           isHidden: function() {
             return _api.getHeight() <= 0;
           }
          };

          /**
           * @api private
           */
          var _init = function() {
              if (rowToClone === undefined) {
                _createDefaultRow();
              } else {
                _createClonedRow();
              }
            };

          var _createDefaultRow = function() {

              var rowHeightInPx = (rowHeight !== undefined) ?
                  rowHeight : SheetConfig.kGRID_DEFAULT_ROW_HEIGHT;

              _rowNodeHeader = document.createElement(_kRow_Node_Header.Tag);
              _rowNodeHeader.style.position = _kRow_Node_Header.Position;
              _rowNodeHeader.style.left = 0;
              _rowNodeHeader.className = _kRow_Node_Header.Class;
              _rowNodeHeader.classList.add(_kVertical_Align_Center_Class);
              _rowNodeHeader.classList.add(_kHorizontal_Align_Center_Class);
              _setHeader(_index);

              _rowNode = document.createElement(_kRow_Node.Tag);
              _rowNode.style.position = _kRow_Node.Position;
              _rowNode.style.left = 0;
              _rowNode.style.width = (SheetConfig.kGRID_DEFAULT_COLS *
                  SheetConfig.kGRID_DEFAULT_COL_WIDTH) + "px";
              _rowNode.className = _kRow_Node.Class;

              _actualHeight = -1;
              _actualPos = 0;
              _actualWidth = 0;
              _isHeaderStyledAboveHidden = false;
              _isHeaderStyledBelowHidden = false;

              _preppedHeight = -1;
              _preppedPos = -1;
              _preppedHeaderValue = false;
              _preppedHeaderStyleAboveHidden = false;
              _preppedHeaderStyleBelowHidden = false;

              _preHiddenHeight = -1;

              _isHeaderHighlighted = false;

              _setHeight(_index, rowHeightInPx);
              _setPosition(_index, position);
            };

          var _createClonedRow = function() {

              // LM TODO: Do we need to use a new id?
              _rowNodeHeader = rowToClone.getHeaderNode().cloneNode(true);
              _setHeader(_index);

              // LM TODO: Do we need to use a new id?
              _rowNode = rowToClone.getRowNode().cloneNode(true);
              _actualHeight = rowToClone.getHeight();
              _actualPos = rowToClone.getPosition();
              _actualWidth = rowToClone.getWidth();

              _isHeaderStyledAboveHidden =
                  rowToClone.isHeaderStyledAboveHidden();
              _isHeaderStyledBelowHidden =
                  rowToClone.isHeaderStyledBelowHidden();

              _preppedHeight = rowToClone.getPreppedHeight();
              _preppedPos = rowToClone.getPreppedPosition();
              _preppedHeaderValue = rowToClone.getPreppedHeaderValue();
              _preppedHeaderStyleAboveHidden =
                  rowToClone.getPreppedHeaderStyleAboveHidden();
              _preppedHeaderStyleBelowHidden =
                  rowToClone.getPreppedHeaderStyleBelowHidden();

              _preHiddenHeight = rowToClone.getPreHiddenHeight();

              _isHeaderHighlighted = rowToClone.isHeaderHighlighted();

              _isHeightUserDefined = rowToClone.isHeightUserDefined();
            };

          /**
           * @api private
           */
          var _setHeight = function(idx, height) {
              if ((idx === undefined) || (height === undefined)) {
                throw ("_setHeight - missing parameters!");
              }

              _index = idx;

              _rowNode.style.height = height + "px";
              _rowNodeHeader.style.height = height + "px";

              if ((_actualHeight !== 0) && (height === 0)) {
                // this row is being hidden so effectively collapse its top and
                // bottom borders
                _rowNode.classList.add(_kHide_Top_Border_Class);
              } else if ((_actualHeight === 0) && (height !== 0)) {
                // this row is being unhidden so restore its borders
                _rowNode.classList.remove(_kHide_Top_Border_Class);
              }

              // incase this row is being hidden, cache the current
              // height for use if/when the row is unhidden again
              _preHiddenHeight = (_actualHeight === -1) ?
                  height : _actualHeight;

              _actualHeight = height;

              // store the row height in the model so that other modules
              // can easily access it without causing circular dependencies
              SheetModel.RowHeights = SheetModel.RowHeights || [];
              SheetModel.RowHeights[_index] = _actualHeight;
            };

          /**
           * @api private
           */
          var _setPosition = function(idx, pos) {
              if ((idx === undefined) || (pos === undefined)) {
                throw ("_setPosition - missing parameters!");
              }

              _index = idx;

              _rowNode.style.top = pos + "px";
              _rowNodeHeader.style.top = pos + "px";
              _actualPos = pos;

              // store the row position in the model so that other modules
              // can easily access it without causing circular dependencies
              SheetModel.RowPos = SheetModel.RowPos || [];
              SheetModel.RowPos[_index] = _actualPos;
            };

          /**
           * @api private
           */
          var _setHeader = function(idx) {
              _index = idx;

              // set the header based on the current index value
              _rowNodeHeader.textContent = idx + 1;
            };

          var _setHeaderAboveStyling = function(idx) {
              _index = idx;

              // no specific styling for above
              _isHeaderStyledAboveHidden = _preppedHeaderStyleAboveHidden;

              return _isHeaderStyledAboveHidden;
            };

          var _setHeaderBelowStyling = function(idx) {
              _index = idx;

              if (_preppedHeaderStyleBelowHidden === true) {
                // set the header to have wide top border styling
                _rowNodeHeader.classList.add(_kWide_Top_Border_Class);
              } else {
                _rowNodeHeader.classList.remove(_kWide_Top_Border_Class);
              }

              _isHeaderStyledBelowHidden = _preppedHeaderStyleBelowHidden;

              return _isHeaderStyledBelowHidden;
            };

          var _setHeaderCommonStyling = function(headerCommonStyling) {
              if (headerCommonStyling === 1) {
                 // blue font color
                _rowNodeHeader.classList.add(_kFont_Color_Blue_Class);
              } else { // headerCommonStyling === 0
                _rowNodeHeader.classList.remove(_kFont_Color_Blue_Class);
              }
            };

          /**
           * @api private
           */
          var _resetPrepped = function() {
              _preppedHeight = -1;
              _preppedPos = -1;
              _preppedHeaderValue = false;
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
